import { PARENT_MENU, PrismaClient } from "@prisma/client";
import { ulid } from "ulid";

interface MenuData {
  parentMenu?: PARENT_MENU;
  title: string;
  path: string;
  icon?: string;
  aksesLevel: string[];
}

export async function seedMenu(prisma: PrismaClient) {
  const menus: MenuData[] = [
    // Kemahasiswaan Parent Group
    {
      parentMenu: PARENT_MENU.KEMAHASISWAAN,
      title: "Surat Keterangan Aktif Kuliah",
      path: "/surat-keterangan-aktif-kuliah",
      icon: "file-text",
      aksesLevel: [
        "ADMIN",
        "OPERATOR_KEMAHASISWAAN",
        "MAHASISWA",
        "KASUBBAG_KEMAHASISWAAN",
      ],
    },
    {
      parentMenu: PARENT_MENU.KEMAHASISWAAN,
      title: "Pengajuan Cuti Sementara",
      path: "/pengajuan-cuti-sementara",
      icon: "clock",
      aksesLevel: [
        "ADMIN",
        "OPERATOR_KEMAHASISWAAN",
        "MAHASISWA",
        "KASUBBAG_KEMAHASISWAAN",
      ],
    },
    {
      parentMenu: PARENT_MENU.KEMAHASISWAAN,
      title: "Surat Keterangan Lulus",
      path: "/surat-keterangan-lulus",
      icon: "award",
      aksesLevel: [
        "ADMIN",
        "OPERATOR_KEMAHASISWAAN",
        "MAHASISWA",
        "KASUBBAG_KEMAHASISWAAN",
      ],
    },

    // Akademik Parent Group
    {
      parentMenu: PARENT_MENU.AKADEMIK,
      title: "Pengajuan Yudisium",
      path: "/pengajuan-yudisium",
      icon: "graduation-cap",
      aksesLevel: [
        "ADMIN",
        "OPERATOR_AKADEMIK",
        "MAHASISWA",
        "KASUBBAG_AKADEMIK",
      ],
    },
    {
      parentMenu: PARENT_MENU.AKADEMIK,
      title: "Pengajuan Legalisir Ijazah",
      path: "/legalisir-ijazah",
      icon: "file-check",
      aksesLevel: [
        "ADMIN",
        "OPERATOR_AKADEMIK",
        "MAHASISWA",
        "KASUBBAG_AKADEMIK",
      ],
    },
    {
      parentMenu: PARENT_MENU.AKADEMIK,
      title: "Rekomendasi Beasiswa",
      path: "/rekomendasi-beasiswa",
      icon: "user-check",
      aksesLevel: [
        "ADMIN",
        "OPERATOR_AKADEMIK",
        "MAHASISWA",
        "KASUBBAG_AKADEMIK",
      ],
    },

    // Standalone Menus (No Parent)
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: "home",
      aksesLevel: [
        "ADMIN",
        "OPERATOR_KEMAHASISWAAN",
        "OPERATOR_AKADEMIK",
        "MAHASISWA",
        "KASUBBAG_KEMAHASISWAAN",
        "KASUBBAG_AKADEMIK",
      ],
    },
    {
      title: "User Management",
      path: "/user-management",
      icon: "users",
      aksesLevel: ["ADMIN"],
    },
    {
      title: "Access Control List",
      path: "/acl",
      icon: "shield",
      aksesLevel: ["ADMIN"],
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
              parentMenu: menu.parentMenu,
              title: menu.title,
              path: menu.path,
              icon: menu.icon,
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
