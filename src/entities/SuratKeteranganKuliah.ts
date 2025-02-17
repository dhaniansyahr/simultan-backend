import { TypeForSuratKeteranganKuliah } from "@prisma/client";

export interface SuratKeteranganKuliahDTO {
    id: string;
    type: TypeForSuratKeteranganKuliah;
    fileUrl: string;
    reason: string;
    description: string;
    offerById: string;
}

export interface VerifikasiSuratDTO {
    action: "DISETUJUI" | "DITOLAK";
    reason?: string;
}
