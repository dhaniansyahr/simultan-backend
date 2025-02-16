import { FilteringQueryV2, PagedList } from "$entities/Query";
import {
    BadRequestWithMessage,
    INTERNAL_SERVER_ERROR_SERVICE_RESPONSE,
    INVALID_ID_SERVICE_RESPONSE,
    ServiceResponse,
} from "$entities/Service";
import Logger from "$pkg/logger";
import { prisma } from "$utils/prisma.utils";
import { CutiSementara, StatusAction } from "@prisma/client";
import { CutiSementaraDTO, VerificationCutiDTO } from "$entities/CutiSementara";
import { buildFilterQueryLimitOffsetV2 } from "./helpers/FilterQueryV2";
import { UserJWTDAO } from "$entities/User";
import { ulid } from "ulid";

export type CreateResponse = CutiSementara | {};
export async function create(data: CutiSementaraDTO, user: UserJWTDAO): Promise<ServiceResponse<CreateResponse>> {
    try {
        data.offerById = user.id;
        const status = await prisma.$transaction(async (trx) => {
            const cuti = await prisma.cutiSementara.create({
                data,
            });

            await trx.statusHistory.create({
                data: {
                    id: ulid(),
                    action: StatusAction.SEDANG_DIPROSES,
                    cutiSementaraId: cuti.id,
                    description: "Sedang Diproses Oleh Operator Akademik",
                    userId: user.id,
                },
            });

            return cuti;
        });

        return {
            status: true,
            data: status,
        };
    } catch (err) {
        Logger.error(`CutiSementaraService.create : ${err}`);
        return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
}

export type GetAllResponse = PagedList<CutiSementara[]> | {};
export async function getAll(filters: FilteringQueryV2): Promise<ServiceResponse<GetAllResponse>> {
    try {
        const usedFilters = buildFilterQueryLimitOffsetV2(filters);

        const [cutiSementara, totalData] = await Promise.all([
            prisma.cutiSementara.findMany({
                ...usedFilters,
                include: {
                    offerBy: {
                        include: {
                            Mahasiswa: true,
                        },
                    },
                    statusHistory: {
                        include: {
                            User: true,
                        },
                    },
                },
            }),
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
            where: {
                id,
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

export type UpdateResponse = CutiSementara | {};
export async function update(id: string, data: CutiSementaraDTO): Promise<ServiceResponse<UpdateResponse>> {
    try {
        let cutiSementara = await prisma.cutiSementara.findUnique({
            where: {
                id,
            },
        });

        if (!cutiSementara) return INVALID_ID_SERVICE_RESPONSE;

        cutiSementara = await prisma.cutiSementara.update({
            where: {
                id,
            },
            data,
        });

        return {
            status: true,
            data: cutiSementara,
        };
    } catch (err) {
        Logger.error(`CutiSementaraService.update : ${err}`);
        return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
}

export async function deleteByIds(ids: string): Promise<ServiceResponse<{}>> {
    try {
        const idArray: string[] = JSON.parse(ids);

        idArray.forEach(async (id) => {
            await prisma.cutiSementara.delete({
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
        Logger.error(`CutiSementaraService.deleteByIds : ${err}`);
        return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
}

export async function verificationStatus(
    id: string,
    data: VerificationCutiDTO,
    user: UserJWTDAO
): Promise<ServiceResponse<{}>> {
    try {
        const cutiSementara = await prisma.cutiSementara.findUnique({
            where: {
                id,
            },
        });

        if (!cutiSementara) return INVALID_ID_SERVICE_RESPONSE;

        const verificationExist = await prisma.cutiSementara.findFirst({
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
            data: cutiSementara,
        };
    } catch (error) {
        Logger.error(`CutiSementaraService.verificationStatus : ${error}`);
        return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
}
