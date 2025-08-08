import { TipeSuratKeteranganLulus } from "@prisma/client";

export interface SuratKeteranganLulusDTO {
  tipeSurat: TipeSuratKeteranganLulus;
  deskripsi: string;
  dokumenTranskrip: string;
  dokumenIjazah: string;
}

export interface VerifikasiSuratKeteranganLulusDTO {
  action: "DISETUJUI" | "DITOLAK";
  alasanPenolakan?: string;
}

export interface UpdateNomorSuratSuratKeteranganLulusDTO {
  nomorSurat: string;
}

export interface LetterProcessDTO {
        nomorSurat: string;
}
