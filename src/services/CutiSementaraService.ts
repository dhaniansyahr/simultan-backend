import { FilteringQueryV2, PagedList } from "$entities/Query";
import {
    BadRequestWithMessage,
    INTERNAL_SERVER_ERROR_SERVICE_RESPONSE,
    INVALID_ID_SERVICE_RESPONSE,
    ServiceResponse,
} from "$entities/Service";
import Logger from "$pkg/logger";
import { prisma } from "$utils/prisma.utils";
import { CutiSementara, VerifikasiStatusBagianKemahasiswaan } from "@prisma/client";
import { CutiSementaraDTO, VerifikasiCutiDTO } from "$entities/CutiSementara";
import { buildFilterQueryLimitOffsetV2 } from "./helpers/FilterQueryV2";
import { UserJWTDAO } from "$entities/User";
import { ulid } from "ulid";
import { getNextVerificationStatus } from "$utils/helper.utils";

export type CreateResponse = CutiSementara | {};
export async function create(data: CutiSementaraDTO, user: UserJWTDAO): Promise<ServiceResponse<CreateResponse>> {
    try {
        const initialStatus = await prisma.status.create({
            data: {
                ulid: ulid(),
                nama: VerifikasiStatusBagianKemahasiswaan.DIPROSES_OPERATOR_KEMAHASISWAAN,
                deskripsi: `Pengajuan Cuti oleh ${user.nama} dan ${VerifikasiStatusBagianKemahasiswaan.DIPROSES_OPERATOR_KEMAHASISWAAN}`,
                userId: user.id,
            },
        });

        // Create the letter
        const cuti = await prisma.cutiSementara.create({
            data: {
                ulid: ulid(),
                alasanPengajuan: data.alasanPengajuan,
                suratBebasPustakaUrl: data.suratBebasPustakaUrl,
                suratBssUrl: data.suratBssUrl,
                suratIzinOrangTuaUrl: data.suratIzinOrangTuaUrl,
                verifikasiStatus: VerifikasiStatusBagianKemahasiswaan.DIPROSES_OPERATOR_KEMAHASISWAAN,
                statusId: initialStatus.id,
                userId: user.id,
            },
        });

        // Create log entry
        await prisma.log.create({
            data: {
                ulid: ulid(),
                flagMenu: "SURAT_KETERANGAN_KULIAH",
                deskripsi: `Pengajuan Cuti Sementara baru dengan ID ${cuti.ulid}`,
                aksesLevelId: user.aksesLevelId,
                userId: user.id,
            },
        });

        return {
            status: true,
            data: cuti,
        };
    } catch (err) {
        Logger.error(`CutiSementaraService.create : ${err}`);
        return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
}

export type GetAllResponse = PagedList<CutiSementara[]> | {};
export async function getAll(filters: FilteringQueryV2, user: UserJWTDAO): Promise<ServiceResponse<GetAllResponse>> {
    try {
        const usedFilters = buildFilterQueryLimitOffsetV2(filters);

        const aksesLevel = await prisma.aksesLevel.findUnique({
            where: {
                id: user.aksesLevelId,
            },
        });

        if (!aksesLevel) return BadRequestWithMessage("Akses level tidak ditemukan");

        // For Mahasiswa
        if (aksesLevel.name === "MAHASISWA") {
            usedFilters.where.AND.push({
                userId: user.id,
            });
        }

        // For Operator and Kasubbag, show letters that are not yet approved or rejected
        if (aksesLevel.name === "OPERATOR_KEMAHASISWAAN" || aksesLevel.name === "KASUBBAG_KEMAHASISWAAN") {
            usedFilters.where.AND.push({
                verifikasiStatus: {
                    notIn: ["USULAN_DISETUJUI", "USULAN_DITOLAK"],
                },
            });
        }

        usedFilters.include = {
            user: {
                select: {
                    nama: true,
                    npm: true,
                },
            },
            status: true,
        };

        const [cutiSementara, totalData] = await Promise.all([
            prisma.cutiSementara.findMany(usedFilters),
            prisma.cutiSementara.count({
                where: usedFilters.where,
            }),
        ]);

        let totalPage = 1;
        if (totalData > usedFilters.take) totalPage = Math.ceil(totalData / usedFilters.take);

        return {
            status: true,
            data: {
                entries: cutiSementara,
                totalData,
                totalPage,
            },
        };
    } catch (err) {
        Logger.error(`CutiSementaraService.getAll : ${err} `);
        return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
}

export type GetByIdResponse = CutiSementara | {};
export async function getById(id: string): Promise<ServiceResponse<GetByIdResponse>> {
    try {
        let cutiSementara = await prisma.cutiSementara.findUnique({
            include: {
                user: {
                    select: {
                        nama: true,
                        npm: true,
                    },
                },
                status: true,
            },
            where: {
                ulid: id,
            },
        });

        if (!cutiSementara) return INVALID_ID_SERVICE_RESPONSE;

        return {
            status: true,
            data: cutiSementara,
        };
    } catch (err) {
        Logger.error(`CutiSementaraService.getById : ${err}`);
        return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
}

export async function verificationStatus(
    id: string,
    data: VerifikasiCutiDTO,
    user: UserJWTDAO
): Promise<ServiceResponse<{}>> {
    try {
        const cuti = await prisma.cutiSementara.findUnique({
            where: { ulid: id },
        });

        if (!cuti) return INVALID_ID_SERVICE_RESPONSE;

        const currentStatus = cuti.verifikasiStatus;
        let nextStatus: VerifikasiStatusBagianKemahasiswaan;

        if (data.action === "USULAN_DISETUJUI") {
            nextStatus = getNextVerificationStatus(currentStatus);
        } else {
            nextStatus = VerifikasiStatusBagianKemahasiswaan.USULAN_DITOLAK;
        }

        // Create new status
        const newStatus = await prisma.status.create({
            data: {
                ulid: ulid(),
                nama: nextStatus,
                deskripsi:
                    data.action === "USULAN_DISETUJUI"
                        ? `Surat disetujui oleh ${user.nama}`
                        : `Surat ditolak oleh ${user.nama}: ${data.alasanPenolakan}`,
                userId: user.id,
            },
        });

        const updateCuti = await prisma.cutiSementara.update({
            where: { ulid: id },
            data: {
                verifikasiStatus: nextStatus,
                statusId: newStatus.id,
                alasanPenolakan: data.action === "USULAN_DITOLAK" ? data.alasanPenolakan : null,
            },
        });

        await prisma.log.create({
            data: {
                ulid: ulid(),
                flagMenu: "CUTI_SEMENTARA",
                deskripsi: `Verifikasi surat: ${nextStatus}`,
                aksesLevelId: user.aksesLevelId,
                userId: user.id,
            },
        });

        return {
            status: true,
            data: updateCuti,
        };
    } catch (error) {
        Logger.error(`CutiSementaraService.verificationStatus : ${error}`);
        return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
}
