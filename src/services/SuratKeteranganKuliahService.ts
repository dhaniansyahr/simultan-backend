import { FilteringQueryV2, PagedList } from "$entities/Query";
import { BadRequestWithMessage, INTERNAL_SERVER_ERROR_SERVICE_RESPONSE, INVALID_ID_SERVICE_RESPONSE, ServiceResponse } from "$entities/Service";
import Logger from "$pkg/logger";
import { prisma } from "$utils/prisma.utils";
import { SuratKeteranganKuliah } from "@prisma/client";
import { buildFilterQueryLimitOffsetV2 } from "./helpers/FilterQueryV2";
import { LetterProcessDTO, SuratKeteranganKuliahDTO, VerifikasiSuratDTO } from "$entities/SuratKeteranganKuliah";
import { UserJWTDAO } from "$entities/User";
import { buildBufferPDF } from "$utils/buffer.utils";
import { DateTime } from "luxon";
import { ulid } from "ulid";
import { getCurrentAcademicInfo } from "$utils/strings.utils";
import { flowCreatingStatusVerification, getNextVerificationStatus, VERIFICATION_STATUS } from "$utils/helper.utils";

/** TODO
 * [] Verifkasi Harus teken 2x karna diproses dulu baru disetujui
 */

export type CreateResponse = SuratKeteranganKuliah | {};
export async function create(data: SuratKeteranganKuliahDTO, user: UserJWTDAO): Promise<ServiceResponse<CreateResponse>> {
        try {
                // Check if user is a student (MAHASISWA)
                const aksesLevel = await prisma.aksesLevel.findUnique({
                        where: { id: user.aksesLevelId },
                });

                if (!aksesLevel || aksesLevel.name !== "MAHASISWA") {
                        return BadRequestWithMessage("Hanya mahasiswa yang dapat mengajukan surat keterangan kuliah!");
                }

                // Create the letter with initial status
                const surat = await prisma.suratKeteranganKuliah.create({
                        data: {
                                ulid: ulid(),
                                tipeSurat: data.tipeSurat,
                                deskripsi: data.deskripsi,
                                dokumenUrl: data.dokumenUrl,
                                verifikasiStatus: VERIFICATION_STATUS.DIPROSES_OLEH_OPERATOR,
                                userId: user.id,
                                status: {
                                        create: {
                                                ulid: ulid(),
                                                nama: VERIFICATION_STATUS.DIPROSES_OLEH_OPERATOR,
                                                deskripsi: `Pengajuan surat keterangan kuliah oleh ${user.nama} - menunggu verifikasi operator kemahasiswaan`,
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
                                deskripsi: `Pengajuan surat keterangan kuliah baru dengan ID ${surat.ulid} oleh mahasiswa ${user.nama}`,
                                aksesLevelId: user.aksesLevelId,
                                userId: user.id,
                        },
                });

                return {
                        status: true,
                        data: surat,
                };
        } catch (err) {
                Logger.error(`SuratKeteranganKuliahService.create : ${err}`);
                return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
        }
}

export type GetAllResponse = PagedList<SuratKeteranganKuliah[]> | {};
export async function getAll(filters: FilteringQueryV2, user: UserJWTDAO): Promise<ServiceResponse<GetAllResponse>> {
        try {
                const usedFilters = buildFilterQueryLimitOffsetV2(filters);

                const aksesLevel = await prisma.aksesLevel.findUnique({
                        where: {
                                id: user.aksesLevelId,
                        },
                });

                if (!aksesLevel) return BadRequestWithMessage("Akses Level tidak ditemukan!");

                // For students, only show their own letters
                if (aksesLevel.name === "MAHASISWA") {
                        usedFilters.where.AND.push({
                                userId: user.id,
                        });
                }

                // Filter based on user role
                if (aksesLevel.name === "OPERATOR_KEMAHASISWAAN") {
                        // Operator sees: letters waiting for their action + letters waiting for letter number input
                        usedFilters.where.AND.push({
                                OR: [{ verifikasiStatus: VERIFICATION_STATUS.DIPROSES_OLEH_OPERATOR }, { verifikasiStatus: VERIFICATION_STATUS.SEDANG_INPUT_NOMOR_SURAT }],
                        });
                } else if (aksesLevel.name === "KASUBBAG_KEMAHASISWAAN") {
                        // Kasubbag sees: letters waiting for their verification
                        usedFilters.where.AND.push({
                                verifikasiStatus: VERIFICATION_STATUS.DIPROSES_OLEH_KASUBBAG,
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

                // First, get all surat records
                const [suratKeteranganKuliah, totalData] = await Promise.all([
                        prisma.suratKeteranganKuliah.findMany(usedFilters),
                        prisma.suratKeteranganKuliah.count({
                                where: usedFilters.where,
                        }),
                ]);

                let totalPage = 1;
                if (totalData > usedFilters.take) totalPage = Math.ceil(totalData / usedFilters.take);

                return {
                        status: true,
                        data: {
                                entries: suratKeteranganKuliah,
                                totalData,
                                totalPage,
                        },
                };
        } catch (err) {
                Logger.error(`SuratKeteranganKuliahService.getAll : ${err} `);
                return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
        }
}

export type GetByIdResponse = SuratKeteranganKuliah | {};
export async function getById(id: string): Promise<ServiceResponse<GetByIdResponse>> {
        try {
                const suratKeteranganKuliah = await prisma.suratKeteranganKuliah.findUnique({
                        include: {
                                user: {
                                        select: {
                                                nama: true,
                                                npm: true,
                                        },
                                },
                                status: {
                                        orderBy: {
                                                createdAt: "asc",
                                        },
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
                        where: {
                                ulid: id,
                        },
                });

                if (!suratKeteranganKuliah) return INVALID_ID_SERVICE_RESPONSE;

                return {
                        status: true,
                        data: suratKeteranganKuliah,
                };
        } catch (err) {
                Logger.error(`SuratKeteranganKuliahService.getById : ${err}`);
                return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
        }
}

export type VerificationSuratResponse = SuratKeteranganKuliah | {};
export async function verificationStatus(id: string, data: VerifikasiSuratDTO, user: UserJWTDAO): Promise<ServiceResponse<VerificationSuratResponse>> {
        try {
                const surat = await prisma.suratKeteranganKuliah.findUnique({
                        where: { ulid: id },
                });

                if (!surat) return INVALID_ID_SERVICE_RESPONSE;

                // Get user's access level
                const aksesLevel = await prisma.aksesLevel.findUnique({
                        where: { id: user.aksesLevelId },
                });

                if (!aksesLevel) return BadRequestWithMessage("Akses level tidak ditemukan!");

                // Check authorization based on current status and user role
                const currentStatus = surat.verifikasiStatus;
                let isAuthorized = false;

                if (currentStatus === VERIFICATION_STATUS.DIPROSES_OLEH_OPERATOR && aksesLevel.name === "OPERATOR_KEMAHASISWAAN") {
                        isAuthorized = true;
                } else if (currentStatus === VERIFICATION_STATUS.DIPROSES_OLEH_KASUBBAG && aksesLevel.name === "KASUBBAG_KEMAHASISWAAN") {
                        isAuthorized = true;
                }

                if (!isAuthorized) {
                        return BadRequestWithMessage("Anda tidak berwenang untuk memverifikasi surat pada tahap ini!");
                }

                if (data.action === "DISETUJUI") {
                        if (currentStatus === VERIFICATION_STATUS.DIPROSES_OLEH_OPERATOR) {
                                await flowCreatingStatusVerification(currentStatus, id, user.nama, user.id, user.aksesLevelId, false);
                                await flowCreatingStatusVerification(VERIFICATION_STATUS.DISETUJUI_OLEH_OPERATOR, id, user.nama, user.id, user.aksesLevelId, false);
                        } else if (currentStatus === VERIFICATION_STATUS.DIPROSES_OLEH_KASUBBAG) {
                                await flowCreatingStatusVerification(currentStatus, id, user.nama, user.id, user.aksesLevelId, false);
                                await flowCreatingStatusVerification(VERIFICATION_STATUS.DISETUJUI_OLEH_KASUBBAG, id, user.nama, user.id, user.aksesLevelId, false);
                        }
                } else {
                        // Handle rejection
                        let nextStatus: string;
                        if (aksesLevel.name === "OPERATOR_KEMAHASISWAAN") {
                                nextStatus = VERIFICATION_STATUS.DITOLAK_OLEH_OPERATOR;
                        } else {
                                nextStatus = VERIFICATION_STATUS.DITOLAK_OLEH_KASUBBAG;
                        }

                        const statusDescription = `Surat ditolak oleh ${user.nama} (${aksesLevel.name}): ${data.alasanPenolakan}`;

                        await prisma.suratKeteranganKuliah.update({
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

                // Get updated surat
                const updatedSurat = await prisma.suratKeteranganKuliah.findUnique({
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

                if (!updatedSurat) return INVALID_ID_SERVICE_RESPONSE;

                // Create log entry
                await prisma.log.create({
                        data: {
                                ulid: ulid(),
                                flagMenu: "SURAT_KETERANGAN_KULIAH",
                                deskripsi: `Verifikasi surat ID ${id}: ${data.action} oleh ${user.nama} (${aksesLevel.name})`,
                                aksesLevelId: user.aksesLevelId,
                                userId: user.id,
                        },
                });

                return {
                        status: true,
                        data: updatedSurat,
                };
        } catch (error) {
                Logger.error(`SuratKeteranganKuliahService.verificationStatus : ${error}`);
                return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
        }
}

export async function letterProcess(id: string, user: UserJWTDAO, data: LetterProcessDTO): Promise<ServiceResponse<{}>> {
        try {
                const suratKeteranganKuliah = await prisma.suratKeteranganKuliah.findUnique({
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

                if (!suratKeteranganKuliah) return INVALID_ID_SERVICE_RESPONSE;

                // Get current verification status
                const currentStatus = suratKeteranganKuliah.verifikasiStatus;

                // Check if the letter is already processed
                if (currentStatus === VERIFICATION_STATUS.DISETUJUI) {
                        return BadRequestWithMessage("Surat sudah diproses!");
                } else if (currentStatus === VERIFICATION_STATUS.DITOLAK_OLEH_OPERATOR || currentStatus === VERIFICATION_STATUS.DITOLAK_OLEH_KASUBBAG) {
                        return BadRequestWithMessage("Surat ditolak, Mohon periksa alasan penolakan dan ajukan surat baru!");
                }

                if (currentStatus !== VERIFICATION_STATUS.SEDANG_INPUT_NOMOR_SURAT) {
                        return BadRequestWithMessage("Nomor surat hanya dapat ditambahkan ketika status SEDANG INPUT NOMOR SURAT!");
                }

                // Get the next status
                const nextStatus = getNextVerificationStatus(currentStatus);

                // Update the letter with new status
                const updatedSurat = await prisma.suratKeteranganKuliah.update({
                        where: { ulid: id },
                        data: {
                                verifikasiStatus: nextStatus,
                                nomorSurat: data.nomorSurat,
                                status: {
                                        create: {
                                                ulid: ulid(),
                                                nama: nextStatus,
                                                deskripsi: `Surat diproses oleh ${user.nama}`,
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
                                deskripsi: `Surat diproses oleh ${user.nama}`,
                                aksesLevelId: user.aksesLevelId,
                                userId: user.id,
                        },
                });

                // Additional log entry for final DISETUJUI status
                if (
                        nextStatus === VERIFICATION_STATUS.DISETUJUI ||
                        nextStatus === VERIFICATION_STATUS.DISETUJUI_OLEH_OPERATOR ||
                        nextStatus === VERIFICATION_STATUS.DISETUJUI_OLEH_KASUBBAG
                ) {
                        await prisma.log.create({
                                data: {
                                        ulid: ulid(),
                                        flagMenu: "SURAT_KETERANGAN_KULIAH",
                                        deskripsi: `Surat Keterangan Kuliah dengan ID ${id} DISETUJUI setelah input nomor surat oleh ${user.nama}`,
                                        aksesLevelId: user.aksesLevelId,
                                        userId: user.id,
                                },
                        });
                }

                return {
                        status: true,
                        data: updatedSurat,
                };
        } catch (error) {
                Logger.error(`SuratKeteranganKuliahService.letterProcess : ${error}`);
                return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
        }
}


// update nomor surat


export async function cetakSurat(id: string, user: UserJWTDAO): Promise<ServiceResponse<any>> {
        try {
                const suratKeteranganKuliah = await prisma.suratKeteranganKuliah.findUnique({
                        where: {
                                ulid: id,
                                verifikasiStatus: VERIFICATION_STATUS.DISETUJUI,
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

                if (!suratKeteranganKuliah) {
                        return BadRequestWithMessage("Surat tidak ditemukan atau belum disetujui!");
                }

                let pdfData = {
                        title: "SURAT KETERANGAN KULIAH",
                        data: {
                                ...suratKeteranganKuliah,
                                nama: suratKeteranganKuliah.user.nama,
                                npm: suratKeteranganKuliah.user.npm,
                                tipeSurat: suratKeteranganKuliah.tipeSurat,
                                deskripsi: suratKeteranganKuliah.deskripsi,
                                nomorSurat: suratKeteranganKuliah.nomorSurat,
                        },
                        date: DateTime.now().toFormat("dd MMMM yyyy"),
                        ...getCurrentAcademicInfo(),
                };

                const buffer = await buildBufferPDF("surat-keterangan-kuliah", pdfData);
                const fileName = `Surat-Keterangan-Kuliah-${suratKeteranganKuliah.user.npm}`;

                // Create log entry for printing
                await prisma.log.create({
                        data: {
                                ulid: ulid(),
                                flagMenu: "SURAT_KETERANGAN_KULIAH",
                                deskripsi: `Surat dengan ID ${id} dicetak oleh ${user.nama}`,
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
                Logger.error(`SuratKeteranganKuliahService.cetakSurat : ${err}`);
                return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
        }
}

export type UpdateResponse = SuratKeteranganKuliah | {};
export async function update(id: string, data: Partial<SuratKeteranganKuliahDTO>, user: UserJWTDAO): Promise<ServiceResponse<UpdateResponse>> {
        try {
                let suratKeteranganKuliah = await prisma.suratKeteranganKuliah.findUnique({
                        where: {
                                ulid: id,
                        },
                });

                if (!suratKeteranganKuliah) return INVALID_ID_SERVICE_RESPONSE;

                // Check if user is authorized to update (only the student who created it)
                if (suratKeteranganKuliah.userId !== user.id) {
                        return BadRequestWithMessage("Anda tidak berwenang untuk mengubah surat ini!");
                }

                // Check if the letter can be updated (only if it's rejected or still in process by student)
                const currentStatus = suratKeteranganKuliah.verifikasiStatus;
                const canUpdate =
                        currentStatus === VERIFICATION_STATUS.DITOLAK_OLEH_OPERATOR ||
                        currentStatus === VERIFICATION_STATUS.DITOLAK_OLEH_KASUBBAG ||
                        currentStatus === VERIFICATION_STATUS.DIPROSES_OLEH_OPERATOR;

                if (!canUpdate) {
                        return BadRequestWithMessage("Surat tidak dapat diubah pada status ini!");
                }

                // Reset status back to initial state when updating
                const resetStatus = VERIFICATION_STATUS.DIPROSES_OLEH_OPERATOR;

                suratKeteranganKuliah = await prisma.suratKeteranganKuliah.update({
                        where: {
                                ulid: id,
                        },
                        data: {
                                ...data,
                                verifikasiStatus: resetStatus,
                                alasanPenolakan: suratKeteranganKuliah.alasanPenolakan,
                                status: {
                                        create: {
                                                ulid: ulid(),
                                                nama: resetStatus,
                                                deskripsi: `Surat diperbarui oleh ${user.nama} - menunggu verifikasi ulang dari operator kemahasiswaan`,
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
                                flagMenu: "SURAT_KETERANGAN_KULIAH",
                                deskripsi: `Surat dengan ID ${id} diperbarui oleh ${user.nama} - status direset ke awal proses verifikasi`,
                                aksesLevelId: user.aksesLevelId,
                                userId: user.id,
                        },
                });

                return {
                        status: true,
                        data: suratKeteranganKuliah,
                };
        } catch (err) {
                Logger.error(`SuratKeteranganKuliahService.update : ${err}`);
                return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
        }
}
