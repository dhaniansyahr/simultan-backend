import { Prisma, PrismaClient } from "@prisma/client";
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
                        actions: ["CREATE", "VIEW", "UPDATE", "EXPORT", "VERIFICATION", "NOMOR_SURAT"],
                },
                {
                        feature: "CUTI_SEMENTARA",
                        actions: ["CREATE", "VIEW", "UPDATE", "EXPORT", "VERIFICATION"],
                },
                {
                        feature: "PENGAJUAN_YUDISIUM",
                        actions: ["CREATE", "VIEW", "UPDATE", "EXPORT", "VERIFICATION"],
                },
                {
                        feature: "LEGALISIR_IJAZAH",
                        actions: ["CREATE", "VIEW", "UPDATE", "EXPORT", "VERIFICATION"],
                },
                {
                        feature: "USER_MANAGEMENT",
                        actions: ["CREATE", "VIEW", "UPDATE", "DELETE"],
                },
                {
                        feature: "ACL",
                        actions: ["CREATE", "VIEW", "UPDATE", "DELETE"],
                },
                {
                        feature: "DASHBOARD",
                        actions: ["VIEW"],
                },
        ];

        for (const feature of featuresAndActions) {
                const existingFeature = await prisma.feature.findUnique({
                        where: {
                                nama: feature.feature,
                        },
                });

                if (!existingFeature) {
                        await prisma.feature.create({
                                data: {
                                        ulid: ulid(),
                                        nama: feature.feature,
                                },
                        });
                }

                const actionCreateManyData: Prisma.ActionCreateManyInput[] = [];
                for (const action of feature.actions) {
                        const existingFeatureAction = await prisma.action.findUnique({
                                where: {
                                        namaFitur_nama: {
                                                nama: action,
                                                namaFitur: feature.feature,
                                        },
                                },
                        });

                        if (!existingFeatureAction) {
                                actionCreateManyData.push({
                                        ulid: ulid(),
                                        nama: action,
                                        namaFitur: feature.feature,
                                });
                        }
                }

                await prisma.action.createMany({
                        data: actionCreateManyData,
                });
        }

        // Define access level permissions
        const accessPermissions = [
                {
                        level: "ADMIN",
                        acl: [
                                {
                                        feature: "SURAT_KETERANGAN_KULIAH",
                                        actions: ["VIEW"],
                                },
                                {
                                        feature: "CUTI_SEMENTARA",
                                        actions: ["VIEW"],
                                },
                                {
                                        feature: "PENGAJUAN_YUDISIUM",
                                        actions: ["VIEW"],
                                },
                                {
                                        feature: "LEGALISIR_IJAZAH",
                                        actions: ["VIEW"],
                                },
                                {
                                        feature: "USER_MANAGEMENT",
                                        actions: ["CREATE", "VIEW", "UPDATE", "DELETE"],
                                },
                                {
                                        feature: "ACL",
                                        actions: ["CREATE", "VIEW", "UPDATE", "DELETE"],
                                },
                                {
                                        feature: "DASHBOARD",
                                        actions: ["VIEW"],
                                },
                        ],
                },
                {
                        level: "OPERATOR_KEMAHASISWAAN",
                        acl: [
                                {
                                        feature: "SURAT_KETERANGAN_KULIAH",
                                        actions: ["VIEW", "VERIFICATION","NOMOR_SURAT"],
                                },
                                {
                                        feature: "CUTI_SEMENTARA",
                                        actions: ["VIEW", "VERIFICATION"],
                                },
                                {
                                        feature: "DASHBOARD",
                                        actions: ["VIEW"],
                                },
                        ],
                },
                {
                        level: "OPERATOR_AKADEMIK",
                        acl: [
                                {
                                        feature: "PENGAJUAN_YUDISIUM",
                                        actions: ["VIEW", "VERIFICATION"],
                                },
                                {
                                        feature: "LEGALISIR_IJAZAH",
                                        actions: ["VIEW", "VERIFICATION"],
                                },
                                {
                                        feature: "DASHBOARD",
                                        actions: ["VIEW"],
                                },
                        ],
                },
                {
                        level: "KTU",
                        acl: [
                                {
                                        feature: "SURAT_KETERANGAN_KULIAH",
                                        actions: ["VIEW"],
                                },
                                {
                                        feature: "CUTI_SEMENTARA",
                                        actions: ["VIEW"],
                                },
                                {
                                        feature: "PENGAJUAN_YUDISIUM",
                                        actions: ["VIEW"],
                                },
                                {
                                        feature: "LEGALISIR_IJAZAH",
                                        actions: ["VIEW"],
                                },
                                {
                                        feature: "DASHBOARD",
                                        actions: ["VIEW"],
                                },
                        ],
                },
                {
                        level: "KASUBBAG_AKADEMIK",
                        acl: [
                                {
                                        feature: "PENGAJUAN_YUDISIUM",
                                        actions: ["VIEW", "VERIFICATION"],
                                },
                                {
                                        feature: "LEGALISIR_IJAZAH",
                                        actions: ["VIEW", "VERIFICATION"],
                                },
                                {
                                        feature: "DASHBOARD",
                                        actions: ["VIEW"],
                                },
                        ],
                },
                {
                        level: "KASUBBAG_KEMAHASISWAAN",
                        acl: [
                                {
                                        feature: "SURAT_KETERANGAN_KULIAH",
                                        actions: ["VIEW", "VERIFICATION", "NOMOR_SURAT"],
                                },
                                {
                                        feature: "CUTI_SEMENTARA",
                                        actions: ["VIEW", "VERIFICATION"],
                                },
                                {
                                        feature: "DASHBOARD",
                                        actions: ["VIEW"],
                                },
                        ],
                },
                {
                        level: "DEKAN",
                        acl: [
                                {
                                        feature: "SURAT_KETERANGAN_KULIAH",
                                        actions: ["VIEW"],
                                },
                                {
                                        feature: "CUTI_SEMENTARA",
                                        actions: ["VIEW"],
                                },
                                {
                                        feature: "PENGAJUAN_YUDISIUM",
                                        actions: ["VIEW"],
                                },
                                {
                                        feature: "LEGALISIR_IJAZAH",
                                        actions: ["VIEW"],
                                },
                                {
                                        feature: "DASHBOARD",
                                        actions: ["VIEW"],
                                },
                        ],
                },
                {
                        level: "WD_1",
                        acl: [
                                {
                                        feature: "SURAT_KETERANGAN_KULIAH",
                                        actions: ["VIEW"],
                                },
                                {
                                        feature: "CUTI_SEMENTARA",
                                        actions: ["VIEW"],
                                },
                                {
                                        feature: "PENGAJUAN_YUDISIUM",
                                        actions: ["VIEW"],
                                },
                                {
                                        feature: "LEGALISIR_IJAZAH",
                                        actions: ["VIEW"],
                                },
                                {
                                        feature: "DASHBOARD",
                                        actions: ["VIEW"],
                                },
                        ],
                },
                {
                        level: "KEPALA_DEPARTEMEN",
                        acl: [
                                {
                                        feature: "SURAT_KETERANGAN_KULIAH",
                                        actions: ["VIEW"],
                                },
                                {
                                        feature: "CUTI_SEMENTARA",
                                        actions: ["VIEW"],
                                },
                                {
                                        feature: "PENGAJUAN_YUDISIUM",
                                        actions: ["VIEW"],
                                },
                                {
                                        feature: "LEGALISIR_IJAZAH",
                                        actions: ["VIEW"],
                                },
                                {
                                        feature: "DASHBOARD",
                                        actions: ["VIEW"],
                                },
                        ],
                },
                {
                        level: "KEPALA_PRODI",
                        acl: [
                                {
                                        feature: "SURAT_KETERANGAN_KULIAH",
                                        actions: ["VIEW"],
                                },
                                {
                                        feature: "CUTI_SEMENTARA",
                                        actions: ["VIEW"],
                                },
                                {
                                        feature: "PENGAJUAN_YUDISIUM",
                                        actions: ["VIEW"],
                                },
                                {
                                        feature: "LEGALISIR_IJAZAH",
                                        actions: ["VIEW"],
                                },
                                {
                                        feature: "DASHBOARD",
                                        actions: ["VIEW"],
                                },
                        ],
                },
                {
                        level: "PIMPINAN_FAKULTAS",
                        acl: [
                                {
                                        feature: "SURAT_KETERANGAN_KULIAH",
                                        actions: ["VIEW"],
                                },
                                {
                                        feature: "CUTI_SEMENTARA",
                                        actions: ["VIEW"],
                                },
                                {
                                        feature: "PENGAJUAN_YUDISIUM",
                                        actions: ["VIEW"],
                                },
                                {
                                        feature: "LEGALISIR_IJAZAH",
                                        actions: ["VIEW"],
                                },
                                {
                                        feature: "DASHBOARD",
                                        actions: ["VIEW"],
                                },
                        ],
                },
                {
                        level: "MAHASISWA",
                        acl: [
                                {
                                        feature: "SURAT_KETERANGAN_KULIAH",
                                        actions: ["CREATE", "UPDATE", "VIEW", "EXPORT"],
                                },
                                {
                                        feature: "CUTI_SEMENTARA",
                                        actions: ["CREATE", "UPDATE", "VIEW"],
                                },
                                {
                                        feature: "PENGAJUAN_YUDISIUM",
                                        actions: ["CREATE", "UPDATE", "VIEW", "EXPORT"],
                                },
                                {
                                        feature: "LEGALISIR_IJAZAH",
                                        actions: ["CREATE", "UPDATE", "VIEW"],
                                },
                                {
                                        feature: "DASHBOARD",
                                        actions: ["VIEW"],
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
                                                        },
                                                });

                                                if (action) {
                                                        // Check if ACL entry already exists
                                                        const existingAcl = await prisma.acl.findUnique({
                                                                where: {
                                                                        namaFitur_namaAksi_aksesLevelId: {
                                                                                namaFitur: feature.nama,
                                                                                namaAksi: action.nama,
                                                                                aksesLevelId: aksesLevel.id,
                                                                        },
                                                                },
                                                        });

                                                        if (!existingAcl) {
                                                                await prisma.acl.create({
                                                                        data: {
                                                                                ulid: ulid(),
                                                                                namaFitur: feature.nama,
                                                                                namaAksi: action.nama,
                                                                                aksesLevelId: aksesLevel.id,
                                                                        },
                                                                });
                                                        }
                                                }
                                        }
                                }
                        }
                }
        }

        console.log("All ACL entries seeded");
}
