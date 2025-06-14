import { INTERNAL_SERVER_ERROR_SERVICE_RESPONSE } from "$entities/Service";
import Logger from "$pkg/logger";
import { VERIFICATION_STATUS } from "$utils/helper.utils";
import { prisma } from "$utils/prisma.utils";
import { ulid } from "ulid";

export function getNextVerificationStatusAkademik(currentStatus: string): string {
        const statusFlow = new Map<string, string>([
                // Operator Akademik processes → approves
                [VERIFICATION_STATUS.DIPROSES_OPERATOR_AKADEMIK, VERIFICATION_STATUS.DISETUJUI_OPERATOR_AKADEMIK],

                // Operator approves → goes to Kasubbag
                [VERIFICATION_STATUS.DISETUJUI_OPERATOR_AKADEMIK, VERIFICATION_STATUS.DIPROSES_KASUBBAG_AKADEMIK],

                // Kasubbag processes → approves
                [VERIFICATION_STATUS.DIPROSES_KASUBBAG_AKADEMIK, VERIFICATION_STATUS.DISETUJUI_KASUBBAG_AKADEMIK],

                // Kasubbag approves → final approval
                [VERIFICATION_STATUS.DISETUJUI_KASUBBAG_AKADEMIK, VERIFICATION_STATUS.DISETUJUI],

                // Final states remain the same
                [VERIFICATION_STATUS.DISETUJUI, VERIFICATION_STATUS.DISETUJUI],
                [VERIFICATION_STATUS.DITOLAK, VERIFICATION_STATUS.DITOLAK],
        ]);

        return statusFlow.get(currentStatus) ?? currentStatus;
}

export async function flowCreatingStatusVeificationAkademik(currentStatus: string, id: string, name: string, userId: number, yudisium: boolean) {
        try {
                const nextStatus: string = getNextVerificationStatusAkademik(currentStatus);

                // Determine status description based on current and next status
                let statusDescription = `Pengajuan Diproses Oleh ${name}`;

                console.log("Next Status Akademik : ", nextStatus);

                if (nextStatus === VERIFICATION_STATUS.DISETUJUI_OPERATOR_AKADEMIK) {
                        statusDescription = `Pengajuan DISETUJUI oleh ${name} (Operator Akademik)`;
                } else if (nextStatus === VERIFICATION_STATUS.DIPROSES_KASUBBAG_AKADEMIK) {
                        statusDescription = `Pengajuan diteruskan ke Kasubbag Akademik setelah disetujui operator`;
                } else if (nextStatus === VERIFICATION_STATUS.DISETUJUI_KASUBBAG_AKADEMIK) {
                        statusDescription = `Pengajuan DISETUJUI oleh ${name} (Kasubbag Akademik)`;
                } else if (nextStatus === VERIFICATION_STATUS.DISETUJUI) {
                        statusDescription = yudisium ? `Pengajuan Yudisium telah disetujui` : `Legalisir Ijazah telah disetujui`;
                } else if (nextStatus === VERIFICATION_STATUS.DITOLAK) {
                        statusDescription = `Pengajuan ditolak oleh ${name}`;
                }

                if (yudisium) {
                        await prisma.pengajuanYudisium.update({
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
                        if (nextStatus === VERIFICATION_STATUS.DISETUJUI_OPERATOR_AKADEMIK) {
                                console.log("Masuk ke DISETUJUI");
                                await prisma.log.create({
                                        data: {
                                                ulid: ulid(),
                                                flagMenu: "PENGAJUAN_YUDISIUM",
                                                deskripsi: `Pengajuan Yudisium dengan ID ${id} DISETUJUI_OLEH_OPERATOR_AKADEMIK oleh ${name}`,
                                                aksesLevelId: userId,
                                                userId: userId,
                                        },
                                });
                        } else if (nextStatus === VERIFICATION_STATUS.DISETUJUI_KASUBBAG_AKADEMIK) {
                                await prisma.log.create({
                                        data: {
                                                ulid: ulid(),
                                                flagMenu: "PENGAJUAN_YUDISIUM",
                                                deskripsi: `Pengajuan Yudisium dengan ID ${id} DISETUJUI_OLEH_KASUBBAG_AKADEMIK oleh ${name}`,
                                                aksesLevelId: userId,
                                                userId: userId,
                                        },
                                });
                        } else if (nextStatus === VERIFICATION_STATUS.DISETUJUI) {
                                await prisma.log.create({
                                        data: {
                                                ulid: ulid(),
                                                flagMenu: "PENGAJUAN_YUDISIUM",
                                                deskripsi: `Pengajuan Yudisium dengan ID ${id} DISETUJUI oleh ${name}`,
                                                aksesLevelId: userId,
                                                userId: userId,
                                        },
                                });
                        } else if (nextStatus === VERIFICATION_STATUS.DITOLAK) {
                                await prisma.log.create({
                                        data: {
                                                ulid: ulid(),
                                                flagMenu: "PENGAJUAN_YUDISIUM",
                                                deskripsi: `Pengajuan Yudisium dengan ID ${id} DITOLAK oleh ${name}`,
                                                aksesLevelId: userId,
                                                userId: userId,
                                        },
                                });
                        }
                } else {
                        await prisma.legalisirIjazah.update({
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
                        if (nextStatus === VERIFICATION_STATUS.DISETUJUI_OPERATOR_AKADEMIK) {
                                await prisma.log.create({
                                        data: {
                                                ulid: ulid(),
                                                flagMenu: "LEGALISIR_IJAZAH",
                                                deskripsi: `Legalisir Ijazah dengan ID ${id} DISETUJUI_OLEH_OPERATOR_AKADEMIK oleh ${name}`,
                                                aksesLevelId: userId,
                                                userId: userId,
                                        },
                                });
                        } else if (nextStatus === VERIFICATION_STATUS.DISETUJUI_KASUBBAG_AKADEMIK) {
                                await prisma.log.create({
                                        data: {
                                                ulid: ulid(),
                                                flagMenu: "LEGALISIR_IJAZAH",
                                                deskripsi: `Legalisir Ijazah dengan ID ${id} DISETUJUI_OLEH_KASUBBAG_AKADEMIK oleh ${name}`,
                                                aksesLevelId: userId,
                                                userId: userId,
                                        },
                                });
                        } else if (nextStatus === VERIFICATION_STATUS.DISETUJUI) {
                                await prisma.log.create({
                                        data: {
                                                ulid: ulid(),
                                                flagMenu: "LEGALISIR_IJAZAH",
                                                deskripsi: `Legalisir Ijazah dengan ID ${id} DISETUJUI oleh ${name}`,
                                                aksesLevelId: userId,
                                                userId: userId,
                                        },
                                });
                        } else if (nextStatus === VERIFICATION_STATUS.DITOLAK) {
                                await prisma.log.create({
                                        data: {
                                                ulid: ulid(),
                                                flagMenu: "LEGALISIR_IJAZAH",
                                                deskripsi: `Legalisir Ijazah dengan ID ${id} DITOLAK oleh ${name}`,
                                                aksesLevelId: userId,
                                                userId: userId,
                                        },
                                });
                        }
                }
        } catch (error) {
                Logger.error(`Helper.flowCreatingStatusVerification : ${error}`);
                return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
        }
}
