import { FilteringQueryV2, PagedList } from "$entities/Query";
import {
        BadRequestWithMessage,
        INTERNAL_SERVER_ERROR_SERVICE_RESPONSE,
        INVALID_ID_SERVICE_RESPONSE,
        ServiceResponse,
} from "$entities/Service";
import Logger from "$pkg/logger";
import { prisma } from "$utils/prisma.utils";
import { SuratKeteranganKuliah, VerifikasiStatusBagianKemahasiswaan } from "@prisma/client";
import { buildFilterQueryLimitOffsetV2 } from "./helpers/FilterQueryV2";
import { LetterProcessDTO, SuratKeteranganKuliahDTO, VerifikasiSuratDTO } from "$entities/SuratKeteranganKuliah";
import { UserJWTDAO } from "$entities/User";
import { buildBufferPDF } from "$utils/buffer.utils";
import { DateTime } from "luxon";
import { ulid } from "ulid";
import { getCurrentAcademicInfo } from "$utils/strings.utils";
import { flowCreatingStatusVeification, getNextVerificationStatus } from "$utils/helper.utils";

/** TODO
 * [] Verifkasi Harus teken 2x karna diproses dulu baru disetujui
 */

export type CreateResponse = SuratKeteranganKuliah | {};
export async function create(
        data: SuratKeteranganKuliahDTO,
        user: UserJWTDAO
): Promise<ServiceResponse<CreateResponse>> {
        try {
                // Create the letter first
                const surat = await prisma.suratKeteranganKuliah.create({
                        data: {
                                ulid: ulid(),
                                tipeSurat: data.tipeSurat,
                                deskripsi: data.deskripsi,
                                dokumenUrl: data.dokumenUrl,
                                verifikasiStatus: VerifikasiStatusBagianKemahasiswaan.DIPROSES_OPERATOR_KEMAHASISWAAN,
                                userId: user.id,
                                status: {
                                        create: {
                                                ulid: ulid(),
                                                nama: VerifikasiStatusBagianKemahasiswaan.DIPROSES_OPERATOR_KEMAHASISWAAN,
                                                deskripsi: `Pengajuan Surat oleh ${user.nama} dan ${VerifikasiStatusBagianKemahasiswaan.DIPROSES_OPERATOR_KEMAHASISWAAN}`,
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
                                deskripsi: `Pengajuan surat keterangan kuliah baru dengan ID ${surat.ulid}`,
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

                // For Operator and Kasubbag, show letters that are not yet approved or rejected
                if (aksesLevel.name === "OPERATOR_KEMAHASISWAAN" || aksesLevel.name === "KASUBBAG_KEMAHASISWAAN") {
                        usedFilters.where.AND.push({
                                verifikasiStatus: {
                                        notIn: ["USULAN_DISETUJUI", "USULAN_DITOLAK"],
                                },
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
export async function verificationStatus(
        id: string,
        data: VerifikasiSuratDTO,
        user: UserJWTDAO
): Promise<ServiceResponse<VerificationSuratResponse>> {
        try {
                const surat = await prisma.suratKeteranganKuliah.findUnique({
                        where: { ulid: id },
                });

                if (!surat) return INVALID_ID_SERVICE_RESPONSE;

                // Get current verification status
                const currentStatus = surat.verifikasiStatus;
                let nextStatus: VerifikasiStatusBagianKemahasiswaan;

                if (data.action === "DISETUJUI") {
                        nextStatus = getNextVerificationStatus(currentStatus);
                } else {
                        nextStatus = VerifikasiStatusBagianKemahasiswaan.USULAN_DITOLAK;
                }

                // Update the letter with new status
                const updatedSurat = await prisma.suratKeteranganKuliah.update({
                        where: { ulid: id },
                        data: {
                                verifikasiStatus: nextStatus,
                                alasanPenolakan: data.action === "DITOLAK" ? data.alasanPenolakan : undefined,
                                status: {
                                        create: {
                                                ulid: ulid(),
                                                nama: nextStatus,
                                                deskripsi:
                                                        data.action === "DISETUJUI"
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

                // Create log entry
                await prisma.log.create({
                        data: {
                                ulid: ulid(),
                                flagMenu: "SURAT_KETERANGAN_KULIAH",
                                deskripsi: `Verifikasi surat: ${nextStatus}`,
                                aksesLevelId: user.aksesLevelId,
                                userId: user.id,
                        },
                });

                await flowCreatingStatusVeification(nextStatus, updatedSurat.ulid, user.nama, user.id, false);

                return {
                        status: true,
                        data: updatedSurat,
                };
        } catch (error) {
                Logger.error(`SuratKeteranganKuliahService.verificationStatus : ${error}`);
                return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
        }
}

export async function letterProcess(
        id: string,
        user: UserJWTDAO,
        data: LetterProcessDTO
): Promise<ServiceResponse<{}>> {
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
                if (currentStatus === "USULAN_DISETUJUI") {
                        return BadRequestWithMessage("Surat sudah diproses!");
                } else if (currentStatus === "USULAN_DITOLAK") {
                        return BadRequestWithMessage(
                                "Surat ditolak, Mohon periksa alasan penolakan dan ajukan surat baru!"
                        );
                }

                if (currentStatus !== VerifikasiStatusBagianKemahasiswaan.SURAT_DIPROSES) {
                        return BadRequestWithMessage(
                                "Nomor surat hanya dapat ditambahkan ketika status SURAT_DIPROSES!"
                        );
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

                return {
                        status: true,
                        data: updatedSurat,
                };
        } catch (error) {
                Logger.error(`SuratKeteranganKuliahService.letterProcess : ${error}`);
                return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
        }
}

export async function cetakSurat(id: string, user: UserJWTDAO): Promise<ServiceResponse<any>> {
        try {
                const suratKeteranganKuliah = await prisma.suratKeteranganKuliah.findUnique({
                        where: {
                                ulid: id,
                                verifikasiStatus: "USULAN_DISETUJUI",
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
