import { PrismaClient } from "@prisma/client";
import { ulid } from "ulid";

export async function seedUserLevel(prisma: PrismaClient) {
    const userLevels = [
        "ADMIN",
        "MAHASISWA",
        "DOSEN",
        "KTU",
        "KASUBBAG_AKADEMIK",
        "KASUBBAG_KEMAHASISWAAN",
        "BAG_KEMAHASISWAAN",
        "OPERATOR_AKADEMIK",
        "OPERATOR_KEMAHASISWAAN",
        "DEKAN",
        "WD_1",
        "KETUA_DEPARTEMEN",
        "PIMPINAN_FAKULTAS",
    ];

    for (const level of userLevels) {
        const existingLevel = await prisma.userLevel.findUnique({
            where: {
                name: level,
            },
        });

        if (!existingLevel) {
            await prisma.userLevel.create({
                data: {
                    id: ulid(),
                    name: level,
                },
            });
        }
    }

    console.log("User Levels Seeded");
}
