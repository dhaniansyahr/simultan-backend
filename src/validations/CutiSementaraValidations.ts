import { Context, Next } from "hono";
import { response_bad_request } from "$utils/response.utils";
import { ErrorStructure, generateErrorStructure } from "./helper";

import { CutiSementaraDTO, VerifikasiCutiDTO } from "$entities/CutiSementara";

export async function validateCutiSementaraDTO(c: Context, next: Next) {
        const data: CutiSementaraDTO = await c.req.json();
        const invalidFields: ErrorStructure[] = [];

        if (!data.suratIzinOrangTuaUrl) invalidFields.push(generateErrorStructure("suratPersetujuanOrangTuaUrl", "suratPersetujuanOrangTuaUrl cannot be empty"));

        if (!data.suratBebasPustakaUrl) invalidFields.push(generateErrorStructure("bebasPustakaUrl", "bebasPustakaUrl cannot be empty"));

        if (!data.suratBssUrl) invalidFields.push(generateErrorStructure("bssFormUrl", "bssFormUrl cannot be empty"));

        if (invalidFields.length !== 0) return response_bad_request(c, "Validation Error", invalidFields);
        next();
}

export async function validateVerificationSuratKeteranganKuliahDTO(c: Context, next: Next) {
        const data: VerifikasiCutiDTO = await c.req.json();
        const invalidFields: ErrorStructure[] = [];

        if (!data.action) invalidFields.push(generateErrorStructure("action", "action cannot be empty"));

        if (data.action !== "DISETUJUI" && data.action !== "DITOLAK")
                invalidFields.push(generateErrorStructure("action", 'action is required, expected action "DISETUJUI" or "DITOLAK". '));

        if (data.action === "DITOLAK") {
                if (!data.alasanPenolakan) invalidFields.push(generateErrorStructure("reason", "reason cannot be empty"));
        }

        if (invalidFields.length !== 0) return response_bad_request(c, "Validation Error", invalidFields);
        await next();
}
