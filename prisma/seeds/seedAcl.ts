import { Prisma, PrismaClient } from "@prisma/client";
import { ulid } from "ulid";

export async function seedAcl(prisma: PrismaClient) {
    const features = [
        {
            featureName: "MANAGEMENT_USER",
            actions: ["CREATE", "VIEW", "UPDATE", "DELETE"],
        },
        {
            featureName: "USER_LEVEL",
            actions: ["CREATE", "VIEW", "UPDATE", "DELETE"],
        },
        {
            featureName: "ACL",
            actions: ["CREATE", "VIEW", "UPDATE", "DELETE"],
        },
        {
            featureName: "SURAT_KETERANGAN_KULIAH",
            actions: ["CREATE", "VIEW", "VERIFICATION", "EXPORT"],
        },
        {
            featureName: "CUTI_SEMENTARA",
            actions: ["CREATE", "VIEW", "VERIFICATION", "EXPORT"],
        },
    ];

    const featuresMahasiswa = [
        {
            featureName: "SURAT_KETERANGAN_KULIAH",
            actions: ["CREATE", "VIEW", "EXPORT"],
        },
        {
            featureName: "CUTI_SEMENTARA",
            actions: ["CREATE", "VIEW", "EXPORT"],
        },
    ];

    for (const feature of features) {
        const existingFeature = await prisma.feature.findUnique({
            where: {
                name: feature.featureName,
            },
        });

        if (!existingFeature) {
            await prisma.feature.create({
                data: {
                    id: ulid(),
                    name: feature.featureName,
                },
            });
        }

        const actionCreateManyData: Prisma.ActionCreateManyInput[] = [];
        for (const action of feature.actions) {
            const existingFeatureAction = await prisma.action.findUnique({
                where: {
                    featureName_name: {
                        name: action,
                        featureName: feature.featureName,
                    },
                },
            });

            if (!existingFeatureAction) {
                actionCreateManyData.push({
                    id: ulid(),
                    name: action,
                    featureName: feature.featureName,
                });
            }
        }

        await prisma.action.createMany({
            data: actionCreateManyData,
        });
    }

    const [allSubFeatures, userLevel, adminUser, userLevelMhs] = await Promise.all([
        prisma.action.findMany({
            include: {
                feature: true,
            },
        }),
        prisma.userLevel.findUnique({
            where: {
                name: "ADMIN",
            },
        }),
        prisma.user.findUnique({
            where: {
                email: "admin@test.com",
            },
        }),
        prisma.userLevel.findUnique({
            where: {
                name: "MAHASISWA",
            },
        }),
    ]);

    if (!userLevel || !adminUser) {
        return "seedAcl error";
    }

    if (!adminUser.userLevelId) {
        await prisma.user.update({
            where: {
                id: adminUser.id,
            },
            data: {
                userLevelId: userLevel.id,
            },
        });
    }

    const aclCreateManyData: Prisma.AclCreateManyInput[] = [];
    for (const action of allSubFeatures) {
        const aclAdminMappingExist = await prisma.acl.findUnique({
            where: {
                featureName_actionName_userLevelId: {
                    featureName: action.featureName,
                    actionName: action.name,
                    userLevelId: userLevel.id,
                },
            },
        });

        if (!aclAdminMappingExist) {
            aclCreateManyData.push({
                id: ulid(),
                actionName: action.name,
                featureName: action.featureName,
                userLevelId: userLevel.id,
            });
        }
    }

    await prisma.acl.createMany({
        data: aclCreateManyData,
    });
}
