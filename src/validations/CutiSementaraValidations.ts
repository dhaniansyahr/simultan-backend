import { Context, Next } from "hono";
import { response_bad_request } from "$utils/response.utils";
import { ErrorStructure, generateErrorStructure } from "./helper";

import { CutiSementaraDTO } from "$entities/CutiSementara";

export async function validateCutiSementaraDTO(c: Context, next: Next) {
    const data: CutiSementaraDTO = await c.req.json();
    const invalidFields: ErrorStructure[] = [];

    if (!data.suratPersetujuanOrangTuaUrl)
        invalidFields.push(
            generateErrorStructure("suratPersetujuanOrangTuaUrl", "suratPersetujuanOrangTuaUrl cannot be empty")
        );

    if (!data.bebasPustakaUrl)
        invalidFields.push(generateErrorStructure("bebasPustakaUrl", "bebasPustakaUrl cannot be empty"));

    if (!data.bssFormUrl) invalidFields.push(generateErrorStructure("bssFormUrl", "bssFormUrl cannot be empty"));

    if (!data.reason) invalidFields.push(generateErrorStructure("reason", "reason cannot be empty"));

    if (invalidFields.length !== 0) return response_bad_request(c, "Validation Error", invalidFields);
    next();
}
