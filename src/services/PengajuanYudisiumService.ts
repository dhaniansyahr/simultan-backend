import { FilteringQueryV2, PagedList } from "$entities/Query";
import {
        BadRequestWithMessage,
        INTERNAL_SERVER_ERROR_SERVICE_RESPONSE,
        INVALID_ID_SERVICE_RESPONSE,
        ServiceResponse,
} from "$entities/Service";
import Logger from "$pkg/logger";
import { prisma } from "$utils/prisma.utils";
import { PengajuanYudisiumDTO, VerifikasiPengajuanYudisiumDTO } from "$entities/PengajuanYudisium";
import { buildFilterQueryLimitOffsetV2 } from "./helpers/FilterQueryV2";
import { ulid } from "ulid";
import { VerifikasiStatusBagianAkademik } from "@prisma/client";
import { UserJWTDAO } from "$entities/User";
import { flowCreatingStatusVeificationAkademik, getNextVerificationStatusAkademik } from "$utils/helper.utils";

export type CreateResponse = PengajuanYudisiumDTO | {};
export async function create(data: PengajuanYudisiumDTO, user: UserJWTDAO): Promise<ServiceResponse<CreateResponse>> {
        try {
                // Create the letter with initial status
                const yudisium = await prisma.pengajuanYudisium.create({
                        data: {
                                ulid: ulid(),
                                dokumenUrl: data.dokumenUrl,
                                verifikasiStatus: VerifikasiStatusBagianAkademik.DIPROSES_OPERATOR_AKADEMIK,
                                userId: user.id,
                                status: {
                                        create: {
                                                ulid: ulid(),
                                                nama: VerifikasiStatusBagianAkademik.DIPROSES_OPERATOR_AKADEMIK,
                                                deskripsi: `Pengajuan Yudisium oleh ${user.nama} dan ${VerifikasiStatusBagianAkademik.DIPROSES_OPERATOR_AKADEMIK}`,
                                                userId: user.id,
                                        },
                                },
                        },
                        include: {
                                status: true,
                        },
                });

                // Create log entry
                await prisma.log.create({
                        data: {
                                ulid: ulid(),
                                flagMenu: "PENGAJUAN_YUDISIUM",
                                deskripsi: `Pengajuan Yudisium baru dengan ID ${yudisium.ulid}`,
                                aksesLevelId: user.aksesLevelId,
                                userId: user.id,
                        },
                });

                return {
                        status: true,
                        data: yudisium,
                };
        } catch (err) {
                Logger.error(`PengajuanYudisiumService.create : ${err}`);
                return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
        }
}

export type GetAllResponse = PagedList<PengajuanYudisiumDTO[]> | {};
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
                if (aksesLevel.name === "OPERATOR_AKADEMIK" || aksesLevel.name === "KASUBBAG_AKADEMIK") {
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

                const [yudisium, totalData] = await Promise.all([
                        prisma.pengajuanYudisium.findMany(usedFilters),
                        prisma.pengajuanYudisium.count({
                                where: usedFilters.where,
                        }),
                ]);

                let totalPage = 1;
                if (totalData > usedFilters.take) totalPage = Math.ceil(totalData / usedFilters.take);

                return {
                        status: true,
                        data: {
                                entries: yudisium,
                                totalData,
                                totalPage,
                        },
                };
        } catch (err) {
                Logger.error(`PengajuanYudisiumService.getAll : ${err} `);
                return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
        }
}

export type GetByIdResponse = PengajuanYudisiumDTO | {};
export async function getById(id: string): Promise<ServiceResponse<GetByIdResponse>> {
        try {
                let yudisium = await prisma.pengajuanYudisium.findUnique({
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

                if (!yudisium) return INVALID_ID_SERVICE_RESPONSE;

                return {
                        status: true,
                        data: yudisium,
                };
        } catch (err) {
                Logger.error(`PengajuanYudisiumService.getById : ${err}`);
                return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
        }
}

export async function verificationStatus(
        id: string,
        data: VerifikasiPengajuanYudisiumDTO,
        user: UserJWTDAO
): Promise<ServiceResponse<{}>> {
        try {
                const yudisium = await prisma.pengajuanYudisium.findUnique({
                        where: { ulid: id },
                        include: {
                                status: true,
                        },
                });

                if (!yudisium) return INVALID_ID_SERVICE_RESPONSE;

                const currentStatus = yudisium.verifikasiStatus;
                let nextStatus: VerifikasiStatusBagianAkademik;

                if (data.action === "USULAN_DISETUJUI") {
                        nextStatus = getNextVerificationStatusAkademik(currentStatus);
                } else {
                        nextStatus = VerifikasiStatusBagianAkademik.USULAN_DITOLAK;
                }

                // Update yudisium with new status
                const updateYudisium = await prisma.pengajuanYudisium.update({
                        where: { ulid: id },
                        data: {
                                verifikasiStatus: nextStatus,
                                alasanPenolakan: data.action === "USULAN_DITOLAK" ? data.alasanPenolakan : null,
                                status: {
                                        create: {
                                                ulid: ulid(),
                                                nama: nextStatus,
                                                deskripsi:
                                                        data.action === "USULAN_DISETUJUI"
                                                                ? `Surat disetujui oleh ${user.nama}`
                                                                : `Surat ditolak oleh ${user.nama}: ${data.alasanPenolakan}`,
                                                userId: user.id,
                                        },
                                },
                        },
                        include: {
                                status: true,
                        },
                });

                await prisma.log.create({
                        data: {
                                ulid: ulid(),
                                flagMenu: "PENGAJUAN_YUDISIUM",
                                deskripsi: `Verifikasi Pengajuan Yudisium: ${nextStatus}`,
                                aksesLevelId: user.aksesLevelId,
                                userId: user.id,
                        },
                });

                if (nextStatus !== "USULAN_DISETUJUI" && nextStatus !== "USULAN_DITOLAK") {
                        await flowCreatingStatusVeificationAkademik(
                                nextStatus,
                                yudisium.ulid,
                                user.nama,
                                user.id,
                                true
                        );
                }

                return {
                        status: true,
                        data: updateYudisium,
                };
        } catch (error) {
                Logger.error(`PengajuanYudisiumService.verificationStatus : ${error}`);
                return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
        }
}
