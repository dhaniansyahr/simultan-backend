import { TipeSuratKeteranganKuliah } from "@prisma/client";

export interface SuratKeteranganKuliahDTO {
        id: number;
        ulid: string;
        tipeSurat: TipeSuratKeteranganKuliah;
        deskripsi: string;
        dokumenUrl: string;
}

export interface VerifikasiSuratDTO {
        action: "DISETUJUI" | "DITOLAK";
        alasanPenolakan?: string;
}

export interface LetterProcessDTO {
        nomorSurat: string;
}
