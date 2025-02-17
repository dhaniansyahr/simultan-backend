export interface CutiSementaraDTO {
    id: string;
    suratPersetujuanOrangTuaUrl: string;
    bebasPustakaUrl: string;
    bssFormUrl: string;
    noSurat: string;
    reason: string;
    offerById: string;
}

export interface VerifikasiCutiDTO {
    action: "USULAN_DISETUJUI" | "USULAN_DITOLAK";
    reason?: string;
}
