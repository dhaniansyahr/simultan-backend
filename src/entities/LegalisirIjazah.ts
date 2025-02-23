export interface LegalisirIjazahDTO {
        dokumenUrl: string;
}

export interface VerifikasiLegalisirIjazahDTO {
        action: "USULAN_DISETUJUI" | "USULAN_DITOLAK";
        alasanPenolakan?: string;
}
