import { FilteringQueryV2, PagedList } from "$entities/Query";
import { BadRequestWithMessage, INTERNAL_SERVER_ERROR_SERVICE_RESPONSE, INVALID_ID_SERVICE_RESPONSE, ServiceResponse } from "$entities/Service";
import Logger from "$pkg/logger";
import { prisma } from "$utils/prisma.utils";
import { PengajuanYudisiumDTO, VerifikasiPengajuanYudisiumDTO } from "$entities/PengajuanYudisium";
import { buildFilterQueryLimitOffsetV2 } from "./helpers/FilterQueryV2";
import { ulid } from "ulid";
import { UserJWTDAO } from "$entities/User";
import { VERIFICATION_STATUS } from "$utils/helper.utils";
import { PengajuanYudisium } from "@prisma/client";
import { flowCreatingStatusVeificationAkademik } from "./helpers/LogStatus";
import { DateTime } from "luxon";
import { getCurrentAcademicInfo } from "$utils/strings.utils";
import { buildBufferPDF } from "$utils/buffer.utils";

export type CreateResponse = PengajuanYudisiumDTO | {};
export async function create(data: PengajuanYudisiumDTO, user: UserJWTDAO): Promise<ServiceResponse<CreateResponse>> {
        try {
                // Create the letter with initial status
                const yudisium = await prisma.pengajuanYudisium.create({
                        data: {
                                ...data,
                                ulid: ulid(),
                                verifikasiStatus: VERIFICATION_STATUS.DIPROSES_OPERATOR_AKADEMIK,
                                userId: user.id,
                                status: {
                                        create: {
                                                ulid: ulid(),
                                                nama: VERIFICATION_STATUS.DIPROSES_OPERATOR_AKADEMIK,
                                                deskripsi: `Pengajuan Yudisium oleh ${user.nama} - menunggu verifikasi operator akademik`,
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

                // Filter based on user role
                if (aksesLevel.name === "OPERATOR_AKADEMIK") {
                        // Operator sees: letters waiting for their action + letters waiting for letter number input
                        usedFilters.where.AND.push({
                                OR: [{ verifikasiStatus: VERIFICATION_STATUS.DIPROSES_OPERATOR_AKADEMIK }],
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

export type VerificationResponse = PengajuanYudisium | {};
export async function verificationStatus(id: string, data: VerifikasiPengajuanYudisiumDTO, user: UserJWTDAO): Promise<ServiceResponse<VerificationResponse>> {
        try {
                const yudisium = await prisma.pengajuanYudisium.findUnique({
                        where: { ulid: id },
                });

                if (!yudisium) return INVALID_ID_SERVICE_RESPONSE;

                // Get user's access level
                const aksesLevel = await prisma.aksesLevel.findUnique({
                        where: { id: user.aksesLevelId },
                });

                if (!aksesLevel) return BadRequestWithMessage("Akses level tidak ditemukan!");

                // Check authorization based on current status and user role
                const currentStatus = yudisium.verifikasiStatus;
                let isAuthorized = false;

                console.log("Current Status Yudis : ", currentStatus);

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
                                console.log("Service Masuk ke Flow Create Status");
                                await flowCreatingStatusVeificationAkademik(currentStatus, id, user.nama, user.id, true);
                                await flowCreatingStatusVeificationAkademik(VERIFICATION_STATUS.DISETUJUI_OPERATOR_AKADEMIK, id, user.nama, user.id, true);
                        } else if (currentStatus === VERIFICATION_STATUS.DIPROSES_KASUBBAG_AKADEMIK) {
                                await flowCreatingStatusVeificationAkademik(currentStatus, id, user.nama, user.id, true);
                                await flowCreatingStatusVeificationAkademik(VERIFICATION_STATUS.DISETUJUI_KASUBBAG_AKADEMIK, id, user.nama, user.id, true);
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

                        await prisma.pengajuanYudisium.update({
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

                // Get updated yudisium
                const updateYudisium = await prisma.pengajuanYudisium.findUnique({
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

                if (!updateYudisium) return INVALID_ID_SERVICE_RESPONSE;

                // Create log entry
                await prisma.log.create({
                        data: {
                                ulid: ulid(),
                                flagMenu: "PENGAJUAN_YUDISIUM",
                                deskripsi: `Verifikasi pengajuan ID ${id}: ${data.action} oleh ${user.nama} (${aksesLevel.name})`,
                                aksesLevelId: user.aksesLevelId,
                                userId: user.id,
                        },
                });

                return {
                        status: true,
                        data: updateYudisium,
                };
        } catch (error) {
                Logger.error(`PengajuanYudisiumService.verificationStatus : ${error}`);
                return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
        }
}

export type UpdateResponse = PengajuanYudisium | {};
export async function update(id: string, data: Partial<PengajuanYudisiumDTO>, user: UserJWTDAO): Promise<ServiceResponse<UpdateResponse>> {
        try {
                let pengajuanYudisium = await prisma.pengajuanYudisium.findUnique({
                        where: {
                                ulid: id,
                        },
                });

                if (!pengajuanYudisium) return INVALID_ID_SERVICE_RESPONSE;

                if (pengajuanYudisium.userId !== user.id) {
                        return BadRequestWithMessage("Anda tidak berwenang untuk mengubah pengajuan cuti ini!");
                }

                // Check if the cuti can be updated (only if it's rejected or still in process by student)
                const currentStatus = pengajuanYudisium.verifikasiStatus;
                const canUpdate = currentStatus === VERIFICATION_STATUS.DITOLAK;

                if (!canUpdate) {
                        return BadRequestWithMessage("Tidak dapat melakukan pemrubahan pada pengajuan yudisium yang sedang di proses!");
                }

                // Reset status back to initial state when updating
                const resetStatus = VERIFICATION_STATUS.DIPROSES_OPERATOR_AKADEMIK;

                pengajuanYudisium = await prisma.pengajuanYudisium.update({
                        where: {
                                ulid: id,
                        },
                        data: {
                                ...data,
                                verifikasiStatus: resetStatus,
                                alasanPenolakan: pengajuanYudisium.alasanPenolakan , // Clear rejection reason
                                status: {
                                        create: {
                                                ulid: ulid(),
                                                nama: resetStatus,
                                                deskripsi: `Pengajuan yudisium diperbarui oleh ${user.nama} - menunggu verifikasi ulang dari operator kemahasiswaan`,
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
                                flagMenu: "PENGAJUAN_YUDISIUM",
                                deskripsi: `Pengajuan yudisium dengan ID ${id} diperbarui oleh ${user.nama} - status direset ke awal proses verifikasi`,
                                aksesLevelId: user.aksesLevelId,
                                userId: user.id,
                        },
                });

                return {
                        status: true,
                        data: pengajuanYudisium,
                };
        } catch (err) {
                Logger.error(`PengajuanYudisium.update : ${err}`);
                return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
        }
}

export async function cetakSurat(id: string, user: UserJWTDAO): Promise<ServiceResponse<any>> {
        try {
                const pengajuanYudisium = await prisma.pengajuanYudisium.findUnique({
                        where: {
                                ulid: id,
                        },
                        include: {
                                user: {
                                        select: {
                                                nama: true,
                                                npm: true,
                                        },
                                },
                                status: true,
                        },
                });

                if (!pengajuanYudisium) {
                        return BadRequestWithMessage("Surat tidak ditemukan atau belum disetujui!");
                }

                if (pengajuanYudisium.verifikasiStatus !== VERIFICATION_STATUS.DISETUJUI) {
                        return BadRequestWithMessage("Tidak dapat mendownload bukti pengajuan jika pengajuan masih di proses!");
                }

                let pdfData = {
                        title: "BUKTI PENDAFTARAN YUDISIUM",
                        data: {
                                tanggalPengajuan: DateTime.fromJSDate(pengajuanYudisium.createdAt).toFormat("dd MMMM yyyy HH:mm"),
                                nama: pengajuanYudisium.user.nama,
                                npm: pengajuanYudisium.user.npm,
                        },
                        date: DateTime.now().toFormat("dd MMMM yyyy"),
                        ...getCurrentAcademicInfo(),
                };

                const buffer = await buildBufferPDF("bukti-pendaftaran-yudisium", pdfData);
                const fileName = `Bukti-Pengajuan-Yudisium-${pengajuanYudisium.user.npm}`;

                // Create log entry for printing
                await prisma.log.create({
                        data: {
                                ulid: ulid(),
                                flagMenu: "PENGAJUAN_YUDISIUM",
                                deskripsi: `Bukti pengajuan yudisium dengan ID ${id} dicetak oleh ${user.nama}`,
                                aksesLevelId: user.aksesLevelId,
                                userId: user.id,
                        },
                });

                return {
                        status: true,
                        data: {
                                buffer,
                                fileName,
                        },
                };
        } catch (err) {
                Logger.error(`PengajuanYudisiumService.cetakSurat : ${err}`);
                return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
        }
}
