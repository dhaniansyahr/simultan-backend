import { PrismaClient } from "@prisma/client";
import { ulid } from "ulid";

export async function seedSuratKeteranganLulus(prisma: PrismaClient) {
  const countSuratKeteranganLulus = await prisma.suratKeteranganLulus.count();

  if (countSuratKeteranganLulus === 0) {
    const findMhs = await prisma.user.findFirst({
      where: {
        aksesLevel: {
          name: "MAHASISWA",
        },
      },
    });

    if (!findMhs) {
      console.log("No student user found for Surat Keterangan Lulus seeding");
      return;
    }

    // Create Surat Keterangan Lulus entry with initial status
    await prisma.suratKeteranganLulus.create({
      data: {
        ulid: ulid(),
        tipeSurat: "UNTUK_BEKERJA",
        deskripsi:
          "Surat keterangan lulus untuk keperluan melamar pekerjaan di PT. ABC",
        dokumenTranskrip: `https://example.com/transkrip_${new Date()
          .toISOString()
          .replace(/[-:T]/g, "")
          .slice(0, 14)}.pdf`,
        userId: findMhs.id,
        status: {
          create: {
            ulid: ulid(),
            nama: "DIPROSES OLEH OPERATOR KEMAHASISWAAN",
            deskripsi: `Pengajuan Surat Keterangan Lulus oleh ${findMhs.nama}`,
            userId: findMhs.id,
          },
        },
      },
    });
  }

  console.log("Surat Keterangan Lulus seeded");
}
