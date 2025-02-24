import { FilteringQueryV2, PagedList } from "$entities/Query";
import {
        BadRequestWithMessage,
        INTERNAL_SERVER_ERROR_SERVICE_RESPONSE,
        INVALID_ID_SERVICE_RESPONSE,
        ServiceResponse,
} from "$entities/Service";
import Logger from "$pkg/logger";
import { prisma } from "$utils/prisma.utils";
import { buildFilterQueryLimitOffsetV2 } from "./helpers/FilterQueryV2";
import { ulid } from "ulid";
import { VerifikasiStatusBagianAkademik } from "@prisma/client";
import { UserJWTDAO } from "$entities/User";
import { flowCreatingStatusVeificationAkademik, getNextVerificationStatusAkademik } from "$utils/helper.utils";
import { LegalisirIjazahDTO, VerifikasiLegalisirIjazahDTO } from "$entities/LegalisirIjazah";

export type CreateResponse = LegalisirIjazahDTO | {};
export async function create(data: LegalisirIjazahDTO, user: UserJWTDAO): Promise<ServiceResponse<CreateResponse>> {
        try {
                // Create the letter with initial status
                const legalisirIjazah = await prisma.legalisirIjazah.create({
                        data: {
                                ulid: ulid(),
                                dokumenUrl: data.dokumenUrl,
                                verifikasiStatus: VerifikasiStatusBagianAkademik.DIPROSES_OPERATOR_AKADEMIK,
                                userId: user.id,
                                status: {
                                        create: {
                                                ulid: ulid(),
                                                nama: VerifikasiStatusBagianAkademik.DIPROSES_OPERATOR_AKADEMIK,
                                                deskripsi: `Pengajuan Legalisir Ijazah oleh ${user.nama}`,
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
                                flagMenu: "SURAT_KETERANGAN_KULIAH",
                                deskripsi: `Pengajuan Legalisir Ijazah baru dengan ID ${legalisirIjazah.ulid}`,
                                aksesLevelId: user.aksesLevelId,
                                userId: user.id,
                        },
                });

                return {
                        status: true,
                        data: legalisirIjazah,
                };
        } catch (err) {
                Logger.error(`LegalisirIjazahService.create : ${err}`);
                return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
        }
}

export type GetAllResponse = PagedList<LegalisirIjazahDTO[]> | {};
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

                const [legalisirIjazah, totalData] = await Promise.all([
                        prisma.legalisirIjazah.findMany(usedFilters),
                        prisma.legalisirIjazah.count({
                                where: usedFilters.where,
                        }),
                ]);

                let totalPage = 1;
                if (totalData > usedFilters.take) totalPage = Math.ceil(totalData / usedFilters.take);

                return {
                        status: true,
                        data: {
                                entries: legalisirIjazah,
                                totalData,
                                totalPage,
                        },
                };
        } catch (err) {
                Logger.error(`LegalisirIjazahService.getAll : ${err} `);
                return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
        }
}

export type GetByIdResponse = LegalisirIjazahDTO | {};
export async function getById(id: string): Promise<ServiceResponse<GetByIdResponse>> {
        try {
                let legalisirIjazah = await prisma.legalisirIjazah.findUnique({
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

                if (!legalisirIjazah) return INVALID_ID_SERVICE_RESPONSE;

                return {
                        status: true,
                        data: legalisirIjazah,
                };
        } catch (err) {
                Logger.error(`LegalisirIjazahService.getById : ${err}`);
                return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
        }
}

export async function verificationStatus(
        id: string,
        data: VerifikasiLegalisirIjazahDTO,
        user: UserJWTDAO
): Promise<ServiceResponse<{}>> {
        try {
                const legalisirIjazah = await prisma.legalisirIjazah.findUnique({
                        where: { ulid: id },
                });

                if (!legalisirIjazah) return INVALID_ID_SERVICE_RESPONSE;

                const currentStatus = legalisirIjazah.verifikasiStatus;
                let nextStatus: VerifikasiStatusBagianAkademik;

                if (data.action === "USULAN_DISETUJUI") {
                        nextStatus = getNextVerificationStatusAkademik(currentStatus);
                } else {
                        nextStatus = VerifikasiStatusBagianAkademik.USULAN_DITOLAK;
                }

                // Update the letter with new status
                const updateLegalisirIjazah = await prisma.legalisirIjazah.update({
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
                                                                ? `Pengajuan disetujui oleh ${user.nama}`
                                                                : `Pengajuan ditolak oleh ${user.nama}: ${data.alasanPenolakan}`,
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
                                flagMenu: "LEGALISIR_IJAZAH",
                                deskripsi: `Verifikasi Lagalisir ijazah: ${nextStatus}`,
                                aksesLevelId: user.aksesLevelId,
                                userId: user.id,
                        },
                });

                if (nextStatus !== "USULAN_DISETUJUI" && nextStatus !== "USULAN_DITOLAK") {
                        await flowCreatingStatusVeificationAkademik(
                                nextStatus,
                                legalisirIjazah.ulid,
                                user.nama,
                                user.id,
                                false
                        );
                }

                return {
                        status: true,
                        data: updateLegalisirIjazah,
                };
        } catch (error) {
                Logger.error(`LegalisirIjazahService.verificationStatus : ${error}`);
                return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
        }
}
