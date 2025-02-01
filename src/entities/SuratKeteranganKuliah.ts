import { Status, TypeForSuratKeteranganKuliah } from "@prisma/client";

export interface SuratKeteranganKuliahDTO {
    id: string;
    type: TypeForSuratKeteranganKuliah;
    fileUrl: string;
    reason: string;
    approvedById: string;
    remainingApprovedId: string;
    rejectedById: string;
}

export interface VerifikasiSuratDTO {
    action: Status;
    reason?: string;
}
