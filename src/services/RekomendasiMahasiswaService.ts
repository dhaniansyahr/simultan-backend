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
import {
  VERIFICATION_STATUS,
  getNextVerificationStatus,
} from "$utils/helper.utils";
import {
  RekomendasiMahasiswaDTO,
  VerifikasiRekomendasiMahasiswaDTO,
  UpdateNomorSuratRekomendasiMahasiswaDTO,
} from "$entities/RekomendasiMahasiswa";

export type CreateResponse = RekomendasiMahasiswaDTO | {};
export async function create(
  data: RekomendasiMahasiswaDTO,
  user: UserJWTDAO
): Promise<ServiceResponse<CreateResponse>> {
  try {
    // Create the letter with initial status
    const rekomendasiMahasiswa = await prisma.rekomendasiMahasiswa.create({
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
        deskripsi: `Pengajuan Rekomendasi Mahasiswa baru dengan ID ${rekomendasiMahasiswa.ulid}`,
        aksesLevelId: user.aksesLevelId,
        userId: user.id,
      },
    });

    return {
      status: true,
      data: rekomendasiMahasiswa,
    };
  } catch (err) {
    Logger.error(`RekomendasiMahasiswaService.create : ${err}`);
    return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
  }
}

export type GetAllResponse = PagedList<RekomendasiMahasiswaDTO[]> | {};
export async function getAll(
  filters: FilteringQueryV2,
  user: UserJWTDAO
): Promise<ServiceResponse<GetAllResponse>> {
  try {
    const { limit, offset, whereClauses } =
      buildFilterQueryLimitOffsetV2(filters);

    // Add user filter for students
    const aksesLevel = await prisma.aksesLevel.findUnique({
      where: { id: user.aksesLevelId },
    });

    if (aksesLevel?.name === "MAHASISWA") {
      whereClauses.userId = user.id;
    }

    const [data, total] = await Promise.all([
      prisma.rekomendasiMahasiswa.findMany({
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
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.rekomendasiMahasiswa.count({ where: whereClauses }),
    ]);

    const result: PagedList<RekomendasiMahasiswaDTO[]> = {
      entries: data as any,
      totalData: total,
      totalPage: Math.ceil(total / limit),
    };

    return {
      status: true,
      data: result,
    };
  } catch (err) {
    Logger.error(`RekomendasiMahasiswaService.getAll : ${err}`);
    return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
  }
}

export type GetByIdResponse = RekomendasiMahasiswaDTO | {};
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

    const rekomendasiMahasiswa = await prisma.rekomendasiMahasiswa.findFirst({
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

    if (!rekomendasiMahasiswa) return INVALID_ID_SERVICE_RESPONSE;

    return {
      status: true,
      data: rekomendasiMahasiswa,
    };
  } catch (err) {
    Logger.error(`RekomendasiMahasiswaService.getById : ${err}`);
    return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
  }
}

export type UpdateResponse = RekomendasiMahasiswaDTO | {};
export async function update(
  id: string,
  data: RekomendasiMahasiswaDTO,
  user: UserJWTDAO
): Promise<ServiceResponse<UpdateResponse>> {
  try {
    // Find existing letter
    let rekomendasiMahasiswa = await prisma.rekomendasiMahasiswa.findUnique({
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

    if (!rekomendasiMahasiswa) return INVALID_ID_SERVICE_RESPONSE;

    // Check if user owns this letter (for students)
    const aksesLevel = await prisma.aksesLevel.findUnique({
      where: { id: user.aksesLevelId },
    });

    if (
      aksesLevel?.name === "MAHASISWA" &&
      rekomendasiMahasiswa.userId !== user.id
    ) {
      return BadRequestWithMessage(
        "Anda tidak memiliki akses untuk mengubah rekomendasi ini!"
      );
    }

    // Check if letter can be updated
    if (
      rekomendasiMahasiswa.verifikasiStatus === VERIFICATION_STATUS.DISETUJUI
    ) {
      return BadRequestWithMessage(
        "Rekomendasi yang sudah disetujui tidak dapat diubah!"
      );
    }

    // Reset status to initial
    const resetStatus = VERIFICATION_STATUS.DIPROSES_OPERATOR_AKADEMIK;

    // Update the letter
    rekomendasiMahasiswa = await prisma.rekomendasiMahasiswa.update({
      where: { ulid: id },
      data: {
        tipeRekomendasi:
          data.tipeRekomendasi ?? rekomendasiMahasiswa.tipeRekomendasi,
        deskripsi: data.deskripsi ?? rekomendasiMahasiswa.deskripsi,
        institusiTujuan:
          data.institusiTujuan ?? rekomendasiMahasiswa.institusiTujuan,
        dokumenPendukung:
          data.dokumenPendukung ?? rekomendasiMahasiswa.dokumenPendukung,
        verifikasiStatus: resetStatus,
        alasanPenolakan: null, // Clear rejection reason
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
      },
    });

    return {
      status: true,
      data: rekomendasiMahasiswa,
    };
  } catch (err) {
    Logger.error(`RekomendasiMahasiswaService.update : ${err}`);
    return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
  }
}

export type VerificationResponse = RekomendasiMahasiswaDTO | {};
export async function verification(
  id: string,
  data: VerifikasiRekomendasiMahasiswaDTO,
  user: UserJWTDAO
): Promise<ServiceResponse<VerificationResponse>> {
  try {
    const rekomendasiMahasiswa = await prisma.rekomendasiMahasiswa.findUnique({
      where: { ulid: id },
      include: {
        user: {
          select: {
            nama: true,
            npm: true,
          },
        },
        status: true,
      },
    });

    if (!rekomendasiMahasiswa) return INVALID_ID_SERVICE_RESPONSE;

    // Get current verification status
    const currentStatus = rekomendasiMahasiswa.verifikasiStatus;

    // Check if the letter is already processed
    if (currentStatus === VERIFICATION_STATUS.DISETUJUI) {
      return BadRequestWithMessage("Rekomendasi sudah disetujui!");
    } else if (
      currentStatus === VERIFICATION_STATUS.DITOLAK_OLEH_OPERATOR ||
      currentStatus === VERIFICATION_STATUS.DITOLAK_OLEH_KASUBBAG
    ) {
      return BadRequestWithMessage("Rekomendasi sudah ditolak!");
    }

    let newStatus: string;
    let statusDescription: string;

    if (data.action === "DISETUJUI") {
      // Get next status in workflow
      newStatus = getNextVerificationStatus(currentStatus);
      statusDescription = `Rekomendasi disetujui oleh ${user.nama}`;
    } else {
      // Rejected
      const userAksesLevel = await prisma.aksesLevel.findUnique({
        where: { id: user.aksesLevelId },
      });

      if (userAksesLevel?.name === "OPERATOR_AKADEMIK") {
        newStatus = VERIFICATION_STATUS.DITOLAK_OLEH_OPERATOR;
      } else {
        newStatus = VERIFICATION_STATUS.DITOLAK_OLEH_KASUBBAG;
      }
      statusDescription = `Rekomendasi ditolak oleh ${user.nama}${
        data.alasanPenolakan ? `: ${data.alasanPenolakan}` : ""
      }`;
    }

    // Update the letter with new status
    const updatedRekomendasi = await prisma.rekomendasiMahasiswa.update({
      where: { ulid: id },
      data: {
        verifikasiStatus: newStatus,
        alasanPenolakan:
          data.action === "DITOLAK" ? data.alasanPenolakan : null,
        status: {
          create: {
            ulid: ulid(),
            nama: newStatus,
            deskripsi: statusDescription,
            userId: user.id,
          },
        },
      },
      include: {
        status: true,
      },
    });

    return {
      status: true,
      data: updatedRekomendasi,
    };
  } catch (error) {
    Logger.error(`RekomendasiMahasiswaService.verification : ${error}`);
    return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
  }
}

export type UpdateNomorSuratResponse = RekomendasiMahasiswaDTO | {};
export async function updateNomorSurat(
  id: string,
  data: UpdateNomorSuratRekomendasiMahasiswaDTO,
  user: UserJWTDAO
): Promise<ServiceResponse<UpdateNomorSuratResponse>> {
  try {
    const rekomendasiMahasiswa = await prisma.rekomendasiMahasiswa.findUnique({
      where: { ulid: id },
      include: {
        user: {
          select: {
            nama: true,
            npm: true,
          },
        },
        status: true,
      },
    });

    if (!rekomendasiMahasiswa) return INVALID_ID_SERVICE_RESPONSE;

    // Get current verification status
    const currentStatus = rekomendasiMahasiswa.verifikasiStatus;

    // Check if the letter is already processed
    if (currentStatus === VERIFICATION_STATUS.DISETUJUI) {
      return BadRequestWithMessage("Rekomendasi sudah diproses!");
    } else if (
      currentStatus === VERIFICATION_STATUS.DITOLAK_OLEH_OPERATOR ||
      currentStatus === VERIFICATION_STATUS.DITOLAK_OLEH_KASUBBAG
    ) {
      return BadRequestWithMessage(
        "Rekomendasi ditolak, Mohon periksa alasan penolakan dan ajukan rekomendasi baru!"
      );
    }

    if (currentStatus !== VERIFICATION_STATUS.SEDANG_INPUT_NOMOR_SURAT) {
      return BadRequestWithMessage(
        "Nomor surat hanya dapat ditambahkan ketika status SEDANG INPUT NOMOR SURAT!"
      );
    }

    // Get the next status
    const nextStatus = getNextVerificationStatus(currentStatus);

    // Update the letter with new status
    const updatedRekomendasi = await prisma.rekomendasiMahasiswa.update({
      where: { ulid: id },
      data: {
        verifikasiStatus: nextStatus,
        nomorSurat: data.nomorSurat,
        status: {
          create: {
            ulid: ulid(),
            nama: nextStatus,
            deskripsi: `Rekomendasi diproses oleh ${user.nama}`,
            userId: user.id,
          },
        },
      },
      include: {
        status: true,
      },
    });

    return {
      status: true,
      data: updatedRekomendasi,
    };
  } catch (error) {
    Logger.error(`RekomendasiMahasiswaService.updateNomorSurat : ${error}`);
    return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
  }
}
