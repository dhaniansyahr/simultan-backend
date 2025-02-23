import { PrismaClient, VerifikasiStatusBagianAkademik } from "@prisma/client";
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

                // Create initial status
                const initialStatus = await prisma.status.create({
                        data: {
                                ulid: ulid(),
                                nama: VerifikasiStatusBagianAkademik.DIPROSES_OPERATOR_AKADEMIK,
                                deskripsi: `Pengajuan Legalisir Ijazah oleh ${findMhs.nama}`,
                                userId: findMhs.id,
                        },
                });

                // Create Legalisir Ijazah entry
                await prisma.legalisirIjazah.create({
                        data: {
                                ulid: ulid(),
                                dokumenUrl: "https://example.com/dokumen-ijazah",
                                verifikasiStatus: VerifikasiStatusBagianAkademik.DIPROSES_OPERATOR_AKADEMIK,
                                statusId: initialStatus.id,
                                userId: findMhs.id,
                        },
                });
        }

        console.log("Legalisir Ijazah seeded");
}
