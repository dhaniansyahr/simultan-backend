export interface PengajuanYudisiumDTO {
        suratPendaftaran: string;
        suratBebasLab: string;
        suratBebasPerpustakaan: string;
        suratDistribusiSkripsi: string;
        suratPendaftaranIka: string;
}

export interface VerifikasiPengajuanYudisiumDTO {
        action: "DISETUJUI" | "DITOLAK";
        alasanPenolakan?: string;
}
