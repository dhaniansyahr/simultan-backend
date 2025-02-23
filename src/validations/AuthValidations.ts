import { UserLoginDTO, UserRegisterDTO } from "$entities/User";
import { Context, Next } from "hono";
import { response_bad_request } from "../utils/response.utils";
import { prisma } from "../utils/prisma.utils";
import { generateErrorStructure } from "./helper";
import { checkIdentityNumber } from "$utils/strings.utils";

// function validateEmailFormat(email: string): boolean {
//     const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
//     return expression.test(email);
// }

export async function validateRegisterDTO(c: Context, next: Next) {
    const data: UserRegisterDTO = await c.req.json();

    const invalidFields = [];
    if (!data.nama) invalidFields.push("nama is required!");
    if (data.npm) {
        if (checkIdentityNumber(data.npm) !== "NPM")
            invalidFields.push("NPM anda tidak valid, pastikan untuk mengecek kembali NPM yang anda masukan");
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
    if (!data.identityNumber) invalidFields.push("NPM/NIP is required");

    const validIdentityNumber = checkIdentityNumber(data.identityNumber);
    if (validIdentityNumber !== "NPM" && validIdentityNumber !== "NIP")
        invalidFields.push(generateErrorStructure("identityNumber", "NIP/NPM tidak valid, Harap Perikas kembali!"));

    if (!data.password) invalidFields.push(generateErrorStructure("password", "password is required"));

    if (invalidFields.length > 0) {
        return response_bad_request(c, "Bad Request", invalidFields);
    }

    await next();
}
