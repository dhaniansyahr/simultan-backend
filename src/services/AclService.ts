import { FilteringQueryV2, PagedList } from "$entities/Query";
import { INTERNAL_SERVER_ERROR_SERVICE_RESPONSE, INVALID_ID_SERVICE_RESPONSE, ServiceResponse } from "$entities/Service";
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
                        const featureActions = acls.filter((acl) => acl.namaFitur === feature.nama);
                        const actionMap: Record<string, boolean> = {};

                        // Get all possible actions for this feature from the database
                        const possibleActions = ["CREATE", "VIEW", "UPDATE", "DELETE", "EXPORT", "VERIFICATION"];

                        // Set each action to true/false based on if it exists in featureActions
                        possibleActions.forEach((action) => {
                                actionMap[action] = featureActions.some((fa) => fa.namaAksi === action);
                        });

                        return {
                                [feature.nama]: actionMap,
                        };
                });

                // Convert array of objects to single object
                const formattedAcl = mappingAcl.reduce((acc, curr) => ({ ...acc, ...curr }), {});

                return {
                        status: true,
                        data: formattedAcl,
                };
        } catch (error) {
                Logger.error(`AclService.getByAksesLevelId: ${error}`);
                return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
        }
}

export async function getMenuByAksesLevelId(aksesLevelId: number): Promise<ServiceResponse<{}>> {
        try {
                const menus = await prisma.menu.findMany({
                        where: {
                                aksesLevelId,
                        },
                        orderBy: [{ parentMenu: "asc" }, { title: "asc" }],
                });

                if (!menus) return INVALID_ID_SERVICE_RESPONSE;

                // Group child menus by their parent and remove duplicates
                const childMenusByParent = menus
                        .filter((menu) => menu.parentMenu) // Only menus with parents
                        .reduce((acc, menu) => {
                                const parentKey = menu.parentMenu!;
                                if (!acc[parentKey]) {
                                        acc[parentKey] = [];
                                }

                                // Check if this menu already exists in the parent's children
                                const existingMenu = acc[parentKey].find((existingItem) => existingItem.title === menu.title && existingItem.path === menu.path);

                                if (!existingMenu) {
                                        acc[parentKey].push({
                                                title: menu.title,
                                                path: menu.path,
                                                icon: menu.icon || "",
                                        });
                                }
                                return acc;
                        }, {} as Record<string, any[]>);

                // Get unique parent menus and standalone menus
                const parentMenus = Array.from(new Set(menus.filter((menu) => menu.parentMenu).map((menu) => menu.parentMenu!)));

                // Remove duplicate standalone menus
                const standaloneMenus = menus
                        .filter((menu) => !menu.parentMenu)
                        .filter((menu, index, self) => index === self.findIndex((m) => m.title === menu.title && m.path === menu.path));

                // Define the desired order for menus
                const menuOrder = ["Dashboard", "KEMAHASISWAAN", "AKADEMIK"];

                // Create all menu items (both parent and standalone)
                const allMenuItems = [
                        // Parent menus with their children
                        ...parentMenus.map((parentMenu) => ({
                                title: parentMenu,
                                path: `/${parentMenu!.toLowerCase()}`,
                                icon: getParentMenuIcon(parentMenu!),
                                children: childMenusByParent[parentMenu!] || [],
                        })),
                        // Standalone menus (no parent)
                        ...standaloneMenus.map((menu) => ({
                                title: menu.title,
                                path: menu.path,
                                icon: menu.icon || "",
                        })),
                ];

                // Sort all menus according to the desired order
                const formattedMenus = allMenuItems.sort((a, b) => {
                        const indexA = menuOrder.indexOf(a.title);
                        const indexB = menuOrder.indexOf(b.title);

                        // If both are in the order array, sort by their position
                        if (indexA !== -1 && indexB !== -1) {
                                return indexA - indexB;
                        }

                        // If only one is in the order array, prioritize it
                        if (indexA !== -1) return -1;
                        if (indexB !== -1) return 1;

                        // If neither is in the order array, maintain alphabetical order
                        return a.title.localeCompare(b.title);
                });

                return {
                        status: true,
                        data: formattedMenus,
                };
        } catch (error) {
                Logger.error(`AclService.getMenuByAksesLevelId: ${error}`);
                return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
        }
}

// Helper function to get icons for parent menus
function getParentMenuIcon(parentMenu: string): string {
        const iconMap: Record<string, string> = {
                KEMAHASISWAAN: "users",
                AKADEMIK: "book-open",
        };
        return iconMap[parentMenu] || "folder";
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
