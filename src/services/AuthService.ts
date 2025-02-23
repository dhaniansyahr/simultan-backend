import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import { exclude, UserRegisterDTO, UserLoginDTO, UserJWTDAO } from "$entities/User";
import { BadRequestWithMessage, INTERNAL_SERVER_ERROR_SERVICE_RESPONSE, ServiceResponse } from "$entities/Service";
import { prisma } from "$utils/prisma.utils";
import Logger from "$pkg/logger";
import bcrypt from "bcrypt";
import { ulid } from "ulid";

function createToken(user: User) {
    const jwtPayload = exclude(user, "password") as UserJWTDAO;
    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET ?? "", { expiresIn: 3600 });
    return token;
}

export async function logIn(data: UserLoginDTO): Promise<ServiceResponse<any>> {
    try {
        const { identityNumber, password } = data;

        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { npm: identityNumber },
                    {
                        admin: {
                            nip: identityNumber,
                        },
                    },
                    {
                        operatorKemahasiswaan: {
                            nip: identityNumber,
                        },
                    },
                    {
                        operatorAkademik: {
                            nip: identityNumber,
                        },
                    },
                    {
                        ktu: {
                            nip: identityNumber,
                        },
                    },
                    {
                        kasubbagKemahasiswaan: {
                            nip: identityNumber,
                        },
                    },
                    {
                        kasubbagAkademik: {
                            nip: identityNumber,
                        },
                    },
                    {
                        dekan: {
                            nip: identityNumber,
                        },
                    },
                    {
                        wd1: {
                            nip: identityNumber,
                        },
                    },
                    {
                        kadep: {
                            nip: identityNumber,
                        },
                    },
                    {
                        kaprodi: {
                            nip: identityNumber,
                        },
                    },
                    {
                        pimpinanFakultas: {
                            nip: identityNumber,
                        },
                    },
                ],
            },
            include: {
                admin: true,
                operatorKemahasiswaan: true,
                operatorAkademik: true,
                ktu: true,
                kasubbagKemahasiswaan: true,
                kasubbagAkademik: true,
                dekan: true,
                wd1: true,
                kadep: true,
                kaprodi: true,
                pimpinanFakultas: true,
                aksesLevel: true,
            },
        });

        if (!user) return BadRequestWithMessage("User not found!");

        const isPasswordVerified = await bcrypt.compare(password, user.password);

        if (!isPasswordVerified) {
            return {
                status: false,
                err: {
                    message: "Invalid password!",
                    code: 404,
                },
                data: {},
            };
        }

        const token = createToken(user);
        return {
            status: true,
            data: {
                user: exclude(user, "password"),
                token,
            },
        };
    } catch (err) {
        Logger.error(`AuthService.login : ${err}`);
        return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
}

export async function register(data: UserRegisterDTO): Promise<ServiceResponse<any>> {
    try {
        const newUser = await prisma.user.create({
            data: {
                ulid: ulid(),
                nama: data.nama,
                npm: data?.npm,
                password: await bcrypt.hash(data.password, 12),
            },
        });

        const token = createToken(newUser);

        return {
            status: true,
            data: {
                user: exclude(newUser, "password"),
                token,
            },
        };
    } catch (err) {
        Logger.error(`AuthService.register : ${err}`);
        return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
}

export function verifyToken(token: string): ServiceResponse<any> {
    try {
        try {
            const JWT_SECRET = process.env.JWT_SECRET || "";
            jwt.verify(token, JWT_SECRET);
            return {
                status: true,
                data: {},
            };
        } catch (err) {
            return {
                status: false,
                err: {
                    code: 403,
                    message: "Invalid Token",
                },
                data: {},
            };
        }
    } catch (err) {
        Logger.error(`AuthService.verifyToken : ${err}`);
        return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
}

export async function changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string
): Promise<ServiceResponse<any>> {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            return BadRequestWithMessage("Invalid User ID!");
        }

        const match = await bcrypt.compare(oldPassword, user.password);

        if (!match) {
            return BadRequestWithMessage("Incorrect Old Password!");
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 12);

        await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                password: hashedNewPassword,
            },
        });

        return {
            status: true,
            data: {},
        };
    } catch (err) {
        Logger.error(`AuthService.changePassword : ${err}`);
        return {
            status: false,
            err: { message: (err as Error).message, code: 500 },
            data: {},
        };
    }
}
