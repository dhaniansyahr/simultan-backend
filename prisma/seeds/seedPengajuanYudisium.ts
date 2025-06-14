import { PrismaClient } from "@prisma/client";
import { ulid } from "ulid";

export async function seedPengajuanYudisium(prisma: PrismaClient) {
        const countPengajuanYudisium = await prisma.pengajuanYudisium.count();

        if (countPengajuanYudisium === 0) {
                const findMhs = await prisma.user.findFirst({
                        where: {
                                aksesLevel: {
                                        name: "MAHASISWA",
                                },
                        },
                });

                if (!findMhs) {
                        console.log("No student user found for Pengajuan Yudisium seeding");
                        return;
                }

                // Create Pengajuan Yudisium entry with initial status
                await prisma.pengajuanYudisium.create({
                        data: {
                                ulid: ulid(),
                                dokumenUrl: "https://example.com/dokumen-yudisium",
                                userId: findMhs.id,
                                status: {
                                        create: {
                                                ulid: ulid(),
                                                nama: "DIPROSES OLEH OPERATOR AKADEMIK",
                                                deskripsi: `Pengajuan Yudisium oleh ${findMhs.nama}`,
                                                userId: findMhs.id,
                                        },
                                },
                        },
                });
        }

        console.log("Pengajuan Yudisium seeded");
}
