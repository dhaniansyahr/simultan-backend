import { PrismaClient } from "@prisma/client";
import { ulid } from "ulid";

export async function seedCutiSementara(prisma: PrismaClient) {
    const countCutiSementara = await prisma.cutiSementara.count();

    if (countCutiSementara === 0) {
        const findMhs = await prisma.user.findFirst({
            where: {
                UserLevel: {
                    name: "MAHASISWA",
                },
            },
        });

        await prisma.cutiSementara.create({
            data: {
                id: ulid(),
                suratPersetujuanOrangTuaUrl: "https://google.com",
                bebasPustakaUrl: "https://google.com",
                bssFormUrl: "https://google.com",
                reason: "Pengen Cuti",
                offerById: findMhs!.id,
            },
        });
    }

    console.log("Cuti Sementara seeded");
}
