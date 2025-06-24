import { Context, Next } from "hono";
import { response_bad_request } from "$utils/response.utils";
import { ErrorStructure, generateErrorStructure } from "./helper";
import { LetterProcessDTO, SuratKeteranganKuliahDTO, VerifikasiSuratDTO } from "$entities/SuratKeteranganKuliah";
import { TipeSuratKeteranganKuliah } from "@prisma/client";
import { UserJWTDAO } from "$entities/User";
import { prisma } from "$utils/prisma.utils";
import { VERIFICATION_STATUS } from "$utils/helper.utils";

export async function validateSuratKeteranganKuliahDTO(c: Context, next: Next) {
        const data: SuratKeteranganKuliahDTO = await c.req.json();
        const user: UserJWTDAO = c.get("jwtPayload");

        const invalidFields: ErrorStructure[] = [];

        if (!data.tipeSurat) invalidFields.push(generateErrorStructure("tipeSurat", "tipeSurat cannot be empty"));
        if (!data.dokumenUrl) invalidFields.push(generateErrorStructure("dokumenUrl", "dokumen cannot be empty"));
        if (!data.deskripsi) invalidFields.push(generateErrorStructure("deskripsi", "deskripsi is required"));

        if (!Object.values(TipeSuratKeteranganKuliah).find((item: any) => item === data.tipeSurat)) {
                invalidFields.push(generateErrorStructure("type", "Invalid value of type"));
        }

        // Check if user already has a pending letter
        const existingLetter = await prisma.suratKeteranganKuliah.findFirst({
                where: {
                        userId: user.id,
                        verifikasiStatus: {
                                in: [VERIFICATION_STATUS.DIPROSES_OLEH_OPERATOR, VERIFICATION_STATUS.DIPROSES_OLEH_KASUBBAG],
                        },
                },
        });

        if (existingLetter) {
                invalidFields.push(generateErrorStructure("pengajuan", "Anda masih memiliki pengajuan surat yang sedang diproses"));
        }

        if (invalidFields.length !== 0) return response_bad_request(c, "Validation Error", invalidFields);
        await next();
}

export async function validateVerificationSuratKeteranganKuliahDTO(c: Context, next: Next) {
        const data: VerifikasiSuratDTO = await c.req.json();
        const invalidFields: ErrorStructure[] = [];

        if (!data.action) invalidFields.push(generateErrorStructure("action", "action cannot be empty"));

        if (data.action === "DITOLAK") {
                if (!data.alasanPenolakan) invalidFields.push(generateErrorStructure("alasanPenolakan", "alasanPenolakan cannot be empty"));
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

export async function validateUpdateNomorSuratSuratKeteranganKuliahDTO(c: Context, next: Next) {
        const data: { nomorSurat: string } = await c.req.json();
        const invalidFields: ErrorStructure[] = [];

        if (!data.nomorSurat) invalidFields.push(generateErrorStructure("nomorSurat", "nomorSurat cannot be empty"));
        // Check if nomor surat is the same
        // Check if nomor surat is the same as existing one
        const { id } = c.req.param();
        
        try {
                const existingSurat = await prisma.suratKeteranganKuliah.findUnique({
                        where: { ulid: id },
                        select: { nomorSurat: true }
                });
                
                if (existingSurat?.nomorSurat && existingSurat.nomorSurat === data.nomorSurat.trim()) {
                        invalidFields.push(generateErrorStructure("nomorSurat", "Nomor surat baru sama dengan nomor surat lama!"));
                }
        } catch (error) {
                invalidFields.push(generateErrorStructure("nomorSurat", "Gagal memvalidasi nomor surat"));
        }

        if (invalidFields.length !== 0) return response_bad_request(c, "Validation Error", invalidFields);
        await next();
}
