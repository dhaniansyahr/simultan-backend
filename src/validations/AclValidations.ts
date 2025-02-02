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
            if (!acl.featureName)
                invalidFields.push(generateErrorStructure(`acl[${index}].featureName`, "featureName cannot be empty"));
            if (!acl.actions || acl.actions.length == 0)
                invalidFields.push(generateErrorStructure("actions", "actions cannot be empty"));

            index++;
        }
    }

    if (!data.userLevelId) invalidFields.push(generateErrorStructure("", " cannot be empty"));

    if (invalidFields.length !== 0) return response_bad_request(c, "Validation Error", invalidFields);

    const userLevel = await prisma.userLevel.findUnique({
        where: {
            id: data.userLevelId,
        },
    });

    if (!userLevel) invalidFields.push(generateErrorStructure("userLevelId", "userLevelId not found"));

    for (const acl of data.acl) {
        let index = 0;

        for (const action of acl.actions) {
            const actionExist = await prisma.action.findUnique({
                where: {
                    featureName_name: {
                        featureName: acl.featureName,
                        name: action,
                    },
                },
            });

            if (!actionExist)
                invalidFields.push(
                    generateErrorStructure(`acl[${index}]`, `feature ${acl.featureName} and action ${action} not found`)
                );
        }
    }

    if (invalidFields.length !== 0) return response_bad_request(c, "Validation Error", invalidFields);

    await next();
}
