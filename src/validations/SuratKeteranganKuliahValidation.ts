import { Context, Next } from "hono";
import { response_bad_request } from "$utils/response.utils";
import { ErrorStructure, generateErrorStructure } from "./helper";

import { LetterProcessDTO, SuratKeteranganKuliahDTO, VerifikasiSuratDTO } from "$entities/SuratKeteranganKuliah";
import { TipeSuratKeteranganKuliah } from "@prisma/client";

export async function validateSuratKeteranganKuliahDTO(c: Context, next: Next) {
        const data: SuratKeteranganKuliahDTO = await c.req.json();
        const invalidFields: ErrorStructure[] = [];

        if (!data.tipeSurat) invalidFields.push(generateErrorStructure("tipeSurat", "tipeSurat cannot be empty"));
        if (!data.dokumenUrl) invalidFields.push(generateErrorStructure("dokumenUrl", "dokumen cannot be empty"));
        if (!data.deskripsi) invalidFields.push(generateErrorStructure("deskripsi", "deskripsi is required"));

        if (!Object.values(TipeSuratKeteranganKuliah).find((item: any) => item === data.tipeSurat)) {
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
                if (!data.alasanPenolakan)
                        invalidFields.push(
                                generateErrorStructure("alasanPenolakan", "alasanPenolakan cannot be empty")
                        );
        }

        if (invalidFields.length !== 0) return response_bad_request(c, "Validation Error", invalidFields);
        await next();
}

export async function validateInputNomorSuratSuratKeteranganKuliahDTO(c: Context, next: Next) {
        const data: LetterProcessDTO = await c.req.json();
        const invalidFields: ErrorStructure[] = [];

        if (!data.nomorSurat) invalidFields.push(generateErrorStructure("nomorSurat", "nomorSurat cannot be empty"));

        if (invalidFields.length !== 0) return response_bad_request(c, "Validation Error", invalidFields);
        await next();
}
