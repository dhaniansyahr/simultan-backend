import { FilteringQueryV2, PagedList } from "$entities/Query";
import { BadRequestWithMessage, INTERNAL_SERVER_ERROR_SERVICE_RESPONSE, INVALID_ID_SERVICE_RESPONSE, ServiceResponse } from "$entities/Service";
import Logger from "$pkg/logger";
import { prisma } from "$utils/prisma.utils";
import { buildFilterQueryLimitOffsetV2 } from "./helpers/FilterQueryV2";
import { ulid } from "ulid";
import { UserJWTDAO } from "$entities/User";
import { VERIFICATION_STATUS } from "$utils/helper.utils";
import { LegalisirIjazahDTO, VerifikasiLegalisirIjazahDTO, ProsesLegalisirIjazahDTO } from "$entities/LegalisirIjazah";
import { LegalisirIjazah, OpsiPengambilan } from "@prisma/client";
import { flowCreatingStatusVeificationAkademik } from "./helpers/LogStatus";

export type CreateResponse = LegalisirIjazahDTO | {};
export async function create(data: LegalisirIjazahDTO, user: UserJWTDAO): Promise<ServiceResponse<CreateResponse>> {
        try {
                // Create the letter with initial status
                const legalisirIjazah = await prisma.legalisirIjazah.create({
                        data: {
                                ...data,
                                ulid: ulid(),
                                verifikasiStatus: VERIFICATION_STATUS.DIPROSES_OPERATOR_AKADEMIK,
                                userId: user.id,
                                status: {
                                        create: {
                                                ulid: ulid(),
                                                nama: VERIFICATION_STATUS.DIPROSES_OPERATOR_AKADEMIK,
                                                deskripsi: `Pengajuan Legalisir Ijazah oleh ${user.nama} - menunggu verifikasi operator akademik`,
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
                                flagMenu: "LEGALISIR_IJAZAH",
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

                // Filter based on user role
                if (aksesLevel.name === "OPERATOR_AKADEMIK") {
                        // Operator sees: letters waiting for their action + letters waiting for letter number input
                        usedFilters.where.AND.push({
                                OR: [{ verifikasiStatus: VERIFICATION_STATUS.DIPROSES_OPERATOR_AKADEMIK }, { verifikasiStatus: VERIFICATION_STATUS.SEDANG_DIPROSES_LEGALISIR }],
                        });
                } else if (aksesLevel.name === "KASUBBAG_AKADEMIK") {
                        // Kasubbag sees: letters waiting for their verification
                        usedFilters.where.AND.push({
                                verifikasiStatus: VERIFICATION_STATUS.DIPROSES_KASUBBAG_AKADEMIK,
                        });
                }

                // Modified include to get all related status records
                usedFilters.include = {
                        user: {
                                select: {
                                        nama: true,
                                        npm: true,
                                },
                        },
                        status: {
                                include: {
                                        user: {
                                                select: {
                                                        nama: true,
                                                        aksesLevel: true,
                                                },
                                        },
                                },
                        },
                };

                usedFilters.orderBy = {
                        createdAt: "asc",
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

export type VerificationResponse = LegalisirIjazah | {};
export async function verificationStatus(id: string, data: VerifikasiLegalisirIjazahDTO, user: UserJWTDAO): Promise<ServiceResponse<VerificationResponse>> {
        try {
                const legalisirIjazah = await prisma.legalisirIjazah.findUnique({
                        where: { ulid: id },
                });

                if (!legalisirIjazah) return INVALID_ID_SERVICE_RESPONSE;

                // Get user's access level
                const aksesLevel = await prisma.aksesLevel.findUnique({
                        where: { id: user.aksesLevelId },
                });

                if (!aksesLevel) return BadRequestWithMessage("Akses level tidak ditemukan!");

                // Check authorization based on current status and user role
                const currentStatus = legalisirIjazah.verifikasiStatus;
                let isAuthorized = false;

                if (currentStatus === VERIFICATION_STATUS.DIPROSES_OPERATOR_AKADEMIK && aksesLevel.name === "OPERATOR_AKADEMIK") {
                        isAuthorized = true;
                } else if (currentStatus === VERIFICATION_STATUS.DIPROSES_KASUBBAG_AKADEMIK && aksesLevel.name === "KASUBBAG_AKADEMIK") {
                        isAuthorized = true;
                }

                if (!isAuthorized) {
                        return BadRequestWithMessage("Anda tidak berwenang untuk memverifikasi pengajuan pada tahap ini!");
                }

                if (data.action === "DISETUJUI") {
                        if (currentStatus === VERIFICATION_STATUS.DIPROSES_OPERATOR_AKADEMIK) {
                                await flowCreatingStatusVeificationAkademik(currentStatus, id, user.nama, user.id, false);
                                await flowCreatingStatusVeificationAkademik(VERIFICATION_STATUS.DISETUJUI_OPERATOR_AKADEMIK, id, user.nama, user.id, false);
                        } else if (currentStatus === VERIFICATION_STATUS.DIPROSES_KASUBBAG_AKADEMIK) {
                                await flowCreatingStatusVeificationAkademik(currentStatus, id, user.nama, user.id, false);
                                await flowCreatingStatusVeificationAkademik(VERIFICATION_STATUS.DISETUJUI_KASUBBAG_AKADEMIK, id, user.nama, user.id, false);
                        }
                } else {
                        // Handle rejection
                        let nextStatus: string;
                        if (aksesLevel.name === "OPERATOR_AKADEMIK") {
                                nextStatus = VERIFICATION_STATUS.DITOLAK;
                        } else {
                                nextStatus = VERIFICATION_STATUS.DITOLAK;
                        }

                        const statusDescription = `Pengajuan ditolak oleh ${user.nama} (${aksesLevel.name}): ${data.alasanPenolakan}`;

                        await prisma.legalisirIjazah.update({
                                where: { ulid: id },
                                data: {
                                        verifikasiStatus: nextStatus,
                                        alasanPenolakan: data.alasanPenolakan,
                                        status: {
                                                create: {
                                                        ulid: ulid(),
                                                        nama: nextStatus,
                                                        deskripsi: statusDescription,
                                                        userId: user.id,
                                                },
                                        },
                                },
                        });
                }

                // Get updated legalisirIjazah
                const updateLegalisirIjazah = await prisma.legalisirIjazah.findUnique({
                        where: { ulid: id },
                        include: {
                                status: {
                                        orderBy: { createdAt: "asc" },
                                        include: {
                                                user: {
                                                        select: {
                                                                nama: true,
                                                                aksesLevel: true,
                                                        },
                                                },
                                        },
                                },
                        },
                });

                if (!updateLegalisirIjazah) return INVALID_ID_SERVICE_RESPONSE;

                // Create log entry
                await prisma.log.create({
                        data: {
                                ulid: ulid(),
                                flagMenu: "LEGALISIR_IJAZAH",
                                deskripsi: `Verifikasi pengajuan ID ${id}: ${data.action} oleh ${user.nama} (${aksesLevel.name})`,
                                aksesLevelId: user.aksesLevelId,
                                userId: user.id,
                        },
                });

                return {
                        status: true,
                        data: updateLegalisirIjazah,
                };
        } catch (error) {
                Logger.error(`LegalisirIjazahService.verificationStatus : ${error}`);
                return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
        }
}

export type UpdateResponse = LegalisirIjazah | {};
export async function update(id: string, data: Partial<LegalisirIjazahDTO>, user: UserJWTDAO): Promise<ServiceResponse<UpdateResponse>> {
        try {
                let legalisirIjazah = await prisma.legalisirIjazah.findUnique({
                        where: {
                                ulid: id,
                        },
                });

                if (!legalisirIjazah) return INVALID_ID_SERVICE_RESPONSE;

                if (legalisirIjazah.userId !== user.id) {
                        return BadRequestWithMessage("Anda tidak berwenang untuk mengubah pengajuan legalisir ijazah ini!");
                }

                // Check if the cuti can be updated (only if it's rejected or still in process by student)
                const currentStatus = legalisirIjazah.verifikasiStatus;
                const canUpdate = currentStatus === VERIFICATION_STATUS.DITOLAK;

                if (!canUpdate) {
                        return BadRequestWithMessage("Tidak dapat melakukan pemrubahan pada pengajuan legalisir ijazah yang sedang di proses!");
                }

                // Reset status back to initial state when updating
                const resetStatus = VERIFICATION_STATUS.DIPROSES_OPERATOR_AKADEMIK;

                legalisirIjazah = await prisma.legalisirIjazah.update({
                        where: {
                                ulid: id,
                        },
                        data: {
                                ...data,
                                verifikasiStatus: resetStatus,
                                alasanPenolakan: legalisirIjazah.alasanPenolakan, // Clear rejection reason
                                status: {
                                        create: {
                                                ulid: ulid(),
                                                nama: resetStatus,
                                                deskripsi: `Pengajuan legalisir ijazah diperbarui oleh ${user.nama} - menunggu verifikasi ulang dari operator akademik`,
                                                userId: user.id,
                                        },
                                },
                        },
                        include: {
                                status: {
                                        orderBy: { createdAt: "asc" },
                                        include: {
                                                user: {
                                                        select: {
                                                                nama: true,
                                                                aksesLevel: true,
                                                        },
                                                },
                                        },
                                },
                        },
                });

                // Create log entry for update
                await prisma.log.create({
                        data: {
                                ulid: ulid(),
                                flagMenu: "LEGALISIR_IJAZAH",
                                deskripsi: `Pengajuan legalisir ijazah dengan ID ${id} diperbarui oleh ${user.nama} - status direset ke awal proses verifikasi`,
                                aksesLevelId: user.aksesLevelId,
                                userId: user.id,
                        },
                });

                return {
                        status: true,
                        data: legalisirIjazah,
                };
        } catch (err) {
                Logger.error(`LegalisirIjazahService.update : ${err}`);
                return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
        }
}

export type ProsesLegalisirResponse = LegalisirIjazah | {};
export async function prosesLegalisir(id: string, data: ProsesLegalisirIjazahDTO, user: UserJWTDAO): Promise<ServiceResponse<ProsesLegalisirResponse>> {
        try {
                const legalisirIjazah = await prisma.legalisirIjazah.findUnique({
                        where: { ulid: id },
                });

                if (!legalisirIjazah) return INVALID_ID_SERVICE_RESPONSE;

                // Check if status is DISETUJUI (final approval)
                if (legalisirIjazah.verifikasiStatus !== VERIFICATION_STATUS.SEDANG_DIPROSES_LEGALISIR) {
                        return BadRequestWithMessage("Pengajuan legalisir ijazah belum disetujui, tidak bisa diproses!");
                }

                // Get user's access level
                const aksesLevel = await prisma.aksesLevel.findUnique({
                        where: { id: user.aksesLevelId },
                });

                if (!aksesLevel) return BadRequestWithMessage("Akses level tidak ditemukan!");

                // Only OPERATOR_AKADEMIK can process
                if (aksesLevel.name !== "OPERATOR_AKADEMIK") {
                        return BadRequestWithMessage("Hanya Operator Akademik yang dapat memproses legalisir ijazah!");
                }

                const currentStatus = legalisirIjazah.verifikasiStatus;
                let isAuthorized = false;
                if (currentStatus === VERIFICATION_STATUS.SEDANG_DIPROSES_LEGALISIR && aksesLevel.name === "OPERATOR_AKADEMIK") {
                        isAuthorized = true;
                }

                console.log("currentStatus", currentStatus);
                if (!isAuthorized) {
                        return BadRequestWithMessage("Anda tidak berwenang untuk memproses legalisir ijazah!");
                }

                console.log("currentStatus", currentStatus);

                await flowCreatingStatusVeificationAkademik(currentStatus, id, user.nama, user.id, false);

                const updatedLegalisirIjazah = await prisma.legalisirIjazah.update({
                        where: { ulid: id },
                        data: {
                                tanggalPengambilan: data.tanggalPengambilan,
                                tempatPengambilan: data.tempatPengambilan as OpsiPengambilan,
                        },
                        include: {
                                status: {
                                        orderBy: { createdAt: "asc" },
                                        include: {
                                                user: {
                                                        select: {
                                                                nama: true,
                                                                aksesLevel: true,
                                                        },
                                                },
                                        },
                                },
                        },
                });

                if (!updatedLegalisirIjazah) return INVALID_ID_SERVICE_RESPONSE;

                // Create log entry
                await prisma.log.create({
                        data: {
                                ulid: ulid(),
                                flagMenu: "LEGALISIR_IJAZAH",
                                deskripsi: `Legalisir ijazah dengan ID ${id} sedang diproses oleh ${user.nama} - Pengambilan: ${data.tanggalPengambilan} di ${data.tempatPengambilan}`,
                                aksesLevelId: user.aksesLevelId,
                                userId: user.id,
                        },
                });

                return {
                        status: true,
                        data: updatedLegalisirIjazah,
                };
        } catch (error) {
                Logger.error(`LegalisirIjazahService.prosesLegalisir : ${error}`);
                return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
        }
}
