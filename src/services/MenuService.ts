import { FilteringQueryV2, PagedList } from "$entities/Query";
import {
        INTERNAL_SERVER_ERROR_SERVICE_RESPONSE,
        INVALID_ID_SERVICE_RESPONSE,
        ServiceResponse,
} from "$entities/Service";
import Logger from "$pkg/logger";
import { prisma } from "$utils/prisma.utils";
import { Menu } from "@prisma/client";
import { MenuDTO } from "$entities/Menu";
import { buildFilterQueryLimitOffsetV2 } from "./helpers/FilterQueryV2";

export type CreateResponse = Menu | {};
export async function create(data: MenuDTO): Promise<ServiceResponse<CreateResponse>> {
        try {
                const menu = await prisma.menu.create({
                        data,
                });

                return {
                        status: true,
                        data: menu,
                };
        } catch (err) {
                Logger.error(`MenuService.create : ${err}`);
                return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
        }
}

export type GetAllResponse = PagedList<Menu[]> | {};
export async function getAll(filters: FilteringQueryV2): Promise<ServiceResponse<GetAllResponse>> {
        try {
                const usedFilters = buildFilterQueryLimitOffsetV2(filters);

                const [menu, totalData] = await Promise.all([
                        prisma.menu.findMany(usedFilters),
                        prisma.menu.count({
                                where: usedFilters.where,
                        }),
                ]);

                let totalPage = 1;
                if (totalData > usedFilters.take) totalPage = Math.ceil(totalData / usedFilters.take);

                return {
                        status: true,
                        data: {
                                entries: menu,
                                totalData,
                                totalPage,
                        },
                };
        } catch (err) {
                Logger.error(`MenuService.getAll : ${err} `);
                return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
        }
}

export type GetByIdResponse = Menu | {};
export async function getById(id: number): Promise<ServiceResponse<GetByIdResponse>> {
        try {
                let menu = await prisma.menu.findUnique({
                        where: {
                                id,
                        },
                });

                if (!menu) return INVALID_ID_SERVICE_RESPONSE;

                return {
                        status: true,
                        data: menu,
                };
        } catch (err) {
                Logger.error(`MenuService.getById : ${err}`);
                return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
        }
}

export type GetByAksesLevelIdResponse = Menu | {};
export async function getByAksesLevelId(id: number): Promise<ServiceResponse<GetByIdResponse>> {
        try {
                let menu = await prisma.menu.findMany({
                        where: {
                                aksesLevelId: id,
                        },
                });

                if (!menu) return INVALID_ID_SERVICE_RESPONSE;

                console.log("MENU : ", menu);

                return {
                        status: true,
                        data: menu,
                };
        } catch (err) {
                Logger.error(`MenuService.getById : ${err}`);
                return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
        }
}

export type UpdateResponse = Menu | {};
export async function update(id: number, data: MenuDTO): Promise<ServiceResponse<UpdateResponse>> {
        try {
                let menu = await prisma.menu.findUnique({
                        where: {
                                id,
                        },
                });

                if (!menu) return INVALID_ID_SERVICE_RESPONSE;

                menu = await prisma.menu.update({
                        where: {
                                id,
                        },
                        data,
                });

                return {
                        status: true,
                        data: menu,
                };
        } catch (err) {
                Logger.error(`MenuService.update : ${err}`);
                return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
        }
}
