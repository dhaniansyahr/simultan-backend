export interface PengajuanYudisiumDTO {
        dokumenUrl: string;
}

export interface VerifikasiPengajuanYudisiumDTO {
        action: "DISETUJUI" | "DITOLAK";
        alasanPenolakan?: string;
}
