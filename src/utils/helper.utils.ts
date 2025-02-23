import { VerifikasiStatusBagianAkademik, VerifikasiStatusBagianKemahasiswaan } from "@prisma/client";

export function getNextVerificationStatus(
        currentStatus: VerifikasiStatusBagianKemahasiswaan,
        isCuti: boolean = false
): VerifikasiStatusBagianKemahasiswaan {
        const statusFlow = new Map<VerifikasiStatusBagianKemahasiswaan, VerifikasiStatusBagianKemahasiswaan>([
                [
                        VerifikasiStatusBagianKemahasiswaan.DIPROSES_OPERATOR_KEMAHASISWAAN,
                        VerifikasiStatusBagianKemahasiswaan.DISETUJUI_OPERATOR_KEMAHASISWAAN,
                ],
                [
                        VerifikasiStatusBagianKemahasiswaan.DISETUJUI_OPERATOR_KEMAHASISWAAN,
                        VerifikasiStatusBagianKemahasiswaan.DIPROSES_KASUBBAG_KEMAHASISWAAN,
                ],
                [
                        VerifikasiStatusBagianKemahasiswaan.DIPROSES_KASUBBAG_KEMAHASISWAAN,
                        VerifikasiStatusBagianKemahasiswaan.DISETUJUI_KASUBBAG_KEMAHASISWAAN,
                ],
                [
                        VerifikasiStatusBagianKemahasiswaan.DISETUJUI_KASUBBAG_KEMAHASISWAAN,
                        isCuti
                                ? VerifikasiStatusBagianKemahasiswaan.SURAT_DIPROSES
                                : VerifikasiStatusBagianKemahasiswaan.USULAN_DISETUJUI,
                ],
                [
                        VerifikasiStatusBagianKemahasiswaan.SURAT_DIPROSES,
                        VerifikasiStatusBagianKemahasiswaan.USULAN_DISETUJUI,
                ],
                [
                        VerifikasiStatusBagianKemahasiswaan.USULAN_DISETUJUI,
                        VerifikasiStatusBagianKemahasiswaan.USULAN_DISETUJUI,
                ],
                [
                        VerifikasiStatusBagianKemahasiswaan.USULAN_DITOLAK,
                        VerifikasiStatusBagianKemahasiswaan.USULAN_DITOLAK,
                ],
        ]);

        return statusFlow.get(currentStatus) ?? currentStatus;
}

export function getNextVerificationStatusAkademik(
        currentStatus: VerifikasiStatusBagianAkademik
): VerifikasiStatusBagianAkademik {
        const statusFlow = new Map<VerifikasiStatusBagianAkademik, VerifikasiStatusBagianAkademik>([
                [
                        VerifikasiStatusBagianAkademik.DIPROSES_OPERATOR_AKADEMIK,
                        VerifikasiStatusBagianAkademik.DISETUJUI_OPERATOR_AKADEMIK,
                ],
                [
                        VerifikasiStatusBagianAkademik.DISETUJUI_OPERATOR_AKADEMIK,
                        VerifikasiStatusBagianAkademik.DIPROSES_KASUBBAG_AKADEMIK,
                ],
                [
                        VerifikasiStatusBagianAkademik.DIPROSES_KASUBBAG_AKADEMIK,
                        VerifikasiStatusBagianAkademik.DISETUJUI_KASUBBAG_AKADEMIK,
                ],
                [
                        VerifikasiStatusBagianAkademik.DISETUJUI_KASUBBAG_AKADEMIK,
                        VerifikasiStatusBagianAkademik.USULAN_DISETUJUI,
                ],

                [VerifikasiStatusBagianAkademik.USULAN_DISETUJUI, VerifikasiStatusBagianAkademik.USULAN_DISETUJUI],
                [VerifikasiStatusBagianAkademik.USULAN_DITOLAK, VerifikasiStatusBagianAkademik.USULAN_DITOLAK],
        ]);

        return statusFlow.get(currentStatus) ?? currentStatus;
}
