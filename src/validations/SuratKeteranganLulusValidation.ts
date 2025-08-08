import { Context, Next } from "hono";
import { ErrorStructure, generateErrorStructure } from "./helper";
import {
  SuratKeteranganLulusDTO,
  VerifikasiSuratKeteranganLulusDTO,
  UpdateNomorSuratSuratKeteranganLulusDTO,
} from "$entities/SuratKeteranganLulus";
import { prisma } from "$utils/prisma.utils";

export async function validateSuratKeteranganLulusDTO(c: Context, next: Next) {
  const data: SuratKeteranganLulusDTO = await c.req.json();
  const invalidFields: ErrorStructure[] = [];

  if (!data.tipeSurat)
    invalidFields.push(
      generateErrorStructure("tipeSurat", "tipeSurat cannot be empty")
    );
  if (!data.deskripsi)
    invalidFields.push(
      generateErrorStructure("deskripsi", "deskripsi cannot be empty")
    );
  if (!data.dokumenTranskrip)
    invalidFields.push(
      generateErrorStructure(
        "dokumenTranskrip",
        "dokumenTranskrip cannot be empty"
      )
    );

  if (invalidFields.length > 0) {
    return c.json(
      {
        status: false,
        message: "Validation error",
        data: invalidFields,
      },
      400
    );
  }

  await next();
}

export async function validateVerifikasiSuratKeteranganLulusDTO(
  c: Context,
  next: Next
) {
  const data: VerifikasiSuratKeteranganLulusDTO = await c.req.json();
  const invalidFields: ErrorStructure[] = [];

  if (!data.action)
    invalidFields.push(
      generateErrorStructure("action", "action cannot be empty")
    );
  if (!["DISETUJUI", "DITOLAK"].includes(data.action)) {
    invalidFields.push(
      generateErrorStructure(
        "action",
        "action must be either DISETUJUI or DITOLAK"
      )
    );
  }

  if (data.action === "DITOLAK" && !data.alasanPenolakan) {
    invalidFields.push(
      generateErrorStructure(
        "alasanPenolakan",
        "alasanPenolakan is required when action is DITOLAK"
      )
    );
  }

  if (invalidFields.length > 0) {
    return c.json(
      {
        status: false,
        message: "Validation error",
        data: invalidFields,
      },
      400
    );
  }

  await next();
}

export async function validateUpdateNomorSuratSuratKeteranganLulusDTO(
  c: Context,
  next: Next
) {
  // Check if this is a GET request (cetak-surat doesn't need body validation)
  if (c.req.method === "GET") {
    await next();
    return;
  }

  try {
    const data: UpdateNomorSuratSuratKeteranganLulusDTO = await c.req.json();
    const invalidFields: ErrorStructure[] = [];

    if (!data.nomorSurat) {
      invalidFields.push(
        generateErrorStructure("nomorSurat", "nomorSurat cannot be empty")
      );
    }

    if (invalidFields.length > 0) {
      return c.json(
        {
          status: false,
          message: "Validation error",
          data: invalidFields,
        },
        400
      );
    }

    await next();
  } catch (error) {
    // Handle JSON parsing errors for non-GET requests
    return c.json(
      {
        status: false,
        message: "Invalid JSON in request body",
        data: null,
      },
      400
    );
  }
}

// validati no surat

// Validation for input nomorSurat for Surat Keterangan Lulus
export async function validateInputNomorSuratSuratKeteranganLulusDTO(c: Context, next: Next) {
    try {
        const data: { nomorSurat?: string } = await c.req.json();
        const invalidFields: ErrorStructure[] = [];

        if (!data.nomorSurat || !data.nomorSurat.trim()) {
            invalidFields.push(generateErrorStructure("nomorSurat", "nomorSurat cannot be empty"));
        }

        if (invalidFields.length > 0) {
            return c.json(
                {
                    status: false,
                    message: "Validation error",
                    data: invalidFields,
                },
                400
            );
        }

        await next();
    } catch (error) {
        return c.json(
            {
                status: false,
                message: "Invalid JSON in request body",
                data: null,
            },
            400
        );
    }
}

// Validation for updating nomorSurat for Surat Keterangan Lulus
export async function validateUpdateNomorSuratSuratKeteranganLulusDTOEnhanced(c: Context, next: Next) {
    try {
        const data: { nomorSurat?: string } = await c.req.json();
        const invalidFields: ErrorStructure[] = [];

        if (!data.nomorSurat || !data.nomorSurat.trim()) {
            invalidFields.push(generateErrorStructure("nomorSurat", "nomorSurat cannot be empty"));
        }

        // Check if nomorSurat is the same as the existing one
        const { id } = c.req.param();
        try {
            // You need to import and use your prisma client here
            const existingSurat = await prisma.suratKeteranganLulus.findUnique({
                where: { ulid: id },
                select: { nomorSurat: true },
            });

            if (
                existingSurat?.nomorSurat &&
                existingSurat.nomorSurat.trim() === data.nomorSurat?.trim()
            ) {
                invalidFields.push(
                    generateErrorStructure("nomorSurat", "Nomor surat baru sama dengan nomor surat lama!")
                );
            }
        } catch (error) {
            invalidFields.push(
                generateErrorStructure("nomorSurat", "Gagal memvalidasi nomor surat")
            );
        }

        if (invalidFields.length > 0) {
            return c.json(
                {
                    status: false,
                    message: "Validation error",
                    data: invalidFields,
                },
                400
            );
        }

        await next();
    } catch (error) {
        return c.json(
            {
                status: false,
                message: "Invalid JSON in request body",
                data: null,
            },
            400
        );
    }
}
