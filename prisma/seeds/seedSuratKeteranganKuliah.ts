import { PrismaClient, TipeSuratKeteranganKuliah, VerifikasiStatusBagianKemahasiswaan } from "@prisma/client";
import { ulid } from "ulid";

export async function seedSuratKeteranganKuliah(prisma: PrismaClient) {
        const countSuratKeteranganKuliah = await prisma.suratKeteranganKuliah.count();

        if (countSuratKeteranganKuliah === 0) {
                const findMhs = await prisma.user.findFirst({
                        where: {
                                aksesLevel: {
                                        name: "MAHASISWA",
                                },
                        },
                });

                if (!findMhs) {
                        console.log("No student user found for Surat Keterangan Kuliah seeding");
                        return;
                }

                // Create initial status
                const initialStatus = await prisma.status.create({
                        data: {
                                ulid: ulid(),
                                nama: VerifikasiStatusBagianKemahasiswaan.DIPROSES_OPERATOR_KEMAHASISWAAN,
                                deskripsi: `Pengajuan Surat oleh ${findMhs.nama}`,
                                userId: findMhs.id,
                        },
                });

                // Create Surat Keterangan Kuliah entry
                await prisma.suratKeteranganKuliah.create({
                        data: {
                                ulid: ulid(),
                                tipeSurat: TipeSuratKeteranganKuliah.KP4,
                                deskripsi: "Untuk Keperluan BPJS Kesehatan",
                                dokumenUrl: "https://example.com/dokumen",
                                verifikasiStatus: VerifikasiStatusBagianKemahasiswaan.DIPROSES_OPERATOR_KEMAHASISWAAN,
                                statusId: initialStatus.id,
                                userId: findMhs.id,
                        },
                });
        }

        console.log("Surat Keterangan Kuliah seeded");
}
