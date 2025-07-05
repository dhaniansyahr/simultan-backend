import { TIPE_PENGAMBILAN } from "@prisma/client";

export interface LegalisirIjazahDTO {
        totalLegalisir: number;
        namaRekening?: string;
        nomorRekening?: string;
        namaBank?: string;
        buktiPembayaran: string;
        buktiPembayaranOngkir?: string;
        buktiIjazah: string;
        tipePengambilan: TIPE_PENGAMBILAN;
        alamatPengiriman: string;
        tempatPengambilan: string;
}

export interface VerifikasiLegalisirIjazahDTO {
        action: "DISETUJUI" | "DITOLAK";
        alasanPenolakan?: string;
}

export interface ProsesLegalisirIjazahDTO {
        tanggalPengambilan: string;
        tipePengambilan: TIPE_PENGAMBILAN;
}
