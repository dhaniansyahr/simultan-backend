import { VerifikasiStatusBagianAkademik, VerifikasiStatusBagianKemahasiswaan } from "@prisma/client";
import { prisma } from "./prisma.utils";
import Logger from "$pkg/logger";
import { INTERNAL_SERVER_ERROR_SERVICE_RESPONSE } from "$entities/Service";
import { ulid } from "ulid";

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
                                ? VerifikasiStatusBagianKemahasiswaan.USULAN_DISETUJUI
                                : VerifikasiStatusBagianKemahasiswaan.SURAT_DIPROSES,
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

export async function flowCreatingStatusVeification(
        currentStatus: VerifikasiStatusBagianKemahasiswaan,
        id: string,
        name: string,
        userId: number,
        cuti: boolean
) {
        try {
                const nextStatus: VerifikasiStatusBagianKemahasiswaan = getNextVerificationStatus(currentStatus, cuti);

                console.log("INI DIPANGGIL : ", nextStatus);

                if (cuti) {
                        await prisma.cutiSementara.update({
                                where: {
                                        ulid: id,
                                },
                                data: {
                                        verifikasiStatus: nextStatus,
                                        status: {
                                                create: [
                                                        {
                                                                ulid: ulid(),
                                                                nama: nextStatus,
                                                                deskripsi: `Pengajuan Diproses Oleh ${name}`,
                                                                userId: userId,
                                                        },
                                                ],
                                        },
                                },
                        });
                } else {
                        await prisma.suratKeteranganKuliah.update({
                                where: {
                                        ulid: id,
                                },
                                data: {
                                        verifikasiStatus: nextStatus,
                                        status: {
                                                create: [
                                                        {
                                                                ulid: ulid(),
                                                                nama: nextStatus,
                                                                deskripsi: `Pengajuan Diproses Oleh ${name}`,
                                                                userId: userId,
                                                        },
                                                ],
                                        },
                                },
                        });
                }
        } catch (error) {
                Logger.error(`SuratKeteranganKuliahService.flowCreatingStatusVerification : ${error}`);
                return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
        }
}
