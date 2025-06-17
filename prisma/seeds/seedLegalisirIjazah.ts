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
                                totalLegalisir: 2,
                                namaBank: "BANK BRI",
                                nomorRekening: "1234567890",
                                namaRekening: "John Doe",
                                buktiPembayaran: `https://example.com/bukti_pembayaran_2105107010057_${new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14)}.pdf`,
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
