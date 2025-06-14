import { PrismaClient } from "@prisma/client";
import { ulid } from "ulid";

export async function seedLegalisirIjazah(prisma: PrismaClient) {
        const countLegalisirIjazah = await prisma.legalisirIjazah.count();

        if (countLegalisirIjazah === 0) {
                const findMhs = await prisma.user.findFirst({
                        where: {
                                aksesLevel: {
                                        name: "MAHASISWA",
                                },
                        },
                });

                if (!findMhs) {
                        console.log("No student user found for Legalisir Ijazah seeding");
                        return;
                }

                // Create Legalisir Ijazah entry with initial status
                await prisma.legalisirIjazah.create({
                        data: {
                                ulid: ulid(),
                                dokumenUrl: "https://example.com/dokumen-ijazah",
                                userId: findMhs.id,
                                status: {
                                        create: {
                                                ulid: ulid(),
                                                nama: "DIPROSES OLEH OPERATOR AKADEMIK",
                                                deskripsi: `Pengajuan Legalisir Ijazah oleh ${findMhs.nama}`,
                                                userId: findMhs.id,
                                        },
                                },
                        },
                });
        }

        console.log("Legalisir Ijazah seeded");
}
