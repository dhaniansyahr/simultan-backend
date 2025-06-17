import { Context, Next } from "hono";
import { response_bad_request } from "$utils/response.utils";
import { ErrorStructure, generateErrorStructure } from "./helper";
import { PengajuanYudisiumDTO, VerifikasiPengajuanYudisiumDTO } from "$entities/PengajuanYudisium";

export async function validatePengajuanYudisiumDTO(c: Context, next: Next) {
        const data: PengajuanYudisiumDTO = await c.req.json();
        const invalidFields: ErrorStructure[] = [];

        if (!data.suratPendaftaran) invalidFields.push(generateErrorStructure("suratPendaftaran", "suratPendaftaran cannot be empty"));
        if (!data.suratBebasLab) invalidFields.push(generateErrorStructure("suratBebasLab", "suratBebasLab cannot be empty"));
        if (!data.suratBebasPerpustakaan) invalidFields.push(generateErrorStructure("suratBebasPerpustakaan", "suratBebasPerpustakaan cannot be empty"));
        if (!data.suratDistribusiSkripsi) invalidFields.push(generateErrorStructure("suratDistribusiSkripsi", "suratDistribusiSkripsi cannot be empty"));
        if (!data.suratPendaftaranIka) invalidFields.push(generateErrorStructure("suratPendaftaranIka", "suratPendaftaranIka cannot be empty"));

        if (typeof data.suratPendaftaran !== "string") invalidFields.push(generateErrorStructure("suratPendaftaran", "suratPendaftaran must be a string"));
        if (typeof data.suratBebasLab !== "string") invalidFields.push(generateErrorStructure("suratBebasLab", "suratBebasLab must be a string"));
        if (typeof data.suratBebasPerpustakaan !== "string") invalidFields.push(generateErrorStructure("suratBebasPerpustakaan", "suratBebasPerpustakaan must be a string"));
        if (typeof data.suratDistribusiSkripsi !== "string") invalidFields.push(generateErrorStructure("suratDistribusiSkripsi", "suratDistribusiSkripsi must be a string"));
        if (typeof data.suratPendaftaranIka !== "string") invalidFields.push(generateErrorStructure("suratPendaftaranIka", "suratPendaftaranIka must be a string"));

        if (invalidFields.length !== 0) return response_bad_request(c, "Validation Error", invalidFields);
        await next();
}

export async function validateVerifikasiStatusDTO(c: Context, next: Next) {
        const data: VerifikasiPengajuanYudisiumDTO = await c.req.json();
        const invalidFields: ErrorStructure[] = [];

        if (!data.action) invalidFields.push(generateErrorStructure("action", "action cannot be empty"));

        if (data.action !== "DISETUJUI" && data.action !== "DITOLAK") {
                invalidFields.push(generateErrorStructure("action", "action must be either DISETUJUI or DITOLAK"));
        }

        if (data.action === "DITOLAK") {
                if (!data.alasanPenolakan) invalidFields.push(generateErrorStructure("alasanPenolakan", "alasanPenolakan cannot be empty"));
        }

        if (invalidFields.length !== 0) return response_bad_request(c, "Validation Error", invalidFields);
        await next();
}
