import { Context, Next } from "hono";
import { response_bad_request } from "$utils/response.utils";
import { ErrorStructure, generateErrorStructure } from "./helper";
import { prisma } from "$utils/prisma.utils";
import { UserLevelDTO } from "$entities/UserLevel";

export async function validateUserLevelCreateDTO(c: Context, next: Next) {
    const data: UserLevelDTO = await c.req.json();
    const invalidFields: ErrorStructure[] = [];
    if (!data.name) invalidFields.push(generateErrorStructure("name", "name cannot be empty"));

    if (invalidFields.length !== 0) return response_bad_request(c, "Validation Error", invalidFields);
    const nameExist = await prisma.userLevel.findUnique({
        where: {
            name: data.name,
        },
    });

    if (nameExist) invalidFields.push(generateErrorStructure("name", "name is already exist"));

    if (invalidFields.length !== 0) return response_bad_request(c, "Validation Error", invalidFields);
    await next();
}

export async function validateUserLevelUpdateDTO(c: Context, next: Next) {
    const data: UserLevelDTO = await c.req.json();
    const invalidFields: ErrorStructure[] = [];
    const id = c.req.param("id");

    if (!data.name) invalidFields.push(generateErrorStructure("name", "name cannot be empty"));

    if (invalidFields.length !== 0) return response_bad_request(c, "Validation Error", invalidFields);
    const nameExist = await prisma.userLevel.findUnique({
        where: {
            name: data.name,
        },
    });

    if (nameExist && nameExist.id !== id) invalidFields.push(generateErrorStructure("name", "name is already exist"));

    if (invalidFields.length !== 0) return response_bad_request(c, "Validation Error", invalidFields);
    await next();
}
