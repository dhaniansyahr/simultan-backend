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
                                suratPendaftaran: `https://example.com/surat_pendaftaran_2105107010057_${new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14)}.pdf`,
                                suratDistribusiSkripsi: `https://example.com/surat_distribusi_skripsi_2105107010057_${new Date()
                                        .toISOString()
                                        .replace(/[-:T]/g, "")
                                        .slice(0, 14)}.pdf`,
                                suratBebasPerpustakaan: `https://example.com/surat_bebas_perpustakaan_2105107010057_${new Date()
                                        .toISOString()
                                        .replace(/[-:T]/g, "")
                                        .slice(0, 14)}.pdf`,
                                suratBebasLab: `https://example.com/surat_bebas_lab_2105107010057_${new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14)}.pdf`,
                                suratPendaftaranIka: `https://example.com/surat_pendaftaran_ika_2105107010057_${new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14)}.pdf`,
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
