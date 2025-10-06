import { PrismaClient } from "@prisma/client";
import { ulid } from "ulid";
import * as bcrypt from "bcrypt";

// Define user data structure
interface UserSeedData {
        role: string;
        nama: string;
        email: string;
        semester?: number;
        nip?: string;
        npm?: string;
        password: string;
        aksesLevel: string;
}

// User data array
const USERS_DATA: UserSeedData[] = [
        // Admin
        {
                role: "admin",
                nama: "Admin",
                email: "admin@usk.ac.id",
                nip: "1976032420050110",
                password: "admin123",
                aksesLevel: "ADMIN",
        },

        // Operators
        {
                role: "operatorKemahasiswaan",
                nama: "Operator Kemahasiswaan",
                email: "op.kemahasiswaan@usk.ac.id",
                nip: "1976032420050111",
                password: "operator123",
                aksesLevel: "OPERATOR_KEMAHASISWAAN",
        },
        {
                role: "operatorAkademik",
                nama: "Operator Akademik",
                email: "op.akademik@usk.ac.id",
                nip: "1982071320100420",
                password: "operator123",
                aksesLevel: "OPERATOR_AKADEMIK",
        },

        // Management
        {
                role: "ktu",
                nama: "Kepala Tata Usaha",
                email: "ktu@usk.ac.id",
                nip: "1979082820070120",
                password: "operator123",
                aksesLevel: "KTU",
        },
        {
                role: "kasubbagAkademik",
                nama: "Kasubbag Akademik",
                email: "kasubbag.akademik@usk.ac.id",
                nip: "1990011520120315",
                password: "operator123",
                aksesLevel: "KASUBBAG_AKADEMIK",
        },
        {
                role: "kasubbagKemahasiswaan",
                nama: "Kasubbag Kemahasiswaan",
                email: "kasubbag.kemahasiswaan@usk.ac.id",
                nip: "1987123020150226",
                password: "operator123",
                aksesLevel: "KASUBBAG_KEMAHASISWAAN",
        },

        // Leadership
        {
                role: "dekan",
                nama: "Dekan",
                email: "dekan@usk.ac.id",
                nip: "1975050620030417",
                password: "operator123",
                aksesLevel: "DEKAN",
        },
        {
                role: "wd1",
                nama: "Wakil Dekan 1",
                email: "wd1@usk.ac.id",
                nip: "1983091920090128",
                password: "operator123",
                aksesLevel: "WD_1",
        },
        {
                role: "kadep",
                nama: "Kepala Departemen",
                email: "kadep@usk.ac.id",
                nip: "1988022520140319",
                password: "operator123",
                aksesLevel: "KEPALA_DEPARTEMEN",
        },
        {
                role: "kaprodi",
                nama: "Kepala Program Studi",
                email: "kaprodi@usk.ac.id",
                nip: "1977041220060421",
                password: "operator123",
                aksesLevel: "KEPALA_PRODI",
        },
        {
                role: "pimpinanFakultas",
                nama: "Pimpinan Fakultas",
                email: "pimpinan.fakultas@usk.ac.id",
                nip: "1986100820110211",
                password: "operator123",
                aksesLevel: "PIMPINAN_FAKULTAS",
        },

        // Student
        {
                role: "mahasiswa",
                semester: 4,
                nama: "Rama Dhaniansyah",
                email: "rama@mhs.usk.ac.id",
                npm: "2105107010057",
                password: "user123",
                aksesLevel: "MAHASISWA",
        },
];

// Helper function to create role entity
async function createRoleEntity(prisma: PrismaClient, userData: UserSeedData) {
        const { role, nama, email, nip } = userData;

        // All role entities require nip, only mahasiswa doesn't have it
        if (!nip) {
                throw new Error(`NIP is required for role: ${role}`);
        }

        const entityData = {
                ulid: ulid(),
                nama,
                email,
                nip,
        };

        switch (role) {
                case "admin":
                        return await prisma.admin.create({ data: entityData });
                case "operatorKemahasiswaan":
                        return await prisma.operatorKemahasiswaan.create({ data: entityData });
                case "operatorAkademik":
                        return await prisma.operatorAkademik.create({ data: entityData });
                case "ktu":
                        return await prisma.ktu.create({ data: entityData });
                case "kasubbagAkademik":
                        return await prisma.kasubbagAkademik.create({ data: entityData });
                case "kasubbagKemahasiswaan":
                        return await prisma.kasubbagKemahasiswaan.create({ data: entityData });
                case "dekan":
                        return await prisma.dekan.create({ data: entityData });
                case "wd1":
                        return await prisma.wd1.create({ data: entityData });
                case "kadep":
                        return await prisma.kepalaDepertemen.create({ data: entityData });
                case "kaprodi":
                        return await prisma.kepalaProdi.create({ data: entityData });
                case "pimpinanFakultas":
                        return await prisma.pimpinanFakultas.create({ data: entityData });
                default:
                        return null;
        }
}

// Helper function to create user
async function createUser(prisma: PrismaClient, userData: UserSeedData, roleEntity: any) {
        const aksesLevel = await prisma.aksesLevel.findUnique({
                where: { name: userData.aksesLevel },
        });

        if (!aksesLevel) {
                console.warn(`Access level ${userData.aksesLevel} not found`);
                return;
        }

        const userCreateData: any = {
                ulid: ulid(),
                nama: userData.nama,
                password: await bcrypt.hash(userData.password, 10),
                aksesLevelId: aksesLevel.id,
        };

        // Add role-specific fields
        if (userData.role === "mahasiswa") {
                userCreateData.npm = userData.npm;
        } else if (roleEntity) {
                userCreateData[`${userData.role}Id`] = roleEntity.id;
                userCreateData.npm = userData.nip; // Use NIP as NPM for staff
        }

        return await prisma.user.create({ data: userCreateData });
}

export async function seedUser(prisma: PrismaClient) {
        const countUser = await prisma.user.count();
        if (countUser > 0) {
                console.log("Users already exist, skipping seed");
                return;
        }

        console.log("Seeding users...");

        for (const userData of USERS_DATA) {
                try {
                        // Create role entity (if not mahasiswa)
                        const roleEntity = userData.role !== "mahasiswa" ? await createRoleEntity(prisma, userData) : null;

                        // Create user
                        await createUser(prisma, userData, roleEntity);

                        console.log(`✓ Created ${userData.role}: ${userData.nama}`);
                } catch (error) {
                        console.error(`✗ Failed to create ${userData.role}: ${userData.nama}`, error);
                }
        }

        console.log("All Users seeded successfully!");
}
