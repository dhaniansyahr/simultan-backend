import { Context, Next } from "hono";
import { response_bad_request } from "$utils/response.utils";
import { ErrorStructure, generateErrorStructure } from "./helper";
import { prisma } from "$utils/prisma.utils";
import { AksesLevelDTO } from "$entities/AksesLevel";

export async function validateAksesLevelCreateDTO(c: Context, next: Next) {
        const data: AksesLevelDTO = await c.req.json();
        const invalidFields: ErrorStructure[] = [];

        if (!data.name) {
                invalidFields.push(generateErrorStructure("name", "name cannot be empty"));
        }

        if (invalidFields.length !== 0) {
                return response_bad_request(c, "Validation Error", invalidFields);
        }

        const nameExist = await prisma.aksesLevel.findUnique({
                where: {
                        name: data.name,
                },
        });

        if (nameExist) {
                invalidFields.push(generateErrorStructure("name", "name is already exist"));
        }

        if (invalidFields.length !== 0) {
                return response_bad_request(c, "Validation Error", invalidFields);
        }

        await next();
}

export async function validateAksesLevelUpdateDTO(c: Context, next: Next) {
        const data: AksesLevelDTO = await c.req.json();
        const invalidFields: ErrorStructure[] = [];
        const id = parseInt(c.req.param("id"));

        if (!id || isNaN(id)) {
                invalidFields.push(generateErrorStructure("id", "Invalid ID format"));
        }

        if (!data.name) {
                invalidFields.push(generateErrorStructure("name", "name cannot be empty"));
        }

        if (invalidFields.length !== 0) {
                return response_bad_request(c, "Validation Error", invalidFields);
        }

        const nameExist = await prisma.aksesLevel.findUnique({
                where: {
                        name: data.name,
                },
        });

        if (nameExist && nameExist.id !== id) {
                invalidFields.push(generateErrorStructure("name", "name is already exist"));
        }

        if (invalidFields.length !== 0) {
                return response_bad_request(c, "Validation Error", invalidFields);
        }

        await next();
}
