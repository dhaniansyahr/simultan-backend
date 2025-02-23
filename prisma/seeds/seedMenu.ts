import { PrismaClient } from "@prisma/client";
import { ulid } from "ulid";

interface MenuData {
        title: string;
        path: string;
        aksesLevel: string[];
}

export async function seedMenu(prisma: PrismaClient) {
        const menus: MenuData[] = [
                {
                        title: "Surat Keterangan Kuliah",
                        path: "/college-certificate",
                        aksesLevel: ["ADMIN", "OPERATOR_KEMAHASISWAAN", "MAHASISWA"],
                },
                {
                        title: "Cuti Sementara",
                        path: "/temporary-leave",
                        aksesLevel: ["ADMIN", "OPERATOR_KEMAHASISWAAN", "MAHASISWA"],
                },
                {
                        title: "Pengajuan Yudisium",
                        path: "/graduation-submission",
                        aksesLevel: ["ADMIN", "OPERATOR_AKADEMIK", "MAHASISWA"],
                },
                {
                        title: "Legalisir Ijazah",
                        path: "/certificate-legalization",
                        aksesLevel: ["ADMIN", "OPERATOR_AKADEMIK", "MAHASISWA"],
                },
                {
                        title: "User Management",
                        path: "/user-management",
                        aksesLevel: ["ADMIN"],
                },
                {
                        title: "Access Control List",
                        path: "/acl",
                        aksesLevel: ["ADMIN"],
                },
                {
                        title: "Dashboard",
                        path: "/dashboard",
                        aksesLevel: [
                                "ADMIN",
                                "OPERATOR_KEMAHASISWAAN",
                                "OPERATOR_AKADEMIK",
                                "KTU",
                                "KASUBBAG_AKADEMIK",
                                "KASUBBAG_KEMAHASISWAAN",
                                "DEKAN",
                                "WD_1",
                                "KEPALA_DEPARTEMEN",
                                "KEPALA_PRODI",
                                "PIMPINAN_FAKULTAS",
                        ],
                },
        ];

        for (const menu of menus) {
                for (const level of menu.aksesLevel) {
                        const aksesLevel = await prisma.aksesLevel.findUnique({
                                where: { name: level },
                        });

                        if (aksesLevel) {
                                const acl = await prisma.acl.findFirst({
                                        where: {
                                                aksesLevelId: aksesLevel.id,
                                        },
                                });

                                if (acl) {
                                        await prisma.menu.create({
                                                data: {
                                                        ulid: ulid(),
                                                        title: menu.title,
                                                        path: menu.path,
                                                        aksesLevelId: aksesLevel.id,
                                                        aclId: acl.id,
                                                },
                                        });
                                }
                        }
                }
        }

        console.log("All menus seeded");
}
