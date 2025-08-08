import { TipeRekomendasi } from "@prisma/client";

export interface RekomendasiMahasiswaDTO {
  tipeRekomendasi: TipeRekomendasi;
  deskripsi: string;
  institusiTujuan: string;
  dokumenPendukung?: string;
}

export interface VerifikasiRekomendasiMahasiswaDTO {
  action: "DISETUJUI" | "DITOLAK";
  alasanPenolakan?: string;
}

export interface UpdateNomorSuratRekomendasiMahasiswaDTO {
  nomorSurat: string;
}
