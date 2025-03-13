import { PrismaClient } from "@prisma/client";
import { ulid } from "ulid";
import * as bcrypt from "bcrypt";

export async function seedUser(prisma: PrismaClient) {
    const countUser = await prisma.user.count();
    if (countUser === 0) {
        // Create Admin user
        const aksesLevelAdmin = await prisma.aksesLevel.findUnique({
            where: { name: "ADMIN" },
        });

        const existingAdmin = await prisma.admin.findFirst();
        if (!existingAdmin && aksesLevelAdmin) {
            await prisma.user.create({
                data: {
                    ulid: ulid(),
                    npm: "1234567890123456",
                    nama: "Admin",
                    password: await bcrypt.hash("admin123", 10),
                    adminId: aksesLevelAdmin.id,
                    aksesLevelId: aksesLevelAdmin.id,
                },
            });
            console.log("Admin user created");
        }

        // Create Operator Kemahasiswaan user
        const existingOpKemahasiswaan = await prisma.operatorKemahasiswaan.findFirst();
        const aksesLevelOpKemahasiswaan = await prisma.aksesLevel.findUnique({
            where: { name: "OPERATOR_KEMAHASISWAAN" },
        });

        if (!existingOpKemahasiswaan && aksesLevelOpKemahasiswaan) {
            const operator = await prisma.operatorKemahasiswaan.create({
                data: {
                    ulid: ulid(),
                    nama: "Operator Kemahasiswaan",
                    email: "op.kemahasiswaan@test.com",
                    nip: "1976032420050110",
                },
            });

            await prisma.user.create({
                data: {
                    ulid: ulid(),
                    nama: "Operator Kemahasiswaan",
                    password: await bcrypt.hash("opkemahasiswaan123", 10),
                    operatorKemahasiswaanId: operator.id,
                    aksesLevelId: aksesLevelOpKemahasiswaan.id,
                },
            });
            console.log("Operator Kemahasiswaan user created");
        }

        // Create Operator Akademik user
        const existingOpAkademik = await prisma.operatorAkademik.findFirst();
        const aksesLevelOpAkademik = await prisma.aksesLevel.findUnique({
            where: { name: "OPERATOR_AKADEMIK" },
        });

        if (!existingOpAkademik && aksesLevelOpAkademik) {
            const operator = await prisma.operatorAkademik.create({
                data: {
                    ulid: ulid(),
                    nama: "Operator Akademik",
                    email: "op.akademik@test.com",
                    nip: "1982071320100420",
                },
            });

            await prisma.user.create({
                data: {
                    ulid: ulid(),
                    nama: "Operator Akademik",
                    password: await bcrypt.hash("opakademik123", 10),
                    operatorAkademikId: operator.id,
                    aksesLevelId: aksesLevelOpAkademik.id,
                },
            });
            console.log("Operator Akademik user created");
        }

        // Create KTU user
        const existingKtu = await prisma.ktu.findFirst();
        const aksesLevelKtu = await prisma.aksesLevel.findUnique({
            where: { name: "KTU" },
        });

        if (!existingKtu && aksesLevelKtu) {
            const ktu = await prisma.ktu.create({
                data: {
                    ulid: ulid(),
                    nama: "Kepala Tata Usaha",
                    email: "ktu@test.com",
                    nip: "1979082820070120",
                },
            });

            await prisma.user.create({
                data: {
                    ulid: ulid(),
                    nama: "Kepala Tata Usaha",
                    password: await bcrypt.hash("ktu123", 10),
                    ktuId: ktu.id,
                    aksesLevelId: aksesLevelKtu.id,
                },
            });
            console.log("KTU user created");
        }

        // Create Mahasiswa user
        const aksesLevelMahasiswa = await prisma.aksesLevel.findUnique({
            where: { name: "MAHASISWA" },
        });

        const existingMahasiswa = await prisma.user.findFirst({
            where: { aksesLevelId: aksesLevelMahasiswa?.id },
        });

        if (!existingMahasiswa && aksesLevelMahasiswa) {
            await prisma.user.create({
                data: {
                    ulid: ulid(),
                    npm: "2108107010057",
                    nama: "Rama Dhaniansyah",
                    password: await bcrypt.hash("user123", 10),
                    aksesLevelId: aksesLevelMahasiswa.id,
                },
            });
            console.log("Mahasiswa user created");
        }

        // Create Dekan user
        const existingDekan = await prisma.dekan.findFirst();
        const aksesLevelDekan = await prisma.aksesLevel.findUnique({
            where: { name: "DEKAN" },
        });

        if (!existingDekan && aksesLevelDekan) {
            const dekan = await prisma.dekan.create({
                data: {
                    ulid: ulid(),
                    nama: "Dekan",
                    email: "dekan@test.com",
                    nip: "1975050620030417",
                },
            });

            await prisma.user.create({
                data: {
                    ulid: ulid(),
                    nama: "Dekan",
                    password: await bcrypt.hash("dekan123", 10),
                    dekanId: dekan.id,
                    aksesLevelId: aksesLevelDekan.id,
                },
            });
            console.log("Dekan user created");
        }

        // Create WD1 user
        const existingWd1 = await prisma.wd1.findFirst();
        const aksesLevelWd1 = await prisma.aksesLevel.findUnique({
            where: { name: "WD_1" },
        });

        if (!existingWd1 && aksesLevelWd1) {
            const wd1 = await prisma.wd1.create({
                data: {
                    ulid: ulid(),
                    nama: "Wakil Dekan 1",
                    email: "wd1@test.com",
                    nip: "1983091920090128",
                },
            });

            await prisma.user.create({
                data: {
                    ulid: ulid(),
                    nama: "Wakil Dekan 1",
                    password: await bcrypt.hash("wd1123", 10),
                    wd1Id: wd1.id,
                    aksesLevelId: aksesLevelWd1.id,
                },
            });
            console.log("WD1 user created");
        }

        // Create Kepala Departemen user
        const existingKadep = await prisma.kepalaDepertemen.findFirst();
        const aksesLevelKadep = await prisma.aksesLevel.findUnique({
            where: { name: "KEPALA_DEPARTEMEN" },
        });

        if (!existingKadep && aksesLevelKadep) {
            const kadep = await prisma.kepalaDepertemen.create({
                data: {
                    ulid: ulid(),
                    nama: "Kepala Departemen",
                    email: "kadep@test.com",
                    nip: "1988022520140319",
                },
            });

            await prisma.user.create({
                data: {
                    ulid: ulid(),
                    nama: "Kepala Departemen",
                    password: await bcrypt.hash("kadep123", 10),
                    kadepId: kadep.id,
                    aksesLevelId: aksesLevelKadep.id,
                },
            });
            console.log("Kepala Departemen user created");
        }

        // Create Kepala Prodi user
        const existingKaprodi = await prisma.kepalaProdi.findFirst();
        const aksesLevelKaprodi = await prisma.aksesLevel.findUnique({
            where: { name: "KEPALA_PRODI" },
        });

        if (!existingKaprodi && aksesLevelKaprodi) {
            const kaprodi = await prisma.kepalaProdi.create({
                data: {
                    ulid: ulid(),
                    nama: "Kepala Program Studi",
                    email: "kaprodi@test.com",
                    nip: "1977041220060421",
                },
            });

            await prisma.user.create({
                data: {
                    ulid: ulid(),
                    nama: "Kepala Program Studi",
                    password: await bcrypt.hash("kaprodi123", 10),
                    kaprodiId: kaprodi.id,
                    aksesLevelId: aksesLevelKaprodi.id,
                },
            });
            console.log("Kepala Prodi user created");
        }

        // Create Pimpinan Fakultas user
        const existingPimpinan = await prisma.pimpinanFakultas.findFirst();
        const aksesLevelPimpinanFakultas = await prisma.aksesLevel.findUnique({
            where: { name: "PIMPINAN_FAKULTAS" },
        });

        if (!existingPimpinan && aksesLevelPimpinanFakultas) {
            const pimpinan = await prisma.pimpinanFakultas.create({
                data: {
                    ulid: ulid(),
                    nama: "Pimpinan Fakultas",
                    email: "pimpinan.fakultas@test.com",
                    nip: "1986100820110211",
                },
            });

            await prisma.user.create({
                data: {
                    ulid: ulid(),
                    nama: "Pimpinan Fakultas",
                    password: await bcrypt.hash("pimpinanfakultas123", 10),
                    pimpinanFakultasId: pimpinan.id,
                    aksesLevelId: aksesLevelPimpinanFakultas.id,
                },
            });
            console.log("Pimpinan Fakultas user created");
        }
    }

    console.log("User seeding completed!");
}
