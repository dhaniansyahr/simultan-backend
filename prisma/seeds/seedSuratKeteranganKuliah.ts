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

                // Create Surat Keterangan Kuliah entry with initial status
                await prisma.suratKeteranganKuliah.create({
                        data: {
                                ulid: ulid(),
                                tipeSurat: TipeSuratKeteranganKuliah.KP4,
                                deskripsi: "Untuk Keperluan BPJS Kesehatan",
                                dokumenUrl: "https://example.com/dokumen",
                                verifikasiStatus: VerifikasiStatusBagianKemahasiswaan.DIPROSES_OPERATOR_KEMAHASISWAAN,
                                userId: findMhs.id,
                                status: {
                                        create: {
                                                ulid: ulid(),
                                                nama: VerifikasiStatusBagianKemahasiswaan.DIPROSES_OPERATOR_KEMAHASISWAAN,
                                                deskripsi: `Pengajuan Surat oleh ${findMhs.nama}`,
                                                userId: findMhs.id,
                                        },
                                },
                        },
                });
        }

        console.log("Surat Keterangan Kuliah seeded");
}
