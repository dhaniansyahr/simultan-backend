import { OpsiPengambilan } from "@prisma/client";

export interface LegalisirIjazahDTO {
        totalLegalisir: number;
        namaRekening: string;
        nomorRekening: string;
        namaBank: string;
        buktiPembayaran: string;
        buktiIjazah: string;
        tempatPengambilan: OpsiPengambilan;
}

export interface VerifikasiLegalisirIjazahDTO {
        action: "DISETUJUI" | "DITOLAK";
        alasanPenolakan?: string;
}

export interface ProsesLegalisirIjazahDTO {
        tanggalPengambilan: string;
        tempatPengambilan: OpsiPengambilan;
}
