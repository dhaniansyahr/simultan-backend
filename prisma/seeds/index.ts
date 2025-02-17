import "../../src/paths";
import { seedAdmin } from "./seedAdmin";
import { prisma } from "../../src/utils/prisma.utils";
import { seedUserLevel } from "./seedUserLevel";
import { seedAcl } from "./seedAcl";
import { seedSuratKeteranganKuliah } from "./seedSuratKeteranganKuliah";
import { seedCutiSementara } from "./seedCutiSementara";

async function seed() {
    await seedUserLevel(prisma);
    await seedAdmin(prisma);
    await seedAcl(prisma);
    await seedSuratKeteranganKuliah(prisma);
    await seedCutiSementara(prisma);
}

seed().then(() => {
    console.log("ALL SEEDING DONE");
});
