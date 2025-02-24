import { Context, Next } from "hono";
import { response_bad_request } from "$utils/response.utils";
import { ErrorStructure, generateErrorStructure } from "./helper";
import { PengajuanYudisiumDTO, VerifikasiPengajuanYudisiumDTO } from "$entities/PengajuanYudisium";

export async function validatePengajuanYudisiumDTO(c: Context, next: Next) {
        const data: PengajuanYudisiumDTO = await c.req.json();
        const invalidFields: ErrorStructure[] = [];

        if (!data.dokumenUrl) invalidFields.push(generateErrorStructure("dokumenUrl", "dokumenUrl cannot be empty"));

        if (invalidFields.length !== 0) return response_bad_request(c, "Validation Error", invalidFields);
        await next();
}

export async function validateVerifikasiStatusDTO(c: Context, next: Next) {
        const data: VerifikasiPengajuanYudisiumDTO = await c.req.json();
        const invalidFields: ErrorStructure[] = [];

        if (!data.action) invalidFields.push(generateErrorStructure("action", "action cannot be empty"));

        if (data.action !== "USULAN_DISETUJUI" && data.action !== "USULAN_DITOLAK") {
                invalidFields.push(
                        generateErrorStructure("action", "action must be either USULAN_DISETUJUI or USULAN_DITOLAK")
                );
        }

        if (data.action === "USULAN_DITOLAK") {
                if (!data.alasanPenolakan)
                        invalidFields.push(
                                generateErrorStructure("alasanPenolakan", "alasanPenolakan cannot be empty")
                        );
        }

        if (invalidFields.length !== 0) return response_bad_request(c, "Validation Error", invalidFields);
        await next();
}
