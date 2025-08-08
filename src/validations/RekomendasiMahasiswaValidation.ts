import { Context, Next } from "hono";
import { ErrorStructure, generateErrorStructure } from "./helper";
import {
  RekomendasiMahasiswaDTO,
  VerifikasiRekomendasiMahasiswaDTO,
  UpdateNomorSuratRekomendasiMahasiswaDTO,
} from "$entities/RekomendasiMahasiswa";

export async function validateRekomendasiMahasiswaDTO(c: Context, next: Next) {
  const data: RekomendasiMahasiswaDTO = await c.req.json();
  const invalidFields: ErrorStructure[] = [];

  if (!data.tipeRekomendasi)
    invalidFields.push(
      generateErrorStructure(
        "tipeRekomendasi",
        "tipeRekomendasi cannot be empty"
      )
    );
  if (!data.deskripsi)
    invalidFields.push(
      generateErrorStructure("deskripsi", "deskripsi cannot be empty")
    );
  if (!data.institusiTujuan)
    invalidFields.push(
      generateErrorStructure(
        "institusiTujuan",
        "institusiTujuan cannot be empty"
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

export async function validateVerifikasiRekomendasiMahasiswaDTO(
  c: Context,
  next: Next
) {
  const data: VerifikasiRekomendasiMahasiswaDTO = await c.req.json();
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

export async function validateUpdateNomorSuratRekomendasiMahasiswaDTO(
  c: Context,
  next: Next
) {
  // Check if this is a GET request (cetak-surat doesn't need body validation)
  if (c.req.method === "GET") {
    await next();
    return;
  }

  try {
    const data: UpdateNomorSuratRekomendasiMahasiswaDTO = await c.req.json();
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
