export interface LegalisirIjazahDTO {
        totalLegalisir: number;
        namaRekening: string;
        nomorRekening: string;
        namaBank: string;
        buktiPembayaran: string;
}

export interface VerifikasiLegalisirIjazahDTO {
        action: "DISETUJUI" | "DITOLAK";
        alasanPenolakan?: string;
}

export interface ProsesLegalisirIjazahDTO {
        tanggalPengambilan: string;
        tempatPengambilan: string;
}
