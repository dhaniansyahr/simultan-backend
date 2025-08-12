import { FilteringQueryV2, PagedList } from "$entities/Query";
import {
  BadRequestWithMessage,
  INTERNAL_SERVER_ERROR_SERVICE_RESPONSE,
  INVALID_ID_SERVICE_RESPONSE,
  ServiceResponse,
} from "$entities/Service";
import Logger from "$pkg/logger";
import { prisma } from "$utils/prisma.utils";
import { buildFilterQueryLimitOffsetV2 } from "./helpers/FilterQueryV2";
import { ulid } from "ulid";
import { UserJWTDAO } from "$entities/User";
import { VERIFICATION_STATUS } from "$utils/helper.utils";
import { flowCreatingStatusVeificationAkademik } from "./helpers/LogStatus";
import {
  RekomendasiBeasiswaDTO,
  VerifikasiRekomendasiBeasiswaDTO,
} from "$entities/RekomendasiBeasiswa";

export type CreateResponse = RekomendasiBeasiswaDTO | {};
export async function create(
  data: RekomendasiBeasiswaDTO,
  user: UserJWTDAO
): Promise<ServiceResponse<CreateResponse>> {
  try {
    // Create the letter with initial status
    const rekomendasiBeasiswa = await prisma.rekomendasiBeasiswa.create({
      data: {
        ulid: ulid(),
        tipeRekomendasi: data.tipeRekomendasi,
        deskripsi: data.deskripsi,
        institusiTujuan: data.institusiTujuan,
        dokumenPendukung: data.dokumenPendukung,
        verifikasiStatus: VERIFICATION_STATUS.DIPROSES_OPERATOR_AKADEMIK,
        userId: user.id,
        status: {
          create: {
            ulid: ulid(),
            nama: VERIFICATION_STATUS.DIPROSES_OPERATOR_AKADEMIK,
            deskripsi: `Pengajuan Rekomendasi Mahasiswa oleh ${user.nama} - menunggu verifikasi operator akademik`,
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
        flagMenu: "REKOMENDASI_MAHASISWA",
        deskripsi: `Pengajuan Rekomendasi Mahasiswa baru dengan ID ${rekomendasiBeasiswa.ulid}`,
        aksesLevelId: user.aksesLevelId,
        userId: user.id,
      },
    });

    return {
      status: true,
      data: rekomendasiBeasiswa,
    };
  } catch (err) {
    Logger.error(`rekomendasiBeasiswaService.create : ${err}`);
    return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
  }
}

export type GetAllResponse = PagedList<RekomendasiBeasiswaDTO[]> | {};
export async function getAll(
  filters: FilteringQueryV2,
  user: UserJWTDAO
): Promise<ServiceResponse<GetAllResponse>> {
  try {
    const usedFilters = buildFilterQueryLimitOffsetV2(filters);

    const aksesLevel = await prisma.aksesLevel.findUnique({
      where: { id: user.aksesLevelId },
    });

    if (!aksesLevel)
      return BadRequestWithMessage("Akses level tidak ditemukan");

    // For Mahasiswa
    if (aksesLevel.name === "MAHASISWA") {
      usedFilters.where.AND.push({
        userId: user.id,
      });
    }

    // Filter based on user role
    if (aksesLevel.name === "OPERATOR_AKADEMIK") {
      usedFilters.where.AND.push({
        OR: [
          { verifikasiStatus: VERIFICATION_STATUS.DIPROSES_OPERATOR_AKADEMIK },
          { verifikasiStatus: VERIFICATION_STATUS.DISETUJUI_OPERATOR_AKADEMIK },
          { verifikasiStatus: VERIFICATION_STATUS.DIPROSES_KASUBBAG_AKADEMIK },
          { verifikasiStatus: VERIFICATION_STATUS.DISETUJUI_KASUBBAG_AKADEMIK },
        ],
      });
    } else if (aksesLevel.name === "KASUBBAG_AKADEMIK") {
      usedFilters.where.AND.push({
        OR: [
          { verifikasiStatus: VERIFICATION_STATUS.DIPROSES_KASUBBAG_AKADEMIK },
          { verifikasiStatus: VERIFICATION_STATUS.DISETUJUI_KASUBBAG_AKADEMIK },
        ],
      });
    }

    // Include related user and status records
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
        orderBy: { createdAt: "asc" },
      },
    };

    usedFilters.orderBy = {
      createdAt: "asc",
    };

    const [rekomendasi, totalData] = await Promise.all([
      prisma.rekomendasiBeasiswa.findMany(usedFilters),
      prisma.rekomendasiBeasiswa.count({
        where: usedFilters.where,
      }),
    ]);

    let totalPage = 1;
    if (totalData > usedFilters.take)
      totalPage = Math.ceil(totalData / usedFilters.take);

    return {
      status: true,
      data: {
        entries: rekomendasi,
        totalData,
        totalPage,
      },
    };
  } catch (err) {
    Logger.error(`RekomendasiBeasiswaService.getAll : ${err}`);
    return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
  }
}

export type GetByIdResponse = RekomendasiBeasiswaDTO | {};
export async function getById(
  id: string,
  user: UserJWTDAO
): Promise<ServiceResponse<GetByIdResponse>> {
  try {
    const whereClauses: any = { ulid: id };

    // Add user filter for students
    const aksesLevel = await prisma.aksesLevel.findUnique({
      where: { id: user.aksesLevelId },
    });

    if (aksesLevel?.name === "MAHASISWA") {
      whereClauses.userId = user.id;
    }

    const rekomendasiBeasiswa = await prisma.rekomendasiBeasiswa.findFirst({
      where: whereClauses,
      include: {
        user: {
          select: {
            nama: true,
            npm: true,
          },
        },
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

    if (!rekomendasiBeasiswa) return INVALID_ID_SERVICE_RESPONSE;

    return {
      status: true,
      data: rekomendasiBeasiswa,
    };
  } catch (err) {
    Logger.error(`rekomendasiBeasiswaService.getById : ${err}`);
    return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
  }
}

export type UpdateResponse = RekomendasiBeasiswaDTO | {};
export async function update(
  id: string,
  data: Partial<RekomendasiBeasiswaDTO>,
  user: UserJWTDAO
): Promise<ServiceResponse<UpdateResponse>> {
  try {
    // Find existing recommendation
    let rekomendasiBeasiswa = await prisma.rekomendasiBeasiswa.findUnique({
      where: { ulid: id },
    });

    if (!rekomendasiBeasiswa) return INVALID_ID_SERVICE_RESPONSE;

    // Only the owner (student) can update
    if (rekomendasiBeasiswa.userId !== user.id) {
      return BadRequestWithMessage(
        "Anda tidak berwenang untuk mengubah rekomendasi ini!"
      );
    }

    // Only allow update if status is rejected
    const currentStatus = rekomendasiBeasiswa.verifikasiStatus;
    const canUpdate = currentStatus === VERIFICATION_STATUS.DITOLAK;

    if (!canUpdate) {
      return BadRequestWithMessage(
        "Tidak dapat melakukan perubahan pada rekomendasi yang sedang diproses atau sudah disetujui!"
      );
    }

    // Reset status to initial
    const resetStatus = VERIFICATION_STATUS.DIPROSES_OPERATOR_AKADEMIK;

    rekomendasiBeasiswa = await prisma.rekomendasiBeasiswa.update({
      where: { ulid: id },
      data: {
        ...data,
        verifikasiStatus: resetStatus,
        alasanPenolakan: null,
        status: {
          create: {
            ulid: ulid(),
            nama: resetStatus,
            deskripsi: `Rekomendasi mahasiswa diperbarui oleh ${user.nama} - menunggu verifikasi ulang dari operator akademik`,
            userId: user.id,
          },
        },
      },
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
        user: {
          select: {
            nama: true,
            npm: true,
          },
        },
      },
    });

    // Create log entry for update
    await prisma.log.create({
      data: {
        ulid: ulid(),
        flagMenu: "REKOMENDASI_MAHASISWA",
        deskripsi: `Pengajuan rekomendasi mahasiswa dengan ID ${id} diperbarui oleh ${user.nama} - status direset ke awal proses verifikasi`,
        aksesLevelId: user.aksesLevelId,
        userId: user.id,
      },
    });

    return {
      status: true,
      data: rekomendasiBeasiswa,
    };
  } catch (err) {
    Logger.error(`RekomendasiBeasiswaService.update : ${err}`);
    return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
  }
}

export type VerificationResponse = RekomendasiBeasiswaDTO | {};
export async function verificationStatus(
  id: string,
  data: VerifikasiRekomendasiBeasiswaDTO,
  user: UserJWTDAO
): Promise<ServiceResponse<VerificationResponse>> {
  try {
    const rekomendasiBeasiswa = await prisma.rekomendasiBeasiswa.findUnique({
      where: { ulid: id },
    });

    if (!rekomendasiBeasiswa) return INVALID_ID_SERVICE_RESPONSE;

    // Get user's access level
    const aksesLevel = await prisma.aksesLevel.findUnique({
      where: { id: user.aksesLevelId },
    });

    if (!aksesLevel)
      return BadRequestWithMessage("Akses level tidak ditemukan!");

    // Check authorization based on current status and user role
    const currentStatus = rekomendasiBeasiswa.verifikasiStatus;
    let isAuthorized = false;

    if (
      currentStatus === VERIFICATION_STATUS.DIPROSES_OPERATOR_AKADEMIK &&
      aksesLevel.name === "OPERATOR_AKADEMIK"
    ) {
      isAuthorized = true;
    } else if (
      currentStatus === VERIFICATION_STATUS.DIPROSES_KASUBBAG_AKADEMIK &&
      aksesLevel.name === "KASUBBAG_AKADEMIK"
    ) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      return BadRequestWithMessage(
        "Anda tidak berwenang untuk memverifikasi rekomendasi pada tahap ini!"
      );
    }

    if (data.action === "DISETUJUI") {
      if (currentStatus === VERIFICATION_STATUS.DIPROSES_OPERATOR_AKADEMIK) {
        await flowCreatingStatusVeificationAkademik(
          currentStatus,
          id,
          user.nama,
          user.id,
          false,
          true
        );
        await flowCreatingStatusVeificationAkademik(
          VERIFICATION_STATUS.DISETUJUI_OPERATOR_AKADEMIK,
          id,
          user.nama,
          user.id,
          false,
          true
        );
      } else if (
        currentStatus === VERIFICATION_STATUS.DIPROSES_KASUBBAG_AKADEMIK
      ) {
        await flowCreatingStatusVeificationAkademik(
          currentStatus,
          id,
          user.nama,
          user.id,
          false,
          true
        );
        await flowCreatingStatusVeificationAkademik(
          VERIFICATION_STATUS.DISETUJUI_KASUBBAG_AKADEMIK,
          id,
          user.nama,
          user.id,
          false,
          true
        );
      }
    } else {
      // Handle rejection
      let nextStatus: string;
      if (aksesLevel.name === "OPERATOR_AKADEMIK") {
        nextStatus = VERIFICATION_STATUS.DITOLAK;
      } else {
        nextStatus = VERIFICATION_STATUS.DITOLAK;
      }

      const statusDescription = `Rekomendasi ditolak oleh ${user.nama} (${aksesLevel.name}): ${data.alasanPenolakan}`;

      await prisma.rekomendasiBeasiswa.update({
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

    // Get updated recommendation
    const updatedRekomendasi = await prisma.rekomendasiBeasiswa.findUnique({
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
        user: {
          select: {
            nama: true,
            npm: true,
          },
        },
      },
    });

    if (!updatedRekomendasi) return INVALID_ID_SERVICE_RESPONSE;

    // Create log entry
    await prisma.log.create({
      data: {
        ulid: ulid(),
        flagMenu: "REKOMENDASI_MAHASISWA",
        deskripsi: `Verifikasi rekomendasi ID ${id}: ${data.action} oleh ${user.nama} (${aksesLevel.name})`,
        aksesLevelId: user.aksesLevelId,
        userId: user.id,
      },
    });

    return {
      status: true,
      data: updatedRekomendasi,
    };
  } catch (error) {
    Logger.error(`RekomendasiBeasiswaService.verificationStatus : ${error}`);
    return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
  }
}
