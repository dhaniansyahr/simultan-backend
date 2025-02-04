import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { ulid } from "ulid";
export async function seedAdmin(prisma: PrismaClient) {
    const roles = [
        "ADMIN",
        "MAHASISWA",
        "DOSEN",
        "KTU",
        "KASUBBAG_AKADEMIK",
        "KASUBBAG_KEMAHASISWAAN",
        "BAG_KEMAHASISWAAN",
        "OPERATOR_AKADEMIK",
        "OPERATOR_KEMAHASISWAAN",
        "DEKAN",
        "WD_1",
        "KETUA_DEPARTEMEN",
        "PIMPINAN_FAKULTAS",
    ];

    for (const role of roles) {
        const countRole = await prisma.user.count({
            where: {
                UserLevel: {
                    name: role,
                },
            },
        });

        if (countRole === 0) {
            const hashedPassword = await bcrypt.hash(`${role.toLowerCase()}123`, 12);
            const userLevel = await prisma.userLevel.findUnique({
                where: {
                    name: role,
                },
            });

            let user;
            if (role === "MAHASISWA") {
                user = await prisma.user.create({
                    data: {
                        id: ulid(),
                        fullName: role,
                        password: hashedPassword,
                        email: `${role.toLowerCase()}@test.com`,
                        userLevelId: userLevel!.id,
                    },
                });
                await prisma.mahasiswa.create({
                    data: {
                        id: ulid(),
                        name: role,
                        npm: "2108107010057",
                        birthday: "1990-01-01",
                        semester: "1",
                        isActive: true,
                        userId: user.id,
                    },
                });
            } else if (role === "DOSEN") {
                user = await prisma.user.create({
                    data: {
                        id: ulid(),
                        fullName: role,
                        password: hashedPassword,
                        email: `${role.toLowerCase()}@test.com`,
                        userLevelId: userLevel!.id,
                    },
                });
                await prisma.dosen.create({
                    data: {
                        id: ulid(),
                        name: role,
                        nip: "198003262014041001",
                        userId: user.id,
                    },
                });
            } else if (role === "DEKAN") {
                user = await prisma.user.create({
                    data: {
                        id: ulid(),
                        fullName: role,
                        password: hashedPassword,
                        email: `${role.toLowerCase()}@test.com`,
                        userLevelId: userLevel!.id,
                    },
                });
                await prisma.dekan.create({
                    data: {
                        id: ulid(),
                        name: role,
                        nip: "198003262014041004",
                        userId: user.id,
                    },
                });
            } else {
                await prisma.user.create({
                    data: {
                        id: ulid(),
                        fullName: role,
                        password: hashedPassword,
                        email: `${role.toLowerCase()}@test.com`,
                        userLevelId: userLevel!.id,
                    },
                });
            }

            console.log(`${role} seeded`);
        }
    }

    console.log("All roles seeded");
}
