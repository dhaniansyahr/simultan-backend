import { PrismaClient } from "@prisma/client";
import { ulid } from "ulid";

interface FeatureAction {
    feature: string;
    actions: string[];
}

export async function seedAcl(prisma: PrismaClient) {
    // Define features and their actions
    const featuresAndActions: FeatureAction[] = [
        {
            feature: "SURAT_KETERANGAN_KULIAH",
            actions: ["CREATE", "READ", "VERIFICATION"],
        },
        {
            feature: "CUTI_SEMENTARA",
            actions: ["CREATE", "READ", "VERIFICATION"],
        },
        {
            feature: "PENGAJUAN_YUDISIUM",
            actions: ["CREATE", "READ", "VERIFICATION"],
        },
        {
            feature: "LEGALISIR_IJAZAH",
            actions: ["CREATE", "READ", "VERIFICATION"],
        },
        {
            feature: "USER_MANAGEMENT",
            actions: ["CREATE", "READ", "UPDATE", "DELETE"],
        },
        {
            feature: "ACL",
            actions: ["CREATE", "READ", "UPDATE", "DELETE"],
        },
    ];

    // Create features and actions
    for (const featureAction of featuresAndActions) {
        // Create feature
        const feature = await prisma.feature.create({
            data: {
                ulid: ulid(),
                nama: featureAction.feature,
            },
        });

        // Create actions for the feature
        for (const actionName of featureAction.actions) {
            await prisma.action.create({
                data: {
                    ulid: ulid(),
                    nama: actionName,
                    namaFitur: feature.nama,
                    featureId: feature.id,
                },
            });
        }
    }

    // Define access level permissions
    const accessPermissions = [
        {
            level: "ADMIN",
            acl: [
                {
                    feature: "SURAT_KETERANGAN_KULIAH",
                    actions: ["READ"],
                },
                {
                    feature: "CUTI_SEMENTARA",
                    actions: ["READ"],
                },
                {
                    feature: "PENGAJUAN_YUDISIUM",
                    actions: ["READ"],
                },
                {
                    feature: "LEGALISIR_IJAZAH",
                    actions: ["READ"],
                },
                {
                    feature: "USER_MANAGEMENT",
                    actions: ["CREATE", "READ", "UPDATE", "DELETE"],
                },
                {
                    feature: "ACL",
                    actions: ["CREATE", "READ", "UPDATE", "DELETE"],
                },
            ],
        },
        {
            level: "OPERATOR_KEMAHASISWAAN",
            acl: [
                {
                    feature: "SURAT_KETERANGAN_KULIAH",
                    actions: ["READ", "VERIFICATION"],
                },
                {
                    feature: "CUTI_SEMENTARA",
                    actions: ["READ", "VERIFICATION"],
                },
            ],
        },
        {
            level: "OPERATOR_AKADEMIK",
            acl: [
                {
                    feature: "PENGAJUAN_YUDISIUM",
                    actions: ["READ", "VERIFICATION"],
                },
                {
                    feature: "LEGALISIR_IJAZAH",
                    actions: ["READ", "VERIFICATION"],
                },
            ],
        },
        {
            level: "KTU",
            acl: [
                {
                    feature: "SURAT_KETERANGAN_KULIAH",
                    actions: ["READ"],
                },
                {
                    feature: "CUTI_SEMENTARA",
                    actions: ["READ"],
                },
                {
                    feature: "PENGAJUAN_YUDISIUM",
                    actions: ["READ"],
                },
                {
                    feature: "LEGALISIR_IJAZAH",
                    actions: ["READ"],
                },
            ],
        },
        {
            level: "KASUBBAG_AKADEMIK",
            acl: [
                {
                    feature: "PENGAJUAN_YUDISIUM",
                    actions: ["READ", "VERIFICATION"],
                },
                {
                    feature: "LEGALISIR_IJAZAH",
                    actions: ["READ", "VERIFICATION"],
                },
            ],
        },
        {
            level: "KASUBBAG_KEMAHASISWAAN",
            acl: [
                {
                    feature: "SURAT_KETERANGAN_KULIAH",
                    actions: ["READ", "VERIFICATION"],
                },
                {
                    feature: "CUTI_SEMENTARA",
                    actions: ["READ", "VERIFICATION"],
                },
            ],
        },
        {
            level: "DEKAN",
            acl: [
                {
                    feature: "SURAT_KETERANGAN_KULIAH",
                    actions: ["READ"],
                },
                {
                    feature: "CUTI_SEMENTARA",
                    actions: ["READ"],
                },
                {
                    feature: "PENGAJUAN_YUDISIUM",
                    actions: ["READ"],
                },
                {
                    feature: "LEGALISIR_IJAZAH",
                    actions: ["READ"],
                },
            ],
        },
        {
            level: "WD_1",
            acl: [
                {
                    feature: "SURAT_KETERANGAN_KULIAH",
                    actions: ["READ"],
                },
                {
                    feature: "CUTI_SEMENTARA",
                    actions: ["READ"],
                },
                {
                    feature: "PENGAJUAN_YUDISIUM",
                    actions: ["READ"],
                },
                {
                    feature: "LEGALISIR_IJAZAH",
                    actions: ["READ"],
                },
            ],
        },
        {
            level: "KEPALA_DEPARTEMEN",
            acl: [
                {
                    feature: "SURAT_KETERANGAN_KULIAH",
                    actions: ["READ"],
                },
                {
                    feature: "CUTI_SEMENTARA",
                    actions: ["READ"],
                },
                {
                    feature: "PENGAJUAN_YUDISIUM",
                    actions: ["READ"],
                },
                {
                    feature: "LEGALISIR_IJAZAH",
                    actions: ["READ"],
                },
            ],
        },
        {
            level: "KEPALA_PRODI",
            acl: [
                {
                    feature: "SURAT_KETERANGAN_KULIAH",
                    actions: ["READ"],
                },
                {
                    feature: "CUTI_SEMENTARA",
                    actions: ["READ"],
                },
                {
                    feature: "PENGAJUAN_YUDISIUM",
                    actions: ["READ"],
                },
                {
                    feature: "LEGALISIR_IJAZAH",
                    actions: ["READ"],
                },
            ],
        },
        {
            level: "PIMPINAN_FAKULTAS",
            acl: [
                {
                    feature: "SURAT_KETERANGAN_KULIAH",
                    actions: ["READ"],
                },
                {
                    feature: "CUTI_SEMENTARA",
                    actions: ["READ"],
                },
                {
                    feature: "PENGAJUAN_YUDISIUM",
                    actions: ["READ"],
                },
                {
                    feature: "LEGALISIR_IJAZAH",
                    actions: ["READ"],
                },
            ],
        },
        {
            level: "MAHASISWA",
            acl: [
                {
                    feature: "SURAT_KETERANGAN_KULIAH",
                    actions: ["CREATE", "READ"],
                },
                {
                    feature: "CUTI_SEMENTARA",
                    actions: ["CREATE", "READ"],
                },
                {
                    feature: "PENGAJUAN_YUDISIUM",
                    actions: ["CREATE", "READ"],
                },
                {
                    feature: "LEGALISIR_IJAZAH",
                    actions: ["CREATE", "READ"],
                },
            ],
        },
    ];

    // Update the ACL creation loop
    for (const permission of accessPermissions) {
        const aksesLevel = await prisma.aksesLevel.findUnique({
            where: { name: permission.level },
        });

        if (aksesLevel) {
            for (const aclItem of permission.acl) {
                const feature = await prisma.feature.findUnique({
                    where: { nama: aclItem.feature },
                });

                if (feature) {
                    for (const actionName of aclItem.actions) {
                        const action = await prisma.action.findFirst({
                            where: {
                                nama: actionName,
                                featureId: feature.id,
                            },
                        });

                        if (action) {
                            await prisma.acl.create({
                                data: {
                                    ulid: ulid(),
                                    namaFitur: feature.nama,
                                    namaAksi: action.nama,
                                    aksesLevelId: aksesLevel.id,
                                    featureId: feature.id,
                                    actionId: action.id,
                                },
                            });
                        }
                    }
                }
            }
        }
    }

    console.log("All ACL entries seeded");
}
