import { AclCreateDTO } from "$entities/Acl";
import {
    INTERNAL_SERVER_ERROR_SERVICE_RESPONSE,
    INVALID_ID_SERVICE_RESPONSE,
    ServiceResponse,
} from "$entities/Service";
import Logger from "$pkg/logger";
import { prisma } from "$utils/prisma.utils";
import { Prisma } from "@prisma/client";
import { ulid } from "ulid";

export async function create(data: AclCreateDTO): Promise<ServiceResponse<{}>> {
    try {
        const aclCreateManyInputData: Prisma.AclCreateManyInput[] = [];

        for (const acl of data.acl) {
            for (const action of acl.actions) {
                aclCreateManyInputData.push({
                    id: ulid(),
                    actionName: action,
                    featureName: acl.featureName,
                    userLevelId: data.userLevelId,
                });
            }
        }

        await prisma.$transaction([
            prisma.acl.deleteMany({
                where: {
                    userLevelId: data.userLevelId,
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

export async function getByUserLevelId(userLevelId: string): Promise<ServiceResponse<{}>> {
    try {
        const features = await prisma.feature.findMany();

        let acls = await prisma.acl.findMany({
            where: {
                userLevelId,
            },
        });

        if (acls.length == 0) return INVALID_ID_SERVICE_RESPONSE;

        const mappingAcl = features.map((feature) => {
            const actions = acls
                .filter((acl) => acl.featureName === feature.name) // Filter berdasarkan featureName
                .map((acl) => acl.actionName);
            return {
                feature: feature.name,
                actions,
            };
        });

        return {
            status: true,
            data: mappingAcl,
        };
    } catch (error) {
        Logger.error(`AclService.getByUserLevelId: ${error}`);
        return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
}

export async function getAllFeature(): Promise<ServiceResponse<{}>> {
    try {
        const features = await prisma.feature.findMany({
            include: {
                action: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        return {
            status: true,
            data: features,
        };
    } catch (error) {
        Logger.error(`AclService.getByUserLevelId: ${error}`);
        return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
}
