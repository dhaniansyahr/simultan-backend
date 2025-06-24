import { Context, Next } from "hono";
import { response_bad_request } from "$utils/response.utils";
import { ErrorStructure, generateErrorStructure } from "./helper";
import { LegalisirIjazahDTO, VerifikasiLegalisirIjazahDTO, ProsesLegalisirIjazahDTO } from "$entities/LegalisirIjazah";

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
        if (typeof data.buktiIjazah !== "string") invalidFields.push(generateErrorStructure("buktiIjazah", "buktiIjazah must be a string"));
        if (typeof data.tempatPengambilan !== "string") invalidFields.push(generateErrorStructure("tempatPengambilan", "tempatPengambilan harus di isi"));


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

export async function validateProsesLegalisirDTO(c: Context, next: Next) {
        const data: ProsesLegalisirIjazahDTO = await c.req.json();
        const invalidFields: ErrorStructure[] = [];

        if (!data.tanggalPengambilan) invalidFields.push(generateErrorStructure("tanggalPengambilan", "tanggalPengambilan cannot be empty"));
        if (!data.tempatPengambilan) invalidFields.push(generateErrorStructure("tempatPengambilan", "tempatPengambilan cannot be empty"));

        if (typeof data.tanggalPengambilan !== "string") invalidFields.push(generateErrorStructure("tanggalPengambilan", "tanggalPengambilan must be a string"));
        // if (typeof data.tempatPengambilan !== "string") invalidFields.push(generateErrorStructure("tempatPengambilan", "tempatPengambilan must be a string"));

        // Validate date format (YYYY-MM-DD)
        if (data.tanggalPengambilan && !isValidDateFormat(data.tanggalPengambilan)) {
                invalidFields.push(generateErrorStructure("tanggalPengambilan", "tanggalPengambilan must be in YYYY-MM-DD format"));
        }

        if (invalidFields.length !== 0) return response_bad_request(c, "Validation Error", invalidFields);
        await next();
}

// Helper function to validate date format
function isValidDateFormat(dateString: string): boolean {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(dateString)) return false;

        const date = new Date(dateString);
        const timestamp = date.getTime();

        if (typeof timestamp !== "number" || Number.isNaN(timestamp)) return false;

        return dateString === date.toISOString().split("T")[0];
}
