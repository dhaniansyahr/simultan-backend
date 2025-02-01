import { FilteringQueryV2, PagedList } from "$entities/Query";
import {
    BadRequestWithMessage,
    INTERNAL_SERVER_ERROR_SERVICE_RESPONSE,
    INVALID_ID_SERVICE_RESPONSE,
    ServiceResponse,
} from "$entities/Service";
import Logger from "$pkg/logger";
import { prisma } from "$utils/prisma.utils";
import { Status, SuratKeteranganKuliah } from "@prisma/client";
import { buildFilterQueryLimitOffsetV2 } from "./helpers/FilterQueryV2";
import { SuratKeteranganKuliahDTO, VerifikasiSuratDTO } from "$entities/SuratKeteranganKuliah";
import { UserJWTDAO } from "$entities/User";
import { buildBufferPDF } from "$utils/buffer.utils";
import { DateTime } from "luxon";

export type CreateResponse = SuratKeteranganKuliah | {};
export async function create(
    data: SuratKeteranganKuliahDTO,
    user: UserJWTDAO
): Promise<ServiceResponse<CreateResponse>> {
    try {
        if (user.role !== "USER") return BadRequestWithMessage("You cannot offer this surat!");

        let suratKeteranganKuliah: any;

        data.offerById = user.id;
        suratKeteranganKuliah = await prisma.suratKeteranganKuliah.create({
            data,
        });

        return {
            status: true,
            data: suratKeteranganKuliah,
        };
    } catch (err) {
        Logger.error(`SuratKeteranganKuliahService.create : ${err}`);
        return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
}

export type GetAllResponse = PagedList<SuratKeteranganKuliah[]> | {};
export async function getAll(filters: FilteringQueryV2): Promise<ServiceResponse<GetAllResponse>> {
    try {
        const usedFilters = buildFilterQueryLimitOffsetV2(filters);

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
                approvedBy: {
                    select: {
                        fullName: true,
                        email: true,
                    },
                },
                rejectedBy: {
                    select: {
                        fullName: true,
                        email: true,
                    },
                },
                remainingApproved: {
                    select: {
                        fullName: true,
                        email: true,
                    },
                },
                offerBy: {
                    select: {
                        fullName: true,
                        email: true,
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

export type UpdateResponse = SuratKeteranganKuliah | {};
export async function update(id: string, data: SuratKeteranganKuliahDTO): Promise<ServiceResponse<UpdateResponse>> {
    try {
        let SuratKeterangaKuliah = await prisma.suratKeteranganKuliah.findUnique({
            where: {
                id,
            },
        });

        if (!SuratKeterangaKuliah) return INVALID_ID_SERVICE_RESPONSE;

        SuratKeterangaKuliah = await prisma.suratKeteranganKuliah.update({
            where: {
                id,
            },
            data,
        });

        return {
            status: true,
            data: SuratKeterangaKuliah,
        };
    } catch (err) {
        Logger.error(`SuratKeteranganKuliahService.update : ${err}`);
        return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
}

export async function deleteByIds(ids: string): Promise<ServiceResponse<{}>> {
    try {
        const idArray: string[] = JSON.parse(ids);

        idArray.forEach(async (id) => {
            await prisma.suratKeteranganKuliah.delete({
                where: {
                    id,
                },
            });
        });

        return {
            status: true,
            data: {},
        };
    } catch (err) {
        Logger.error(`SuratKeteranganKuliahService.deleteByIds : ${err}`);
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
        let suratKeteranganKuliah = await prisma.suratKeteranganKuliah.findUnique({
            where: {
                id,
            },
        });

        if (!suratKeteranganKuliah) return INVALID_ID_SERVICE_RESPONSE;

        if (user.role === "USER") return BadRequestWithMessage("This role cannot access this action!");

        if (data.action === "DISETUJUI") {
            suratKeteranganKuliah = await prisma.suratKeteranganKuliah.update({
                where: {
                    id,
                },
                data: {
                    status: Status.DISETUJUI,
                    approvedById: user.id,
                },
            });
        }

        if (data.action === "DITOLAK") {
            suratKeteranganKuliah = await prisma.suratKeteranganKuliah.update({
                where: {
                    id,
                },
                data: {
                    status: Status.DITOLAK,
                    reason: data.reason,
                    rejectedById: user.id,
                },
            });
        }

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
            },
        });

        if (!suratKeteranganKuliah) return INVALID_ID_SERVICE_RESPONSE;

        let pdfData: any = {};

        pdfData.title = "SURAT KETERANGAN KULIAH";
        pdfData.data = { ...suratKeteranganKuliah, ...user };
        pdfData.date = DateTime.now().toFormat("dd MMMM yyyy");

        const buffer = await buildBufferPDF("surat-keterangan-kuliah", pdfData);
        const fileName = "Daftar_Pembayaran_Kolektif_Voucher";

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
