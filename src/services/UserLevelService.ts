import { FilteringQueryV2, PagedList } from "$entities/Query";
import {
    INTERNAL_SERVER_ERROR_SERVICE_RESPONSE,
    INVALID_ID_SERVICE_RESPONSE,
    ServiceResponse,
} from "$entities/Service";
import Logger from "$pkg/logger";
import { prisma } from "$utils/prisma.utils";
import { UserLevel } from "@prisma/client";
import { buildFilterQueryLimitOffsetV2 } from "./helpers/FilterQueryV2";
import { UserLevelDTO } from "$entities/UserLevel";

export type CreateResponse = UserLevel | {};
export async function create(data: UserLevelDTO): Promise<ServiceResponse<CreateResponse>> {
    try {
        const userLevel = await prisma.userLevel.create({
            data,
        });

        return {
            status: true,
            data: userLevel,
        };
    } catch (err) {
        Logger.error(`UserLevelService.create : ${err}`);
        return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
}

export type GetAllResponse = PagedList<UserLevel[]> | {};
export async function getAll(filters: FilteringQueryV2): Promise<ServiceResponse<GetAllResponse>> {
    try {
        const usedFilters = buildFilterQueryLimitOffsetV2(filters);

        const [userLevel, totalData] = await Promise.all([
            prisma.userLevel.findMany(usedFilters),
            prisma.userLevel.count({
                where: usedFilters.where,
            }),
        ]);

        let totalPage = 1;
        if (totalData > usedFilters.take) totalPage = Math.ceil(totalData / usedFilters.take);

        return {
            status: true,
            data: {
                entries: userLevel,
                totalData,
                totalPage,
            },
        };
    } catch (err) {
        Logger.error(`UserLevelService.getAll : ${err} `);
        return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
}

export type GetByIdResponse = UserLevel | {};
export async function getById(id: string): Promise<ServiceResponse<GetByIdResponse>> {
    try {
        let userLevel = await prisma.userLevel.findUnique({
            where: {
                id,
            },
            include: {
                acl: true,
            },
        });

        if (!userLevel) return INVALID_ID_SERVICE_RESPONSE;

        return {
            status: true,
            data: userLevel,
        };
    } catch (err) {
        Logger.error(`UserLevelService.getById : ${err}`);
        return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
}

export type UpdateResponse = UserLevel | {};
export async function update(id: string, data: UserLevelDTO): Promise<ServiceResponse<UpdateResponse>> {
    try {
        let userLevel = await prisma.userLevel.findUnique({
            where: {
                id,
            },
        });

        if (!userLevel) return INVALID_ID_SERVICE_RESPONSE;

        userLevel = await prisma.userLevel.update({
            where: {
                id,
            },
            data,
        });

        return {
            status: true,
            data: userLevel,
        };
    } catch (err) {
        Logger.error(`UserLevelService.update : ${err}`);
        return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
}

export async function deleteByIds(ids: string): Promise<ServiceResponse<{}>> {
    try {
        const idArray: string[] = JSON.parse(ids);

        idArray.forEach(async (id) => {
            await prisma.userLevel.delete({
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
        Logger.error(`UserLevelService.deleteByIds : ${err}`);
        return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
}
