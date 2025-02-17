import { FilteringQueryV2, PagedList } from "$entities/Query";
import {
    BadRequestWithMessage,
    INTERNAL_SERVER_ERROR_SERVICE_RESPONSE,
    INVALID_ID_SERVICE_RESPONSE,
    ServiceResponse,
} from "$entities/Service";
import Logger from "$pkg/logger";
import { prisma } from "$utils/prisma.utils";
import { SuratKeteranganKuliah, VerificationStatusKemahasiswaan } from "@prisma/client";
import { buildFilterQueryLimitOffsetV2 } from "./helpers/FilterQueryV2";
import { SuratKeteranganKuliahDTO, VerifikasiSuratDTO } from "$entities/SuratKeteranganKuliah";
import { UserJWTDAO } from "$entities/User";
import { buildBufferPDF } from "$utils/buffer.utils";
import { DateTime } from "luxon";
import { ulid } from "ulid";
import { getCurrentAcademicInfo } from "$utils/strings.utils";
import { getNextVerificationStatus } from "$utils/helper.utils";

export type CreateResponse = SuratKeteranganKuliah | {};
export async function create(
    data: SuratKeteranganKuliahDTO,
    user: UserJWTDAO
): Promise<ServiceResponse<CreateResponse>> {
    try {
        data.offerById = user.id;
        const status = await prisma.$transaction(async (prisma) => {
            const surat = await prisma.suratKeteranganKuliah.create({
                data,
            });

            await prisma.statusHistory.create({
                data: {
                    id: ulid(),
                    action: VerificationStatusKemahasiswaan.DIPROSES_OPERATOR_KEMAHASISWAAN,
                    description: VerificationStatusKemahasiswaan.DIPROSES_OPERATOR_KEMAHASISWAAN,
                    suratKeteranganKuliahId: surat.id,
                    userId: user.id,
                },
            });

            return surat;
        });

        return {
            status: true,
            data: status,
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

        const userLevel = await prisma.userLevel.findUnique({
            where: {
                id: user.userLevelId,
            },
        });

        if (!userLevel) return INVALID_ID_SERVICE_RESPONSE;

        if (userLevel.name === "MAHASISWA") {
            usedFilters.where.AND.push({
                offerById: user.id,
            });
        }

        if (userLevel.name === "OPERATOR_KEMAHASISWAAN") {
            usedFilters.where.AND.push({
                statusHistory: {
                    some: {
                        action: {
                            notIn: [
                                VerificationStatusKemahasiswaan.DISETUJUI_OPERATOR_KEMAHASISWAAN,
                                VerificationStatusKemahasiswaan.USULAN_DISETUJUI,
                            ],
                        },
                    },
                },
            });
        }

        if (userLevel.name === "KASUBBAG_KEMAHASISWAAN") {
            usedFilters.where.AND.push({
                statusHistory: {
                    some: {
                        action: {
                            not: VerificationStatusKemahasiswaan.DISETUJUI_KASUBBAG_KEMAHASISWAAN,
                        },
                    },
                },
            });
        }

        usedFilters.include = {
            statusHistory: {
                include: {
                    User: true,
                },
            },
            offerBy: {
                include: {
                    Mahasiswa: true,
                },
            },
        };

        const [SuratKeterangaKuliah, totalData] = await Promise.all([
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
                entries: SuratKeterangaKuliah,
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
        let SuratKeterangaKuliah = await prisma.suratKeteranganKuliah.findUnique({
            include: {
                offerBy: {
                    select: {
                        fullName: true,
                        email: true,
                    },
                },
                statusHistory: {
                    include: {
                        User: true,
                    },
                },
            },
            where: {
                id,
            },
        });

        if (!SuratKeterangaKuliah) return INVALID_ID_SERVICE_RESPONSE;

        return {
            status: true,
            data: SuratKeterangaKuliah,
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
        const verificationExist = await prisma.suratKeteranganKuliah.findFirst({
            where: {
                statusHistory: {
                    some: {
                        userId: user.id,
                        action: {
                            in: [
                                VerificationStatusKemahasiswaan.USULAN_DISETUJUI,
                                VerificationStatusKemahasiswaan.USULAN_DITOLAK,
                            ],
                        },
                    },
                },
            },
        });

        if (verificationExist) return BadRequestWithMessage("Kamu Sudah Melakukan Verifikasi Pada Surat Ini!");

        let nextStatus: VerificationStatusKemahasiswaan = "DIPROSES_OPERATOR_KEMAHASISWAAN";
        if (data.action === "DISETUJUI") {
            nextStatus = getNextVerificationStatus(data.action as VerificationStatusKemahasiswaan);
        }

        await prisma.$transaction(async (prisma) => {
            await prisma.statusHistory.create({
                data: {
                    id: ulid(),
                    action: nextStatus,
                    description: `${nextStatus} oleh ${user.fullName}`,
                    userId: user.id,
                    suratKeteranganKuliahId: id,
                },
            });

            // Update the `reason` field if the status is `USULAN_DITOLAK`
            if (data.action === "DITOLAK") {
                await prisma.suratKeteranganKuliah.update({
                    where: { id },
                    data: { reason: data.reason },
                });
            }
        });

        const suratKeteranganKuliah = await prisma.suratKeteranganKuliah.findUnique({
            where: {
                id,
            },
        });

        if (!suratKeteranganKuliah) return INVALID_ID_SERVICE_RESPONSE;

        return {
            status: true,
            data: suratKeteranganKuliah,
        };
    } catch (error) {
        Logger.error(`SuratKeteranganKuliahService.verificationStatus : ${error}`);
        return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
}

export async function cetakSurat(id: string, user: UserJWTDAO): Promise<ServiceResponse<any>> {
    try {
        const suratKeteranganKuliah = await prisma.suratKeteranganKuliah.findUnique({
            where: {
                id,
                statusHistory: {
                    some: {
                        action: VerificationStatusKemahasiswaan.USULAN_DISETUJUI,
                    },
                },
            },
        });

        if (!suratKeteranganKuliah) return INVALID_ID_SERVICE_RESPONSE;

        const findUser = await prisma.user.findUnique({
            where: {
                id: user.id,
            },
            include: {
                Mahasiswa: true,
            },
        });

        let pdfData: any = {};

        const akademikInfo = getCurrentAcademicInfo();

        pdfData.title = "SURAT KETERANGAN KULIAH";
        pdfData.data = { ...suratKeteranganKuliah, ...findUser };
        pdfData.date = DateTime.now().toFormat("dd MMMM yyyy");
        pdfData.tahunAkademik = akademikInfo.tahunAkademik;
        pdfData.semester = akademikInfo.semester;

        const buffer = await buildBufferPDF("surat-keterangan-kuliah", pdfData);
        const fileName = `Surat-Keterangan-Kuliah-${findUser?.Mahasiswa?.npm}`;

        return {
            status: true,
            data: {
                buffer,
                fileName,
            },
        };
    } catch (err) {
        Logger.error(`PembayaranKolektifVoucherService.exportPDF : ${err}`);
        return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
}
