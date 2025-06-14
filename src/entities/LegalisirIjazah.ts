export interface LegalisirIjazahDTO {
        dokumenUrl: string;
}

export interface VerifikasiLegalisirIjazahDTO {
        action: "DISETUJUI" | "DITOLAK";
        alasanPenolakan?: string;
}
