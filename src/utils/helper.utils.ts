import { prisma } from "./prisma.utils";
import Logger from "$pkg/logger";
import { INTERNAL_SERVER_ERROR_SERVICE_RESPONSE } from "$entities/Service";
import { ulid } from "ulid";

// Define status constants
export const VERIFICATION_STATUS = {
        // Operator Kemahasiswaan Statuses
        DIPROSES_OLEH_OPERATOR: "DIPROSES OLEH OPERATOR KEMAHASISWAAN",
        DISETUJUI_OLEH_OPERATOR: "DISETUJUI OLEH OPERATOR KEMAHASISWAAN",
        DITOLAK_OLEH_OPERATOR: "DITOLAK OLEH OPERATOR KEMAHASISWAAN",

        // Kasubbag Kemahasiswaan Statuses
        DIPROSES_OLEH_KASUBBAG: "DIPROSES OLEH KASUBBAG KEMAHASISWAAN",
        DISETUJUI_OLEH_KASUBBAG: "DISETUJUI OLEH KASUBBAG KEMAHASISWAAN",
        DITOLAK_OLEH_KASUBBAG: "DITOLAK OLEH KASUBBAG KEMAHASISWAAN",

        // Final Processing (SKK only)
        SEDANG_INPUT_NOMOR_SURAT: "SEDANG INPUT NOMOR SURAT OLEH OPERATOR KEMAHASISWAAN",

        // Final Status
        DISETUJUI: "DISETUJUI",

        // No Surat di ubah

        // Akademik Statuses
        DIPROSES_OPERATOR_AKADEMIK: "DIPROSES OLEH OPERATOR AKADEMIK",
        DISETUJUI_OPERATOR_AKADEMIK: "DISETUJUI OLEH OPERATOR AKADEMIK",
        DIPROSES_KASUBBAG_AKADEMIK: "DIPROSES OLEH KASUBBAG AKADEMIK",
        DISETUJUI_KASUBBAG_AKADEMIK: "DISETUJUI OLEH KASUBBAG AKADEMIK",
        DITOLAK: "DITOLAK",

        // Legalisir Ijazah Processing Statuses
        SEDANG_DIPROSES_LEGALISIR: "LEGALISIR IJAZAH SEDANG DIPROSES",
        SELESAI: "SELESAI",
} as const;

export function getNextVerificationStatus(currentStatus: string, isCuti: boolean = false): string {
        const statusFlow = new Map<string, string>([
                // Operator Kemahasiswaan processes → approves
                [VERIFICATION_STATUS.DIPROSES_OLEH_OPERATOR, VERIFICATION_STATUS.DISETUJUI_OLEH_OPERATOR],

                // Operator approves → goes to Kasubbag
                [VERIFICATION_STATUS.DISETUJUI_OLEH_OPERATOR, VERIFICATION_STATUS.DIPROSES_OLEH_KASUBBAG],

                // Kasubbag processes → approves
                [VERIFICATION_STATUS.DIPROSES_OLEH_KASUBBAG, VERIFICATION_STATUS.DISETUJUI_OLEH_KASUBBAG],

                // Kasubbag approves → goes to letter number input (for SKK) or final approval (for Cuti)
                [VERIFICATION_STATUS.DISETUJUI_OLEH_KASUBBAG, isCuti ? VERIFICATION_STATUS.DISETUJUI : VERIFICATION_STATUS.SEDANG_INPUT_NOMOR_SURAT],

                // Letter number input → final approval
                [VERIFICATION_STATUS.SEDANG_INPUT_NOMOR_SURAT, VERIFICATION_STATUS.DISETUJUI],

                // Final states remain the same
                [VERIFICATION_STATUS.DISETUJUI, VERIFICATION_STATUS.DISETUJUI],
        ]);

        return statusFlow.get(currentStatus) ?? currentStatus;
}

export async function flowCreatingStatusVerification(currentStatus: string, id: string, name: string, userId: number, aksesLevelId: number, cuti: boolean) {
        try {
                const nextStatus: string = getNextVerificationStatus(currentStatus, cuti);

                // Determine status description based on current and next status
                let statusDescription = `Pengajuan Diproses Oleh ${name}`;

                if (nextStatus === VERIFICATION_STATUS.DISETUJUI_OLEH_OPERATOR) {
                        statusDescription = `Pengajuan DISETUJUI oleh ${name} (Operator Kemahasiswaan)`;
                } else if (nextStatus === VERIFICATION_STATUS.DIPROSES_OLEH_KASUBBAG) {
                        statusDescription = `Pengajuan diteruskan ke Kasubbag Kemahasiswaan setelah disetujui operator`;
                } else if (nextStatus === VERIFICATION_STATUS.DISETUJUI_OLEH_KASUBBAG) {
                        statusDescription = `Pengajuan DISETUJUI oleh ${name} (Kasubbag Kemahasiswaan)`;
                } else if (nextStatus === VERIFICATION_STATUS.SEDANG_INPUT_NOMOR_SURAT) {
                        statusDescription = `Pengajuan disetujui Kasubbag - menunggu input nomor surat`;
                } else if (nextStatus === VERIFICATION_STATUS.DISETUJUI) {
                        if (cuti) {
                                statusDescription = `Cuti Sementara telah disetujui secara final`;
                        } else {
                                statusDescription = `Surat Keterangan Kuliah telah disetujui secara final`;
                        }
                }

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
                                                                deskripsi: statusDescription,
                                                                userId: userId,
                                                        },
                                                ],
                                        },
                                },
                        });

                        // Create log entry for approval statuses
                        if (nextStatus === VERIFICATION_STATUS.DISETUJUI_OLEH_OPERATOR) {
                                await prisma.log.create({
                                        data: {
                                                ulid: ulid(),
                                                flagMenu: "CUTI_SEMENTARA",
                                                deskripsi: `Cuti Sementara dengan ID ${id} DISETUJUI_OLEH_OPERATOR oleh ${name}`,
                                                aksesLevelId: aksesLevelId,
                                                userId: userId,
                                        },
                                });
                        } else if (nextStatus === VERIFICATION_STATUS.DISETUJUI_OLEH_KASUBBAG) {
                                await prisma.log.create({
                                        data: {
                                                ulid: ulid(),
                                                flagMenu: "CUTI_SEMENTARA",
                                                deskripsi: `Cuti Sementara dengan ID ${id} DISETUJUI_OLEH_KASUBBAG oleh ${name}`,
                                                aksesLevelId: aksesLevelId,
                                                userId: userId,
                                        },
                                });
                        } else if (nextStatus === VERIFICATION_STATUS.DISETUJUI) {
                                await prisma.log.create({
                                        data: {
                                                ulid: ulid(),
                                                flagMenu: "CUTI_SEMENTARA",
                                                deskripsi: `Cuti Sementara dengan ID ${id} DISETUJUI oleh ${name}`,
                                                aksesLevelId: aksesLevelId,
                                                userId: userId,
                                        },
                                });
                        }
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
                                                                deskripsi: statusDescription,
                                                                userId: userId,
                                                        },
                                                ],
                                        },
                                },
                        });

                        // Create log entry for approval statuses
                        if (nextStatus === VERIFICATION_STATUS.DISETUJUI_OLEH_OPERATOR) {
                                await prisma.log.create({
                                        data: {
                                                ulid: ulid(),
                                                flagMenu: "SURAT_KETERANGAN_KULIAH",
                                                deskripsi: `Surat Keterangan Kuliah dengan ID ${id} DISETUJUI_OLEH_OPERATOR oleh ${name}`,
                                                aksesLevelId: aksesLevelId,
                                                userId: userId,
                                        },
                                });
                        } else if (nextStatus === VERIFICATION_STATUS.DISETUJUI_OLEH_KASUBBAG) {
                                await prisma.log.create({
                                        data: {
                                                ulid: ulid(),
                                                flagMenu: "SURAT_KETERANGAN_KULIAH",
                                                deskripsi: `Surat Keterangan Kuliah dengan ID ${id} DISETUJUI_OLEH_KASUBBAG oleh ${name}`,
                                                aksesLevelId: aksesLevelId,
                                                userId: userId,
                                        },
                                });
                        } else if (nextStatus === VERIFICATION_STATUS.DISETUJUI) {
                                await prisma.log.create({
                                        data: {
                                                ulid: ulid(),
                                                flagMenu: "SURAT_KETERANGAN_KULIAH",
                                                deskripsi: `Surat Keterangan Kuliah dengan ID ${id} DISETUJUI oleh ${name}`,
                                                aksesLevelId: aksesLevelId,
                                                userId: userId,
                                        },
                                });
                        }
                }
        } catch (error) {
                Logger.error(`SuratKeteranganKuliahService.flowCreatingStatusVerification : ${error}`);
                return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
        }
}

export function isValidNPM(npm: string): boolean {
        const npmRegex = /^\d{13}$/;
        return npmRegex.test(npm);
}

export function isValidNIP(nip: string): boolean {
        const nipRegex = /^\d{16}$/;
        return nipRegex.test(nip);
}

export function isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
}

export function checkDigitNPMFakultasPertanian(npm: string): boolean {
        const npmRegex = /^\d{13}$/;
        if (!npmRegex.test(npm)) return false;

        const digit3And4 = npm.substring(2, 4);
        return digit3And4 === "05";
}
