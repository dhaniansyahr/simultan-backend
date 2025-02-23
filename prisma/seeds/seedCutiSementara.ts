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

                // Create initial status
                const initialStatus = await prisma.status.create({
                        data: {
                                ulid: ulid(),
                                nama: VerifikasiStatusBagianKemahasiswaan.DIPROSES_OPERATOR_KEMAHASISWAAN,
                                deskripsi: `Pengajuan Cuti oleh ${findMhs.nama}`,
                                userId: findMhs.id,
                        },
                });

                // Create Cuti Sementara entry
                await prisma.cutiSementara.create({
                        data: {
                                ulid: ulid(),
                                suratIzinOrangTuaUrl: "https://example.com/surat-izin",
                                suratBssUrl: "https://example.com/surat-bss",
                                suratBebasPustakaUrl: "https://example.com/surat-bebas-pustaka",
                                alasanPengajuan: "Alasan pengajuan cuti sementara",
                                verifikasiStatus: VerifikasiStatusBagianKemahasiswaan.DIPROSES_OPERATOR_KEMAHASISWAAN,
                                statusId: initialStatus.id,
                                userId: findMhs.id,
                        },
                });
        }

        console.log("Cuti Sementara seeded");
}
