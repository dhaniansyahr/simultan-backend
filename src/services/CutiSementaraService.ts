import { FilteringQueryV2, PagedList } from "$entities/Query";
import {
    BadRequestWithMessage,
    INTERNAL_SERVER_ERROR_SERVICE_RESPONSE,
    INVALID_ID_SERVICE_RESPONSE,
    ServiceResponse,
} from "$entities/Service";
import Logger from "$pkg/logger";
import { prisma } from "$utils/prisma.utils";
import { CutiSementara, VerificationStatusKemahasiswaan } from "@prisma/client";
import { CutiSementaraDTO, VerifikasiCutiDTO } from "$entities/CutiSementara";
import { buildFilterQueryLimitOffsetV2 } from "./helpers/FilterQueryV2";
import { UserJWTDAO } from "$entities/User";
import { ulid } from "ulid";
import { getNextVerificationStatus } from "$utils/helper.utils";

export type CreateResponse = CutiSementara | {};
export async function create(data: CutiSementaraDTO, user: UserJWTDAO): Promise<ServiceResponse<CreateResponse>> {
    try {
        data.offerById = user.id;
        const status = await prisma.$transaction(async (trx) => {
            const cuti = await prisma.cutiSementara.create({
                data,
            });

            await trx.statusHistory.create({
                data: {
                    id: ulid(),
                    action: VerificationStatusKemahasiswaan.DIPROSES_OPERATOR_KEMAHASISWAAN,
                    cutiSementaraId: cuti.id,
                    description: VerificationStatusKemahasiswaan.DIPROSES_OPERATOR_KEMAHASISWAAN,
                    userId: user.id,
                },
            });

            return cuti;
        });

        return {
            status: true,
            data: status,
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

        const userLevel = await prisma.userLevel.findUnique({
            where: {
                id: user.userLevelId,
            },
        });

        if (!userLevel) return INVALID_ID_SERVICE_RESPONSE;

        if (userLevel.name === "MAHASISWA") {
            usedFilters.where.AND.push({
                offerById: user.id,
            });
        }

        // if (userLevel.name === "OPERATOR_KEMAHASISWAAN") {
        //     usedFilters.where.AND.push({
        //         statusHistory: {
        //             some: {
        //                 action: {
        //                     notIn: [
        //                         VerificationStatusKemahasiswaan.DISETUJUI_OPERATOR_KEMAHASISWAAN,
        //                         VerificationStatusKemahasiswaan.USULAN_DISETUJUI,
        //                     ],
        //                 },
        //             },
        //         },
        //     });
        // }

        // if (userLevel.name === "KASUBBAG_KEMAHASISWAAN") {
        //     usedFilters.where.AND.push({
        //         statusHistory: {
        //             some: {
        //                 action: {
        //                     not: VerificationStatusKemahasiswaan.DISETUJUI_KASUBBAG_KEMAHASISWAAN,
        //                 },
        //             },
        //         },
        //     });
        // }

        usedFilters.include = {
            statusHistory: {
                include: {
                    User: true,
                },
            },
            offerBy: {
                include: {
                    Mahasiswa: true,
                },
            },
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
            where: {
                id,
            },
            include: {
                offerBy: {
                    select: {
                        fullName: true,
                        email: true,
                    },
                },
                statusHistory: {
                    include: {
                        User: true,
                    },
                },
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

export async function verificationStatus(
    id: string,
    data: VerifikasiCutiDTO,
    user: UserJWTDAO
): Promise<ServiceResponse<{}>> {
    try {
        const verificationExist = await prisma.cutiSementara.findFirst({
            where: {
                statusHistory: {
                    some: {
                        userId: user.id,
                        action: {
                            in: [
                                VerificationStatusKemahasiswaan.USULAN_DISETUJUI,
                                VerificationStatusKemahasiswaan.USULAN_DITOLAK,
                            ],
                        },
                    },
                },
            },
        });

        if (verificationExist) return BadRequestWithMessage("Kamu Sudah Melakukan Verifikasi Pada Surat Ini!");

        let nextStatus: VerificationStatusKemahasiswaan = "DIPROSES_OPERATOR_KEMAHASISWAAN";
        if (data.action === VerificationStatusKemahasiswaan.USULAN_DISETUJUI) {
            nextStatus = getNextVerificationStatus(data.action as VerificationStatusKemahasiswaan);
        }

        await prisma.$transaction(async (prisma) => {
            await prisma.statusHistory.create({
                data: {
                    id: ulid(),
                    action: nextStatus,
                    description: `${nextStatus} oleh ${user.fullName}`,
                    userId: user.id,
                    cutiSementaraId: id,
                },
            });

            // Update the `reason` field if the status is `USULAN_DITOLAK`
            if (data.action === VerificationStatusKemahasiswaan.USULAN_DITOLAK) {
                await prisma.cutiSementara.update({
                    where: { id },
                    data: { rejectedReason: data.reason },
                });
            }
        });

        const cutiSementara = await prisma.cutiSementara.findUnique({
            where: {
                id,
            },
        });

        if (!cutiSementara) return INVALID_ID_SERVICE_RESPONSE;

        return {
            status: true,
            data: cutiSementara,
        };
    } catch (error) {
        Logger.error(`CutiSementaraService.verificationStatus : ${error}`);
        return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
}
