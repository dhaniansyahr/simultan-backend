import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import { exclude, UserRegisterDTO, UserLoginDTO, UserJWTDAO } from "$entities/User";
import { BadRequestWithMessage, INTERNAL_SERVER_ERROR_SERVICE_RESPONSE, ServiceResponse } from "$entities/Service";
import { prisma } from "$utils/prisma.utils";
import Logger from "$pkg/logger";
import bcrypt from "bcrypt";
import { ulid } from "ulid";
import { isValidEmail, isValidNIP, isValidNPM } from "$utils/helper.utils";
import axios from "axios";

function createToken(user: User, expired: number) {
        const jwtPayload = exclude(user, "password") as UserJWTDAO;
        const token = jwt.sign(jwtPayload, process.env.JWT_SECRET ?? "", { expiresIn: expired });
        return token;
}

// Helper function to determine identity type
function getIdentityType(identity: string): "NPM" | "NIP" | "EMAIL" | "UNKNOWN" {
        if (isValidNPM(identity)) return "NPM";
        if (isValidNIP(identity)) return "NIP";
        if (isValidEmail(identity)) return "EMAIL";
        return "UNKNOWN";
}

// Common function to process login result
async function processLoginResult(user: any, password: string): Promise<ServiceResponse<any>> {
        if (!user) return BadRequestWithMessage("User not found!");

        // Map nama based on role relation
        const userRole =
                user.admin ??
                user.operatorKemahasiswaan ??
                user.operatorAkademik ??
                user.ktu ??
                user.kasubbagKemahasiswaan ??
                user.kasubbagAkademik ??
                user.dekan ??
                user.wd1 ??
                user.kadep ??
                user.kaprodi ??
                user.pimpinanFakultas;

        const userData = {
                ...user,
                nama: userRole?.nama ?? user.nama,
        };

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

        const token = createToken(userData, 3600);
        const refreshToken = createToken(userData, 3600 * 24);
        return {
                status: true,
                data: {
                        user: exclude(userData, "password"),
                        token,
                        refreshToken,
                },
        };
}

// Login by NPM (for students)
export async function loginByNPM(npm: string, password: string): Promise<ServiceResponse<any>> {
        const user = await prisma.user.findFirst({
                where: { npm },
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

        return processLoginResult(user, password);
}

// Login by NIP (for staff/faculty)
export async function loginByNIP(nip: string, password: string): Promise<ServiceResponse<any>> {
        const user = await prisma.user.findFirst({
                where: {
                        OR: [
                                { admin: { nip } },
                                { operatorKemahasiswaan: { nip } },
                                { operatorAkademik: { nip } },
                                { ktu: { nip } },
                                { kasubbagKemahasiswaan: { nip } },
                                { kasubbagAkademik: { nip } },
                                { dekan: { nip } },
                                { wd1: { nip } },
                                { kadep: { nip } },
                                { kaprodi: { nip } },
                                { pimpinanFakultas: { nip } },
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

        return processLoginResult(user, password);
}

// Login by Email
export async function loginByEmail(email: string, password: string): Promise<ServiceResponse<any>> {
        const user = await prisma.user.findFirst({
                where: {
                        OR: [
                                { admin: { email } },
                                { operatorKemahasiswaan: { email } },
                                { operatorAkademik: { email } },
                                { ktu: { email } },
                                { kasubbagKemahasiswaan: { email } },
                                { kasubbagAkademik: { email } },
                                { dekan: { email } },
                                { wd1: { email } },
                                { kadep: { email } },
                                { kaprodi: { email } },
                                { pimpinanFakultas: { email } },
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

        return processLoginResult(user, password);
}

// Main login function that routes to appropriate login method
export async function logIn(data: UserLoginDTO): Promise<ServiceResponse<any>> {
        try {
                const { identity, password } = data;

                const identityType = getIdentityType(identity);
                const authMethod = process.env.AUTH_METHOD;

                console.log("Method Login : ", authMethod);

                switch (identityType) {
                        case "NPM":
                                if (authMethod === "MANUAL") {
                                        return await loginByNPM(identity, password);
                                } else {
                                        const res = await axios.post(`${process.env.AUTH_API_URL}/nim/${identity}/key/${password}/format/json`);

                                        if (res.status === 200) {
                                                const data = res.data;
                                                return {
                                                        status: true,
                                                        data: data,
                                                };
                                        } else {
                                                return BadRequestWithMessage("Invalid identity format or user not found!");
                                        }
                                }

                        case "NIP":
                                if (authMethod === "MANUAL") {
                                        return await loginByNIP(identity, password);
                                } else {
                                        const res = await axios.post(`${process.env.AUTH_API_URL}/nip/${identity}/key/${password}/format/json`);

                                        console.log("Response from web service : ", res);

                                        if (res.status === 200) {
                                                const data = res.data;
                                                return {
                                                        status: true,
                                                        data: data,
                                                };
                                        } else {
                                                return BadRequestWithMessage("Invalid identity format or user not found!");
                                        }
                                }

                        case "EMAIL":
                                return await loginByEmail(identity, password);
                        case "UNKNOWN":
                        default:
                                // Fallback: try all methods
                                const npmResult = await loginByNPM(identity, password);
                                if (npmResult.status) return npmResult;

                                const nipResult = await loginByNIP(identity, password);
                                if (nipResult.status) return nipResult;

                                const emailResult = await loginByEmail(identity, password);
                                if (emailResult.status) return emailResult;

                                return BadRequestWithMessage("Invalid identity format or user not found!");
                }
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

                const token = createToken(newUser, 3600);

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

export async function changePassword(userId: number, oldPassword: string, newPassword: string): Promise<ServiceResponse<any>> {
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
