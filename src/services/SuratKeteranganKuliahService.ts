import { FilteringQueryV2, PagedList } from "$entities/Query";
import {
    BadRequestWithMessage,
    INTERNAL_SERVER_ERROR_SERVICE_RESPONSE,
    INVALID_ID_SERVICE_RESPONSE,
    ServiceResponse,
} from "$entities/Service";
import Logger from "$pkg/logger";
import { prisma } from "$utils/prisma.utils";
import { StatusAction, SuratKeteranganKuliah } from "@prisma/client";
import { buildFilterQueryLimitOffsetV2 } from "./helpers/FilterQueryV2";
import { SuratKeteranganKuliahDTO, VerifikasiSuratDTO } from "$entities/SuratKeteranganKuliah";
import { UserJWTDAO } from "$entities/User";
import { buildBufferPDF } from "$utils/buffer.utils";
import { DateTime } from "luxon";
import { ulid } from "ulid";

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
                    action: StatusAction.SEDANG_DIPROSES,
                    description: `Sedang Diproses Operator Akademik`,
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
export async function getAll(filters: FilteringQueryV2): Promise<ServiceResponse<GetAllResponse>> {
    try {
        const usedFilters = buildFilterQueryLimitOffsetV2(filters);

        const [SuratKeterangaKuliah, totalData] = await Promise.all([
            prisma.suratKeteranganKuliah.findMany({
                ...usedFilters,
                include: {
                    statusHistory: {
                        include: {
                            User: true,
                        },
                    },
                },
            }),
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
        const suratKeteranganKuliah = await prisma.suratKeteranganKuliah.findUnique({
            where: {
                id,
            },
            include: {
                statusHistory: {
                    include: {
                        User: true,
                    },
                },
            },
        });

        if (!suratKeteranganKuliah) return INVALID_ID_SERVICE_RESPONSE;

        const verificationExist = await prisma.suratKeteranganKuliah.findFirst({
            where: {
                OR: [
                    {
                        statusHistory: {
                            some: {
                                userId: user.id,
                                action: StatusAction.DISETUJUI,
                            },
                        },
                    },
                    {
                        statusHistory: {
                            some: {
                                userId: user.id,
                                action: StatusAction.DITOLAK,
                            },
                        },
                    },
                ],
            },
        });

        if (verificationExist) return BadRequestWithMessage("Kamu Sudah Melakukan Verifikasi Pada Surat Ini!");

        if (data.action === "DISETUJUI") {
            await prisma.statusHistory.create({
                data: {
                    id: ulid(),
                    action: StatusAction.DISETUJUI,
                    description: `DiSetujui oleh ${user.fullName}`,
                    userId: user.id,
                    suratKeteranganKuliahId: id,
                },
            });
        }

        if (data.action === "DITOLAK") {
            await prisma.statusHistory.create({
                data: {
                    id: ulid(),
                    action: StatusAction.DITOLAK,
                    description: `DiTolak oleh ${user.fullName}`,
                    userId: user.id,
                    suratKeteranganKuliahId: id,
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
