import "../../src/paths";
import { prisma } from "../../src/utils/prisma.utils";
import { seedAcl } from "./seedAcl";
import { seedSuratKeteranganKuliah } from "./seedSuratKeteranganKuliah";
import { seedCutiSementara } from "./seedCutiSementara";
import { seedAksesLevel } from "./seedAksesLevel";
import { seedUser } from "./seedUser";
import { seedMenu } from "./seedMenu";
import { seedPengajuanYudisium } from "./seedPengajuanYudisium";
import { seedLegalisirIjazah } from "./seedLegalisirIjazah";

async function seed() {
        await seedAksesLevel(prisma);
        await seedUser(prisma);
        await seedAcl(prisma);
        await seedMenu(prisma);
        await seedSuratKeteranganKuliah(prisma);
        await seedCutiSementara(prisma);
        await seedPengajuanYudisium(prisma);
        await seedLegalisirIjazah(prisma);
}

seed().then(() => {
        console.log("ALL SEEDING DONE");
});
