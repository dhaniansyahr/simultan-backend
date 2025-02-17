import { PrismaClient, TypeForSuratKeteranganKuliah } from "@prisma/client";
import { ulid } from "ulid";

export async function seedSuratKeteranganKuliah(prisma: PrismaClient) {
    const countSuratKeteranganKuliah = await prisma.suratKeteranganKuliah.count();

    if (countSuratKeteranganKuliah === 0) {
        const findMhs = await prisma.user.findFirst({
            where: {
                UserLevel: {
                    name: "MAHASISWA",
                },
            },
        });

        await prisma.suratKeteranganKuliah.create({
            data: {
                id: ulid(),
                type: TypeForSuratKeteranganKuliah.KP4,
                fileUrl: "http://google.com",
                description: "Untuk Keperluan BPJS Kesehatan",
                offerById: findMhs!.id,
            },
        });
    }

    console.log("Surat Keterangan Kuliah seeded");
}
