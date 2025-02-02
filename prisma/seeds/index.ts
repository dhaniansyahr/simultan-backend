import "../../src/paths";
import { seedAdmin } from "./seedAdmin";
import { prisma } from "../../src/utils/prisma.utils";
import { seedUserLevel } from "./seedUserLevel";
import { seedAcl } from "./seedAcl";

async function seed() {
    await seedUserLevel(prisma);
    await seedAdmin(prisma);
    await seedAcl(prisma);
}

seed().then(() => {
    console.log("ALL SEEDING DONE");
});
