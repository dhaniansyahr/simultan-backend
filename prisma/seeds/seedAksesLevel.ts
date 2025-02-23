import { PrismaClient } from "@prisma/client";
import { ulid } from "ulid";

export async function seedAksesLevel(prisma: PrismaClient) {
        const aksesLevels = [
                { name: "ADMIN" },
                { name: "OPERATOR_KEMAHASISWAAN" },
                { name: "OPERATOR_AKADEMIK" },
                { name: "KTU" },
                { name: "KASUBBAG_KEMAHASISWAAN" },
                { name: "KASUBBAG_AKADEMIK" },
                { name: "DEKAN" },
                { name: "WD1" },
                { name: "KADEP" },
                { name: "KAPRODI" },
                { name: "PIMPINAN_FAKULTAS" },
                { name: "MAHASISWA" },
        ];

        for (const level of aksesLevels) {
                const existingLevel = await prisma.aksesLevel.findUnique({
                        where: {
                                name: level.name,
                        },
                });

                if (!existingLevel) {
                        await prisma.aksesLevel.create({
                                data: {
                                        ulid: ulid(),
                                        name: level.name,
                                },
                        });
                }
        }

        console.log("Akses Level seeded");
}
