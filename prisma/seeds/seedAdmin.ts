import { PrismaClient, Roles } from '@prisma/client';
import bcrypt from 'bcrypt';
import { ulid } from 'ulid';
export async function seedAdmin(prisma: PrismaClient) {
    const countAdmin = await prisma.user.count({
        where: {
            role: "ADMIN"
        }
    })

    const countUser = await prisma.user.count({
        where: {
            role: "USER"
        }
    })

    if (countAdmin === 0) {
        const hashedPassword = await bcrypt.hash("admin123", 12)

        await prisma.user.create({
            data: {
                id: ulid(),
                fullName: "Admin",
                password: hashedPassword,
                email: "admin@test.com",
                role: Roles.ADMIN
            }
        })

        console.log("Admin seeded")
    }

    if (countUser === 0) {
        const hashedPassword = await bcrypt.hash("user123", 12)

        await prisma.user.create({
            data: {
                id: ulid(),
                fullName: "User",
                password: hashedPassword,
                email: "user@test.com",
                role: Roles.USER
            }
        })

        console.log("User seeded")
    }

    console.log("Admin already seeded")
}