import { PrismaClient } from "@prisma/client";
import { ulid } from "ulid";

export async function seedAksesLevel(prisma: PrismaClient) {
        const userLevels = [
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
                "MAHASISWA",
        ];

        for (const level of userLevels) {
                const existingLevel = await prisma.aksesLevel.findUnique({
                        where: {
                                name: level,
                        },
                });

                if (!existingLevel) {
                        await prisma.aksesLevel.create({
                                data: {
                                        ulid: ulid(),
                                        name: level,
                                },
                        });
                }
        }

        console.log("All Akses Level Seeded");
}
