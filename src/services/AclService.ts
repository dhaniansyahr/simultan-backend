import { FilteringQueryV2, PagedList } from "$entities/Query";
import {
        INTERNAL_SERVER_ERROR_SERVICE_RESPONSE,
        INVALID_ID_SERVICE_RESPONSE,
        ServiceResponse,
} from "$entities/Service";
import Logger from "$pkg/logger";
import { prisma } from "$utils/prisma.utils";
import { AksesLevel, Prisma } from "@prisma/client";
import { ulid } from "ulid";
import { buildFilterQueryLimitOffsetV2 } from "./helpers/FilterQueryV2";
import { AclCreateDTO } from "$entities/Acl";

export async function create(data: AclCreateDTO): Promise<ServiceResponse<{}>> {
        try {
                const aclCreateManyInputData: Prisma.AclCreateManyInput[] = [];

                for (const acl of data.acl) {
                        const feature = await prisma.feature.findUnique({
                                where: { nama: acl.namaFitur },
                        });

                        if (!feature) continue;

                        for (const actionName of acl.actions) {
                                const action = await prisma.action.findFirst({
                                        where: {
                                                nama: actionName,
                                        },
                                });

                                if (!action) continue;

                                aclCreateManyInputData.push({
                                        ulid: ulid(),
                                        namaFitur: acl.namaFitur,
                                        namaAksi: actionName,
                                        aksesLevelId: data.aksesLevelId,
                                });
                        }
                }

                await prisma.$transaction([
                        prisma.acl.deleteMany({
                                where: {
                                        aksesLevelId: data.aksesLevelId,
                                },
                        }),
                        prisma.acl.createMany({
                                data: aclCreateManyInputData,
                        }),
                ]);

                return {
                        status: true,
                        data: {},
                };
        } catch (error) {
                Logger.error(`AclService.create: ${error}`);
                return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
        }
}

export async function getByAksesLevelId(aksesLevelId: number): Promise<ServiceResponse<{}>> {
        try {
                const features = await prisma.feature.findMany();

                let acls = await prisma.acl.findMany({
                        where: {
                                aksesLevelId,
                        },
                        include: {
                                feature: true,
                        },
                });

                if (acls.length === 0) return INVALID_ID_SERVICE_RESPONSE;

                const mappingAcl = features.map((feature) => {
                        const actions = acls.filter((acl) => acl.namaFitur === feature.nama).map((acl) => acl.namaAksi);
                        return {
                                feature: feature.nama,
                                actions,
                        };
                });

                return {
                        status: true,
                        data: mappingAcl,
                };
        } catch (error) {
                Logger.error(`AclService.getByAksesLevelId: ${error}`);
                return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
        }
}

export async function getAllFeature(): Promise<ServiceResponse<{}>> {
        try {
                const features = await prisma.feature.findMany({
                        include: {
                                actions: {
                                        select: {
                                                nama: true,
                                        },
                                },
                        },
                });

                return {
                        status: true,
                        data: features,
                };
        } catch (error) {
                Logger.error(`AclService.getAllFeature: ${error}`);
                return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
        }
}

export type GetAllResponse = PagedList<AksesLevel[]> | {};
export async function getAllAksesLevel(filters: FilteringQueryV2): Promise<ServiceResponse<GetAllResponse>> {
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
                Logger.error(`AclService.getAllAksesLevel: ${err}`);
                return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
        }
}
