import { Context, Next } from "hono";
import { response_bad_request } from "$utils/response.utils";
import { ErrorStructure, generateErrorStructure } from "./helper";
import { LegalisirIjazahDTO, VerifikasiLegalisirIjazahDTO } from "$entities/LegalisirIjazah";

export async function validateLegalisirIjazahDTO(c: Context, next: Next) {
        const data: LegalisirIjazahDTO = await c.req.json();
        const invalidFields: ErrorStructure[] = [];

        if (!data.totalLegalisir) invalidFields.push(generateErrorStructure("totalLegalisir", "totalLegalisir cannot be empty"));
        if (!data.namaBank) invalidFields.push(generateErrorStructure("namaBank", "namaBank cannot be empty"));
        if (!data.nomorRekening) invalidFields.push(generateErrorStructure("nomorRekening", "nomorRekening cannot be empty"));
        if (!data.namaRekening) invalidFields.push(generateErrorStructure("namaRekening", "namaRekening cannot be empty"));
        if (!data.buktiPembayaran) invalidFields.push(generateErrorStructure("buktiPembayaran", "buktiPembayaran cannot be empty"));

        if (data.totalLegalisir < 1) invalidFields.push(generateErrorStructure("totalLegalisir", "totalLegalisir must be greater than 0"));

        if (typeof data.totalLegalisir !== "number") invalidFields.push(generateErrorStructure("totalLegalisir", "totalLegalisir must be a number"));
        if (typeof data.namaBank !== "string") invalidFields.push(generateErrorStructure("namaBank", "namaBank must be a string"));
        if (typeof data.nomorRekening !== "string") invalidFields.push(generateErrorStructure("nomorRekening", "nomorRekening must be a string"));
        if (typeof data.namaRekening !== "string") invalidFields.push(generateErrorStructure("namaRekening", "namaRekening must be a string"));
        if (typeof data.buktiPembayaran !== "string") invalidFields.push(generateErrorStructure("buktiPembayaran", "buktiPembayaran must be a string"));

        if (invalidFields.length !== 0) return response_bad_request(c, "Validation Error", invalidFields);
        await next();
}

export async function validateVerifikasiStatusDTO(c: Context, next: Next) {
        const data: VerifikasiLegalisirIjazahDTO = await c.req.json();
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
