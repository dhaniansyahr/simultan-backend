import { FilteringQueryV2, PagedList } from "$entities/Query";
import {
    BadRequestWithMessage,
    INTERNAL_SERVER_ERROR_SERVICE_RESPONSE,
    INVALID_ID_SERVICE_RESPONSE,
    ServiceResponse,
} from "$entities/Service";
import Logger from "$pkg/logger";
import { prisma } from "$utils/prisma.utils";
import { CutiSementara } from "@prisma/client";
import { CutiSementaraDTO } from "$entities/CutiSementara";
import { buildFilterQueryLimitOffsetV2 } from "./helpers/FilterQueryV2";
import { UserJWTDAO } from "$entities/User";

export type CreateResponse = CutiSementara | {};
export async function create(data: CutiSementaraDTO, user: UserJWTDAO): Promise<ServiceResponse<CreateResponse>> {
    try {
        const userLevel = await prisma.userLevel.findUnique({
            where: {
                id: user.userLevelId,
            },
        });

        if (!userLevel) return BadRequestWithMessage("User Level not found!");

        let cutiSementara: any;

        if (userLevel.name !== "MAHASISWA") return BadRequestWithMessage("Just Mahasiswa able to offering this!");

        data.offerById = user.id;
        cutiSementara = await prisma.cutiSementara.create({
            data,
        });

        return {
            status: true,
            data: cutiSementara,
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
            prisma.cutiSementara.findMany(usedFilters),
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
