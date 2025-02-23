export interface PengajuanYudisiumDTO {
        dokumenUrl: string;
}

export interface VerifikasiPengajuanYudisiumDTO {
        action: "USULAN_DISETUJUI" | "USULAN_DITOLAK";
        alasanPenolakan?: string;
}
