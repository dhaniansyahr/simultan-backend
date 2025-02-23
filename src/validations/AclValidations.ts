import { Context, Next } from "hono";
import { response_bad_request } from "$utils/response.utils";
import { ErrorStructure, generateErrorStructure } from "./helper";
import { AclCreateDTO } from "$entities/Acl";
import { prisma } from "$utils/prisma.utils";

export async function validateAclDTO(c: Context, next: Next) {
    const data: AclCreateDTO = await c.req.json();
    const invalidFields: ErrorStructure[] = [];

    if (!data.acl || data.acl.length == 0) {
        invalidFields.push(generateErrorStructure("acl", "acl cannot be empty"));
    } else {
        let index = 0;
        for (const acl of data.acl) {
            if (!acl.namaFitur)
                invalidFields.push(generateErrorStructure(`acl[${index}].namaFitur`, "namaFitur cannot be empty"));
            if (!acl.actions || acl.actions.length == 0)
                invalidFields.push(generateErrorStructure(`acl[${index}].actions`, "actions cannot be empty"));
            index++;
        }
    }

    if (!data.aksesLevelId) invalidFields.push(generateErrorStructure("aksesLevelId", "aksesLevelId cannot be empty"));

    if (invalidFields.length !== 0) return response_bad_request(c, "Validation Error", invalidFields);

    // Validate aksesLevel exists
    const aksesLevel = await prisma.aksesLevel.findUnique({
        where: {
            id: data.aksesLevelId,
        },
    });

    if (!aksesLevel) invalidFields.push(generateErrorStructure("aksesLevelId", "aksesLevelId not found"));

    // Validate features and actions exist
    for (const acl of data.acl) {
        const feature = await prisma.feature.findUnique({
            where: {
                nama: acl.namaFitur,
            },
        });

        if (!feature) {
            invalidFields.push(generateErrorStructure("namaFitur", `Feature ${acl.namaFitur} not found`));
            continue;
        }

        for (const actionName of acl.actions) {
            const action = await prisma.action.findFirst({
                where: {
                    nama: actionName,
                    featureId: feature.id,
                },
            });

            if (!action) {
                invalidFields.push(
                    generateErrorStructure("action", `Action ${actionName} not found for feature ${acl.namaFitur}`)
                );
            }
        }
    }

    if (invalidFields.length !== 0) return response_bad_request(c, "Validation Error", invalidFields);

    await next();
}
