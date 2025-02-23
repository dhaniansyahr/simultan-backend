export interface CutiSementaraDTO {
    id: string;
    ulid: string;
    suratIzinOrangTuaUrl: string;
    suratBebasPustakaUrl: string;
    suratBssUrl: string;
    alasanPengajuan: string;
}

export interface VerifikasiCutiDTO {
    action: "USULAN_DISETUJUI" | "USULAN_DITOLAK";
    alasanPenolakan?: string;
}
