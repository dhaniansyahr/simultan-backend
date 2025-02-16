import { Context, Next } from "hono";
import { response_bad_request } from "$utils/response.utils";
import { ErrorStructure, generateErrorStructure } from "./helper";

import { SuratKeteranganKuliahDTO, VerifikasiSuratDTO } from "$entities/SuratKeteranganKuliah";
import { TypeForSuratKeteranganKuliah } from "@prisma/client";

export async function validateSuratKeteranganKuliahDTO(c: Context, next: Next) {
    const data: SuratKeteranganKuliahDTO = await c.req.json();
    const invalidFields: ErrorStructure[] = [];

    if (!data.fileUrl) invalidFields.push(generateErrorStructure("fileUrl", "fileUrl cannot be empty"));
    if (!data.type) invalidFields.push(generateErrorStructure("type", "type cannot be empty"));
    if (!data.description) invalidFields.push(generateErrorStructure("description", "description is required"));

    if (!Object.values(TypeForSuratKeteranganKuliah).find((item: any) => item === data.type)) {
        invalidFields.push(generateErrorStructure("type", "Invalid value of type"));
    }

    if (invalidFields.length !== 0) return response_bad_request(c, "Validation Error", invalidFields);
    await next();
}

export async function validateVerificationSuratKeteranganKuliahDTO(c: Context, next: Next) {
    const data: VerifikasiSuratDTO = await c.req.json();
    const invalidFields: ErrorStructure[] = [];

    if (!data.action) invalidFields.push(generateErrorStructure("action", "action cannot be empty"));

    if (data.action === "DITOLAK") {
        if (!data.reason) invalidFields.push(generateErrorStructure("reason", "reason cannot be empty"));
    }

    if (invalidFields.length !== 0) return response_bad_request(c, "Validation Error", invalidFields);
    await next();
}
