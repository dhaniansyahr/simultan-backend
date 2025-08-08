import { PrismaClient } from "@prisma/client";
import { ulid } from "ulid";

export async function seedRekomendasiMahasiswa(prisma: PrismaClient) {
  const countRekomendasiMahasiswa = await prisma.rekomendasiMahasiswa.count();

  if (countRekomendasiMahasiswa === 0) {
    const findMhs = await prisma.user.findFirst({
      where: {
        aksesLevel: {
          name: "MAHASISWA",
        },
      },
    });

    if (!findMhs) {
      console.log("No student user found for Rekomendasi Mahasiswa seeding");
      return;
    }

    // Create Rekomendasi Mahasiswa entry with initial status
    await prisma.rekomendasiMahasiswa.create({
      data: {
        ulid: ulid(),
        tipeRekomendasi: "UNTUK_BEASISWA",
        deskripsi:
          "Rekomendasi untuk mengajukan beasiswa S2 di Universitas ABC",
        institusiTujuan: "Universitas ABC",
        dokumenPendukung: `https://example.com/dokumen_pendukung_${new Date()
          .toISOString()
          .replace(/[-:T]/g, "")
          .slice(0, 14)}.pdf`,
        userId: findMhs.id,
        status: {
          create: {
            ulid: ulid(),
            nama: "DIPROSES OLEH OPERATOR AKADEMIK",
            deskripsi: `Pengajuan Rekomendasi Mahasiswa oleh ${findMhs.nama}`,
            userId: findMhs.id,
          },
        },
      },
    });
  }

  console.log("Rekomendasi Mahasiswa seeded");
}
