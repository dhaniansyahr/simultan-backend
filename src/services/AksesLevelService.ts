import { FilteringQueryV2, PagedList } from "$entities/Query";
import {
        INTERNAL_SERVER_ERROR_SERVICE_RESPONSE,
        INVALID_ID_SERVICE_RESPONSE,
        ServiceResponse,
} from "$entities/Service";
import Logger from "$pkg/logger";
import { prisma } from "$utils/prisma.utils";
import { AksesLevel } from "@prisma/client";
import { buildFilterQueryLimitOffsetV2 } from "./helpers/FilterQueryV2";
import { AksesLevelDTO } from "$entities/AksesLevel";

export type CreateResponse = AksesLevel | {};
export async function create(data: AksesLevelDTO): Promise<ServiceResponse<CreateResponse>> {
        try {
                const aksesLevel = await prisma.aksesLevel.create({
                        data: {
                                ulid: data.ulid,
                                name: data.name,
                        },
                });

                return {
                        status: true,
                        data: aksesLevel,
                };
        } catch (err) {
                Logger.error(`AksesLevelService.create : ${err}`);
                return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
        }
}

export type GetAllResponse = PagedList<AksesLevel[]> | {};
export async function getAll(filters: FilteringQueryV2): Promise<ServiceResponse<GetAllResponse>> {
        try {
                const usedFilters = buildFilterQueryLimitOffsetV2(filters);

                const [aksesLevel, totalData] = await Promise.all([
                        prisma.aksesLevel.findMany(usedFilters),
                        prisma.aksesLevel.count({
                                where: usedFilters.where,
                        }),
                ]);

                let totalPage = 1;
                if (totalData > usedFilters.take) totalPage = Math.ceil(totalData / usedFilters.take);

                return {
                        status: true,
                        data: {
                                entries: aksesLevel,
                                totalData,
                                totalPage,
                        },
                };
        } catch (err) {
                Logger.error(`AksesLevelService.getAll : ${err}`);
                return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
        }
}

export type GetByIdResponse = AksesLevel | {};
export async function getById(id: number): Promise<ServiceResponse<GetByIdResponse>> {
        try {
                const aksesLevel = await prisma.aksesLevel.findUnique({
                        where: {
                                id,
                        },
                        include: {
                                acl: true,
                                menu: true,
                                users: {
                                        select: {
                                                id: true,
                                                nama: true,
                                                npm: true,
                                        },
                                },
                        },
                });

                if (!aksesLevel) return INVALID_ID_SERVICE_RESPONSE;

                return {
                        status: true,
                        data: aksesLevel,
                };
        } catch (err) {
                Logger.error(`AksesLevelService.getById : ${err}`);
                return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
        }
}

export type UpdateResponse = AksesLevel | {};
export async function update(id: number, data: AksesLevelDTO): Promise<ServiceResponse<UpdateResponse>> {
        try {
                const aksesLevel = await prisma.aksesLevel.findUnique({
                        where: { id },
                });

                if (!aksesLevel) return INVALID_ID_SERVICE_RESPONSE;

                const updatedAksesLevel = await prisma.aksesLevel.update({
                        where: { id },
                        data: {
                                name: data.name,
                        },
                });

                return {
                        status: true,
                        data: updatedAksesLevel,
                };
        } catch (err) {
                Logger.error(`AksesLevelService.update : ${err}`);
                return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
        }
}

export async function deleteByIds(ids: string): Promise<ServiceResponse<{}>> {
        try {
                const idArray: number[] = JSON.parse(ids);

                await prisma.$transaction(
                        idArray.map((id) =>
                                prisma.aksesLevel.delete({
                                        where: { id },
                                })
                        )
                );

                return {
                        status: true,
                        data: {},
                };
        } catch (err) {
                Logger.error(`AksesLevelService.deleteByIds : ${err}`);
                return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
        }
}
