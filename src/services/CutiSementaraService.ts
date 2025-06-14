import { FilteringQueryV2, PagedList } from "$entities/Query";
import { BadRequestWithMessage, INTERNAL_SERVER_ERROR_SERVICE_RESPONSE, INVALID_ID_SERVICE_RESPONSE, ServiceResponse } from "$entities/Service";
import Logger from "$pkg/logger";
import { prisma } from "$utils/prisma.utils";
import { CutiSementara } from "@prisma/client";
import { CutiSementaraDTO, VerifikasiCutiDTO } from "$entities/CutiSementara";
import { buildFilterQueryLimitOffsetV2 } from "./helpers/FilterQueryV2";
import { UserJWTDAO } from "$entities/User";
import { ulid } from "ulid";
import { VERIFICATION_STATUS, flowCreatingStatusVerification } from "$utils/helper.utils";

export type CreateResponse = CutiSementara | {};
export async function create(data: CutiSementaraDTO, user: UserJWTDAO): Promise<ServiceResponse<CreateResponse>> {
        try {
                // Check if user is a student (MAHASISWA)
                const aksesLevel = await prisma.aksesLevel.findUnique({
                        where: { id: user.aksesLevelId },
                });

                if (!aksesLevel || aksesLevel.name !== "MAHASISWA") {
                        return BadRequestWithMessage("Hanya mahasiswa yang dapat mengajukan cuti sementara!");
                }

                // Create the cuti with initial status
                const cuti = await prisma.cutiSementara.create({
                        data: {
                                ulid: ulid(),
                                alasanPengajuan: data.alasanPengajuan,
                                suratBebasPustakaUrl: data.suratBebasPustakaUrl,
                                suratBssUrl: data.suratBssUrl,
                                suratIzinOrangTuaUrl: data.suratIzinOrangTuaUrl,
                                verifikasiStatus: VERIFICATION_STATUS.DIPROSES_OLEH_OPERATOR,
                                userId: user.id,
                                status: {
                                        create: {
                                                ulid: ulid(),
                                                nama: VERIFICATION_STATUS.DIPROSES_OLEH_OPERATOR,
                                                deskripsi: `Pengajuan cuti sementara oleh ${user.nama} - menunggu verifikasi operator kemahasiswaan`,
                                                userId: user.id,
                                        },
                                },
                        },
                        include: {
                                status: true,
                        },
                });

                // Create log entry
                await prisma.log.create({
                        data: {
                                ulid: ulid(),
                                flagMenu: "CUTI_SEMENTARA",
                                deskripsi: `Pengajuan cuti sementara baru dengan ID ${cuti.ulid} oleh mahasiswa ${user.nama}`,
                                aksesLevelId: user.aksesLevelId,
                                userId: user.id,
                        },
                });

                return {
                        status: true,
                        data: cuti,
                };
        } catch (err) {
                Logger.error(`CutiSementaraService.create : ${err}`);
                return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
        }
}

export type GetAllResponse = PagedList<CutiSementara[]> | {};
export async function getAll(filters: FilteringQueryV2, user: UserJWTDAO): Promise<ServiceResponse<GetAllResponse>> {
        try {
                const usedFilters = buildFilterQueryLimitOffsetV2(filters);

                const aksesLevel = await prisma.aksesLevel.findUnique({
                        where: {
                                id: user.aksesLevelId,
                        },
                });

                if (!aksesLevel) return BadRequestWithMessage("Akses level tidak ditemukan");

                // For Mahasiswa
                if (aksesLevel.name === "MAHASISWA") {
                        usedFilters.where.AND.push({
                                userId: user.id,
                        });
                }

                // Filter based on user role
                if (aksesLevel.name === "OPERATOR_KEMAHASISWAAN") {
                        // Operator sees: letters waiting for their verification
                        usedFilters.where.AND.push({
                                verifikasiStatus: VERIFICATION_STATUS.DIPROSES_OLEH_OPERATOR,
                        });
                } else if (aksesLevel.name === "KASUBBAG_KEMAHASISWAAN") {
                        // Kasubbag sees: letters waiting for their verification
                        usedFilters.where.AND.push({
                                verifikasiStatus: VERIFICATION_STATUS.DIPROSES_OLEH_KASUBBAG,
                        });
                }

                usedFilters.include = {
                        user: {
                                select: {
                                        nama: true,
                                        npm: true,
                                },
                        },
                        status: {
                                include: {
                                        user: {
                                                select: {
                                                        nama: true,
                                                        aksesLevel: true,
                                                },
                                        },
                                },
                        },
                };

                usedFilters.orderBy = {
                        createdAt: "asc",
                };

                const [cutiSementara, totalData] = await Promise.all([
                        prisma.cutiSementara.findMany(usedFilters),
                        prisma.cutiSementara.count({
                                where: usedFilters.where,
                        }),
                ]);

                let totalPage = 1;
                if (totalData > usedFilters.take) totalPage = Math.ceil(totalData / usedFilters.take);

                return {
                        status: true,
                        data: {
                                entries: cutiSementara,
                                totalData,
                                totalPage,
                        },
                };
        } catch (err) {
                Logger.error(`CutiSementaraService.getAll : ${err} `);
                return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
        }
}

export type GetByIdResponse = CutiSementara | {};
export async function getById(id: string): Promise<ServiceResponse<GetByIdResponse>> {
        try {
                let cutiSementara = await prisma.cutiSementara.findUnique({
                        include: {
                                user: {
                                        select: {
                                                nama: true,
                                                npm: true,
                                        },
                                },
                                status: {
                                        orderBy: {
                                                createdAt: "asc",
                                        },
                                        include: {
                                                user: {
                                                        select: {
                                                                nama: true,
                                                                aksesLevel: true,
                                                        },
                                                },
                                        },
                                },
                        },
                        where: {
                                ulid: id,
                        },
                });

                if (!cutiSementara) return INVALID_ID_SERVICE_RESPONSE;

                return {
                        status: true,
                        data: cutiSementara,
                };
        } catch (err) {
                Logger.error(`CutiSementaraService.getById : ${err}`);
                return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
        }
}

export async function verificationStatus(id: string, data: VerifikasiCutiDTO, user: UserJWTDAO): Promise<ServiceResponse<{}>> {
        try {
                const cuti = await prisma.cutiSementara.findUnique({
                        where: { ulid: id },
                });

                if (!cuti) return INVALID_ID_SERVICE_RESPONSE;

                // Get user's access level
                const aksesLevel = await prisma.aksesLevel.findUnique({
                        where: { id: user.aksesLevelId },
                });

                if (!aksesLevel) return BadRequestWithMessage("Akses level tidak ditemukan!");

                // Check authorization based on current status and user role
                const currentStatus = cuti.verifikasiStatus;
                let isAuthorized = false;

                if (currentStatus === VERIFICATION_STATUS.DIPROSES_OLEH_OPERATOR && aksesLevel.name === "OPERATOR_KEMAHASISWAAN") {
                        isAuthorized = true;
                } else if (currentStatus === VERIFICATION_STATUS.DIPROSES_OLEH_KASUBBAG && aksesLevel.name === "KASUBBAG_KEMAHASISWAAN") {
                        isAuthorized = true;
                }

                if (!isAuthorized) {
                        return BadRequestWithMessage("Anda tidak berwenang untuk memverifikasi cuti pada tahap ini!");
                }

                if (data.action === "DISETUJUI") {
                        if (currentStatus === VERIFICATION_STATUS.DIPROSES_OLEH_OPERATOR) {
                                await flowCreatingStatusVerification(currentStatus, id, user.nama, user.id, user.aksesLevelId, true);
                                await flowCreatingStatusVerification(VERIFICATION_STATUS.DISETUJUI_OLEH_OPERATOR, id, user.nama, user.id, user.aksesLevelId, true);
                        } else if (currentStatus === VERIFICATION_STATUS.DIPROSES_OLEH_KASUBBAG) {
                                await flowCreatingStatusVerification(currentStatus, id, user.nama, user.id, user.aksesLevelId, true);
                                await flowCreatingStatusVerification(VERIFICATION_STATUS.DISETUJUI_OLEH_KASUBBAG, id, user.nama, user.id, user.aksesLevelId, true);
                        }
                } else {
                        // Handle rejection
                        let nextStatus: string;
                        if (aksesLevel.name === "OPERATOR_KEMAHASISWAAN") {
                                nextStatus = VERIFICATION_STATUS.DITOLAK_OLEH_OPERATOR;
                        } else {
                                nextStatus = VERIFICATION_STATUS.DITOLAK_OLEH_KASUBBAG;
                        }

                        const statusDescription = `Cuti ditolak oleh ${user.nama} (${aksesLevel.name}): ${data.alasanPenolakan}`;

                        await prisma.cutiSementara.update({
                                where: { ulid: id },
                                data: {
                                        verifikasiStatus: nextStatus,
                                        alasanPenolakan: data.alasanPenolakan,
                                        status: {
                                                create: {
                                                        ulid: ulid(),
                                                        nama: nextStatus,
                                                        deskripsi: statusDescription,
                                                        userId: user.id,
                                                },
                                        },
                                },
                        });
                }

                // Get updated cuti
                const updateCuti = await prisma.cutiSementara.findUnique({
                        where: { ulid: id },
                        include: {
                                status: {
                                        orderBy: { createdAt: "asc" },
                                        include: {
                                                user: {
                                                        select: {
                                                                nama: true,
                                                                aksesLevel: true,
                                                        },
                                                },
                                        },
                                },
                        },
                });

                if (!updateCuti) return INVALID_ID_SERVICE_RESPONSE;

                // Create log entry
                await prisma.log.create({
                        data: {
                                ulid: ulid(),
                                flagMenu: "CUTI_SEMENTARA",
                                deskripsi: `Verifikasi cuti ID ${id}: ${data.action} oleh ${user.nama} (${aksesLevel.name})`,
                                aksesLevelId: user.aksesLevelId,
                                userId: user.id,
                        },
                });

                return {
                        status: true,
                        data: updateCuti,
                };
        } catch (error) {
                Logger.error(`CutiSementaraService.verificationStatus : ${error}`);
                return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
        }
}

export type UpdateResponse = CutiSementara | {};
export async function update(id: string, data: Partial<CutiSementaraDTO>): Promise<ServiceResponse<UpdateResponse>> {
        try {
                let cutiSementara = await prisma.cutiSementara.findUnique({
                        where: {
                                ulid: id,
                        },
                });

                if (!cutiSementara) return INVALID_ID_SERVICE_RESPONSE;

                if (!VERIFICATION_STATUS.DITOLAK_OLEH_OPERATOR || !VERIFICATION_STATUS.DITOLAK_OLEH_KASUBBAG)
                        return BadRequestWithMessage("Anda tidak dapat melakukan perubahan pada Pengajuan Cuti Sementara tidak ditolak!");

                cutiSementara = await prisma.cutiSementara.update({
                        where: {
                                ulid: id,
                        },
                        data: {
                                suratIzinOrangTuaUrl: data.suratIzinOrangTuaUrl,
                                suratBebasPustakaUrl: data.suratBebasPustakaUrl,
                                suratBssUrl: data.suratBssUrl,
                                alasanPengajuan: data.alasanPengajuan,
                        },
                });

                return {
                        status: true,
                        data: cutiSementara,
                };
        } catch (err) {
                Logger.error(`CutiSementaraService.update : ${err}`);
                return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
        }
}
