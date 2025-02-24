import { PrismaClient, VerifikasiStatusBagianKemahasiswaan } from "@prisma/client";
import { ulid } from "ulid";

export async function seedCutiSementara(prisma: PrismaClient) {
        const countCutiSementara = await prisma.cutiSementara.count();

        if (countCutiSementara === 0) {
                const findMhs = await prisma.user.findFirst({
                        where: {
                                aksesLevel: {
                                        name: "MAHASISWA",
                                },
                        },
                });

                if (!findMhs) {
                        console.log("No student user found for Cuti Sementara seeding");
                        return;
                }

                // Create Cuti Sementara entry with initial status
                await prisma.cutiSementara.create({
                        data: {
                                ulid: ulid(),
                                suratIzinOrangTuaUrl: "https://example.com/surat-izin",
                                suratBssUrl: "https://example.com/surat-bss",
                                suratBebasPustakaUrl: "https://example.com/surat-bebas-pustaka",
                                alasanPengajuan: "Alasan pengajuan cuti sementara",
                                verifikasiStatus: VerifikasiStatusBagianKemahasiswaan.DIPROSES_OPERATOR_KEMAHASISWAAN,
                                userId: findMhs.id,
                                status: {
                                        create: {
                                                ulid: ulid(),
                                                nama: VerifikasiStatusBagianKemahasiswaan.DIPROSES_OPERATOR_KEMAHASISWAAN,
                                                deskripsi: `Pengajuan Cuti oleh ${findMhs.nama}`,
                                                userId: findMhs.id,
                                        },
                                },
                        },
                });
        }

        console.log("Cuti Sementara seeded");
}
