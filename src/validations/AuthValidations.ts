import { UserLoginDTO, UserRegisterDTO } from "$entities/User";
import { Context, Next } from "hono";
import { response_bad_request } from "../utils/response.utils";
import { prisma } from "../utils/prisma.utils";
import { generateErrorStructure } from "./helper";
import { checkIdentityNumber } from "$utils/strings.utils";
import { checkDigitNPMFakultasPertanian, isValidEmail, isValidNIP, isValidNPM } from "$utils/helper.utils";

// Helper function to check identity type (NPM, NIP, or EMAIL)
function checkIdentityType(identity: string): "NPM" | "NIP" | "EMAIL" | "INVALID" {
        if (isValidNPM(identity)) return "NPM";
        if (isValidNIP(identity)) return "NIP";
        if (isValidEmail(identity)) return "EMAIL";
        return "INVALID";
}

export async function validateRegisterDTO(c: Context, next: Next) {
        const data: UserRegisterDTO = await c.req.json();

        const invalidFields = [];
        if (!data.nama) invalidFields.push("nama is required!");
        if (data.npm) {
                if (checkIdentityNumber(data.npm) !== "NPM") invalidFields.push("NPM anda tidak valid, pastikan untuk mengecek kembali NPM yang anda masukan");
        }

        if (!data.password) invalidFields.push("password is required");

        const userExist = await prisma.user.findUnique({
                where: {
                        npm: data.npm,
                },
        });

        if (userExist != null) {
                invalidFields.push("npm sudah digunakan!");
        }
        if (invalidFields.length > 0) {
                return response_bad_request(c, "Bad Request", invalidFields);
        }

        await next();
}

export async function validateLoginDTO(c: Context, next: Next) {
        const data: UserLoginDTO = await c.req.json();

        const invalidFields = [];
        if (!data.identity) invalidFields.push(generateErrorStructure("identity", "NPM/NIP/Email is required"));

        if (data.identity) {
                const identityType = checkIdentityType(data.identity);

                if (identityType === "NPM") {
                        if (!checkDigitNPMFakultasPertanian(data.identity)) {
                                invalidFields.push(
                                        generateErrorStructure("identity", "Anda Bukan Mahasiswa Fakultas Pertanian, pastikan untuk mengecek kembali NPM yang anda masukan")
                                );
                        }
                }

                if (identityType === "INVALID") {
                        invalidFields.push(
                                generateErrorStructure("identity", "Format identitas tidak valid. Harap masukkan NPM (13 digit), NIP (16 digit), atau email yang valid!")
                        );
                }
        }

        if (!data.password) invalidFields.push(generateErrorStructure("password", "Password is required"));

        if (invalidFields.length > 0) {
                return response_bad_request(c, "Bad Request", invalidFields);
        }

        await next();
}
