import { TipeRekomendasi } from "@prisma/client";

export interface RekomendasiBeasiswaDTO {
  tipeRekomendasi: TipeRekomendasi;
  deskripsi: string;
  institusiTujuan: string;
  dokumenPendukung?: string;
}

export interface VerifikasiRekomendasiBeasiswaDTO {
  action: "DISETUJUI" | "DITOLAK";
  alasanPenolakan?: string;
}

export interface UpdateNomorSuratRekomendasiBeasiswaDTO {
  nomorSurat: string;
}

export interface LetterProcessDTO {
        nomorSurat: string;
}



