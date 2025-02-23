import { PrismaClient } from "@prisma/client";
import { ulid } from "ulid";
import * as bcrypt from "bcrypt";

export async function seedUser(prisma: PrismaClient) {
    const countUser = await prisma.user.count();
    if (countUser === 0) {
        // Get admin data
        const admin = await prisma.admin.findFirst();
        const aksesLevelAdmin = await prisma.aksesLevel.findUnique({
            where: { name: "ADMIN" },
        });

        if (admin && aksesLevelAdmin) {
            // Create admin user
            await prisma.user.create({
                data: {
                    ulid: ulid(),
                    password: await bcrypt.hash("admin123", 10),
                    adminId: admin.id,
                    aksesLevelId: aksesLevelAdmin.id,
                },
            });
        }

        // Create Operator Kemahasiswaan
        const operatorKemahasiswaan = await prisma.operatorKemahasiswaan.create({
            data: {
                ulid: ulid(),
                nama: "Operator Kemahasiswaan",
                email: "op.kemahasiswaan@test.com",
                nip: "197603242005011002",
            },
        });

        const aksesLevelOpKemahasiswaan = await prisma.aksesLevel.findUnique({
            where: { name: "OPERATOR_KEMAHASISWAAN" },
        });

        if (aksesLevelOpKemahasiswaan) {
            await prisma.user.create({
                data: {
                    ulid: ulid(),
                    password: await bcrypt.hash("opkemahasiswaan123", 10),
                    operatorKemahasiswaanId: operatorKemahasiswaan.id,
                    aksesLevelId: aksesLevelOpKemahasiswaan.id,
                },
            });
        }

        // Create Operator Akademik
        const operatorAkademik = await prisma.operatorAkademik.create({
            data: {
                ulid: ulid(),
                nama: "Operator Akademik",
                email: "op.akademik@test.com",
                nip: "198207132010042003",
            },
        });

        const aksesLevelOpAkademik = await prisma.aksesLevel.findUnique({
            where: { name: "OPERATOR_AKADEMIK" },
        });

        if (aksesLevelOpAkademik) {
            await prisma.user.create({
                data: {
                    ulid: ulid(),
                    password: await bcrypt.hash("opakademik123", 10),
                    operatorAkademikId: operatorAkademik.id,
                    aksesLevelId: aksesLevelOpAkademik.id,
                },
            });
        }

        // Create KTU
        const ktu = await prisma.ktu.create({
            data: {
                ulid: ulid(),
                nama: "Kepala Tata Usaha",
                email: "ktu@test.com",
                nip: "197908282007012004",
            },
        });

        const aksesLevelKtu = await prisma.aksesLevel.findUnique({
            where: { name: "KTU" },
        });

        if (aksesLevelKtu) {
            await prisma.user.create({
                data: {
                    ulid: ulid(),
                    password: await bcrypt.hash("ktu123", 10),
                    ktuId: ktu.id,
                    aksesLevelId: aksesLevelKtu.id,
                },
            });
        }

        // Create Kasubbag Akademik
        const kasubbagAkademik = await prisma.kasubbagAkademik.create({
            data: {
                ulid: ulid(),
                nama: "Kasubbag Akademik",
                email: "kasubbag.akademik@test.com",
                nip: "199001152012031005",
            },
        });

        const aksesLevelKasubbagAkademik = await prisma.aksesLevel.findUnique({
            where: { name: "KASUBBAG_AKADEMIK" },
        });

        if (aksesLevelKasubbagAkademik) {
            await prisma.user.create({
                data: {
                    ulid: ulid(),
                    password: await bcrypt.hash("kasubbagakademik123", 10),
                    kasubbagAkademikId: kasubbagAkademik.id,
                    aksesLevelId: aksesLevelKasubbagAkademik.id,
                },
            });
        }

        // Create Kasubbag Kemahasiswaan
        const kasubbagKemahasiswaan = await prisma.kasubbagKemahasiswaan.create({
            data: {
                ulid: ulid(),
                nama: "Kasubbag Kemahasiswaan",
                email: "kasubbag.kemahasiswaan@test.com",
                nip: "198712302015022006",
            },
        });

        const aksesLevelKasubbagKemahasiswaan = await prisma.aksesLevel.findUnique({
            where: { name: "KASUBBAG_KEMAHASISWAAN" },
        });

        if (aksesLevelKasubbagKemahasiswaan) {
            await prisma.user.create({
                data: {
                    ulid: ulid(),
                    password: await bcrypt.hash("kasubbagkemahasiswaan123", 10),
                    kasubbagKemahasiswaanId: kasubbagKemahasiswaan.id,
                    aksesLevelId: aksesLevelKasubbagKemahasiswaan.id,
                },
            });
        }

        // Create Dekan
        const dekan = await prisma.dekan.create({
            data: {
                ulid: ulid(),
                nama: "Dekan",
                email: "dekan@test.com",
                nip: "197505062003041007",
            },
        });

        const aksesLevelDekan = await prisma.aksesLevel.findUnique({
            where: { name: "DEKAN" },
        });

        if (aksesLevelDekan) {
            await prisma.user.create({
                data: {
                    ulid: ulid(),
                    password: await bcrypt.hash("dekan123", 10),
                    dekanId: dekan.id,
                    aksesLevelId: aksesLevelDekan.id,
                },
            });
        }

        // Create WD1
        const wd1 = await prisma.wd1.create({
            data: {
                ulid: ulid(),
                nama: "Wakil Dekan 1",
                email: "wd1@test.com",
                nip: "198309192009012008",
            },
        });

        const aksesLevelWd1 = await prisma.aksesLevel.findUnique({
            where: { name: "WD_1" },
        });

        if (aksesLevelWd1) {
            await prisma.user.create({
                data: {
                    ulid: ulid(),
                    password: await bcrypt.hash("wd1123", 10),
                    wd1Id: wd1.id,
                    aksesLevelId: aksesLevelWd1.id,
                },
            });
        }

        // Create Kepala Departemen
        const kadep = await prisma.kepalaDepertemen.create({
            data: {
                ulid: ulid(),
                nama: "Kepala Departemen",
                email: "kadep@test.com",
                nip: "198802252014031009",
            },
        });

        const aksesLevelKadep = await prisma.aksesLevel.findUnique({
            where: { name: "KEPALA_DEPARTEMEN" },
        });

        if (aksesLevelKadep) {
            await prisma.user.create({
                data: {
                    ulid: ulid(),
                    password: await bcrypt.hash("kadep123", 10),
                    kadepId: kadep.id,
                    aksesLevelId: aksesLevelKadep.id,
                },
            });
        }

        // Create Kepala Prodi
        const kaprodi = await prisma.kepalaProdi.create({
            data: {
                ulid: ulid(),
                nama: "Kepala Program Studi",
                email: "kaprodi@test.com",
                nip: "197704122006042010",
            },
        });

        const aksesLevelKaprodi = await prisma.aksesLevel.findUnique({
            where: { name: "KEPALA_PRODI" },
        });

        if (aksesLevelKaprodi) {
            await prisma.user.create({
                data: {
                    ulid: ulid(),
                    password: await bcrypt.hash("kaprodi123", 10),
                    kaprodiId: kaprodi.id,
                    aksesLevelId: aksesLevelKaprodi.id,
                },
            });
        }

        // Create Pimpinan Fakultas
        const pimpinanFakultas = await prisma.pimpinanFakultas.create({
            data: {
                ulid: ulid(),
                nama: "Pimpinan Fakultas",
                email: "pimpinan.fakultas@test.com",
                nip: "198610082011021011",
            },
        });

        const aksesLevelPimpinanFakultas = await prisma.aksesLevel.findUnique({
            where: { name: "PIMPINAN_FAKULTAS" },
        });

        if (aksesLevelPimpinanFakultas) {
            await prisma.user.create({
                data: {
                    ulid: ulid(),
                    password: await bcrypt.hash("pimpinanfakultas123", 10),
                    pimpinanFakultasId: pimpinanFakultas.id,
                    aksesLevelId: aksesLevelPimpinanFakultas.id,
                },
            });
        }

        // Create Mahasiswa
        const aksesLevelMahasiswa = await prisma.aksesLevel.findUnique({
            where: { name: "MAHASISWA" },
        });

        if (aksesLevelMahasiswa) {
            await prisma.user.create({
                data: {
                    ulid: ulid(),
                    npm: "2108107010057",
                    nama: "Rama Dhaniansyah",
                    password: await bcrypt.hash("user123", 10),
                    aksesLevelId: aksesLevelMahasiswa.id,
                },
            });
        }
    }

    console.log("All Users seeded");
}
