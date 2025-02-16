import { VerificationStatusKemahasiswaan } from "@prisma/client";

export function getNextVerificationStatus(
    currentStatus: VerificationStatusKemahasiswaan,
    isCuti: boolean = false
): VerificationStatusKemahasiswaan {
    const statusFlow = new Map<VerificationStatusKemahasiswaan, VerificationStatusKemahasiswaan>([
        [
            VerificationStatusKemahasiswaan.DIPROSES_OPERATOR_KEMAHASISWAAN,
            VerificationStatusKemahasiswaan.DISETUJUI_OPERATOR_KEMAHASISWAAN,
        ],
        [
            VerificationStatusKemahasiswaan.DISETUJUI_OPERATOR_KEMAHASISWAAN,
            VerificationStatusKemahasiswaan.DIPROSES_KASUBBAG_KEMAHASISWAAN,
        ],
        [
            VerificationStatusKemahasiswaan.DIPROSES_KASUBBAG_KEMAHASISWAAN,
            VerificationStatusKemahasiswaan.DISETUJUI_KASUBBAG_KEMAHASISWAAN,
        ],
        [
            VerificationStatusKemahasiswaan.DISETUJUI_KASUBBAG_KEMAHASISWAAN,
            isCuti ? VerificationStatusKemahasiswaan.SURAT_DIPROSES : VerificationStatusKemahasiswaan.USULAN_DISETUJUI,
        ],
        [VerificationStatusKemahasiswaan.SURAT_DIPROSES, VerificationStatusKemahasiswaan.USULAN_DISETUJUI],
        [VerificationStatusKemahasiswaan.USULAN_DISETUJUI, VerificationStatusKemahasiswaan.USULAN_DISETUJUI],
        [VerificationStatusKemahasiswaan.USULAN_DITOLAK, VerificationStatusKemahasiswaan.USULAN_DITOLAK],
    ]);

    return statusFlow.get(currentStatus) ?? currentStatus;
}
