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
  flowCreatingStatusVerification,
} from "$utils/helper.utils";
import {
  SuratKeteranganLulusDTO,
  LetterProcessDTO,
  VerifikasiSuratKeteranganLulusDTO,
  UpdateNomorSuratSuratKeteranganLulusDTO,
} from "$entities/SuratKeteranganLulus";
import { buildBufferPDF } from "$utils/buffer.utils";
import { DateTime } from "luxon";
import { getCurrentAcademicInfo } from "$utils/strings.utils";
// import { SuratKeteranganLulus } from "@prisma/client";

export type CreateResponse = SuratKeteranganLulusDTO | {};
export async function create(
  data: SuratKeteranganLulusDTO,
  user: UserJWTDAO
): Promise<ServiceResponse<CreateResponse>> {
  try {
    // Check if user is a student
    // Check if user is a student (MAHASISWA)
    const aksesLevel = await prisma.aksesLevel.findUnique({
      where: { id: user.aksesLevelId },
    });

    if (!aksesLevel || aksesLevel.name !== "MAHASISWA") {
      return BadRequestWithMessage(
        "Hanya mahasiswa yang dapat mengajukan surat keterangan kuliah!"
      );
    }

    // Create the letter with initial status
    const suratKeteranganLulus = await prisma.suratKeteranganLulus.create({
      data: {
        ulid: ulid(),
        tipeSurat: data.tipeSurat,
        deskripsi: data.deskripsi,
        dokumenTranskrip: data.dokumenTranskrip,
        verifikasiStatus: VERIFICATION_STATUS.DIPROSES_OLEH_OPERATOR,
        userId: user.id,
        status: {
          create: {
            ulid: ulid(),
            nama: VERIFICATION_STATUS.DIPROSES_OLEH_OPERATOR,
            deskripsi: `Pengajuan Surat Keterangan Lulus oleh ${user.nama} - menunggu verifikasi operator kemahasiswaan`,
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
        flagMenu: "SURAT_KETERANGAN_LULUS",
        deskripsi: `Pengajuan Surat Keterangan Lulus baru dengan ID ${suratKeteranganLulus.ulid}`,
        aksesLevelId: user.aksesLevelId,
        userId: user.id,
      },
    });

    return {
      status: true,
      data: suratKeteranganLulus,
    };
  } catch (err) {
    Logger.error(`SuratKeteranganLulusService.create : ${err}`);
    return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
  }
}

export type GetAllResponse = PagedList<SuratKeteranganLulusDTO[]> | {};
export async function getAll(
    filters: FilteringQueryV2,
    user: UserJWTDAO
): Promise<ServiceResponse<GetAllResponse>> {
    try {
        const usedFilters = buildFilterQueryLimitOffsetV2(filters);

        const aksesLevel = await prisma.aksesLevel.findUnique({
            where: {
                id: user.aksesLevelId,
            },
        });

        if (!aksesLevel)
            return BadRequestWithMessage("Akses Level tidak ditemukan!");

        // For students, only show their own letters
        if (aksesLevel.name === "MAHASISWA") {
            usedFilters.where.AND.push({
                userId: user.id,
            });
        }

        // Filter based on user role
        if (aksesLevel.name === "OPERATOR_KEMAHASISWAAN") {
            // Operator sees: letters waiting for their action + letters waiting for letter number input
            usedFilters.where.AND.push({
                OR: [
                    { verifikasiStatus: VERIFICATION_STATUS.DIPROSES_OLEH_OPERATOR },
                    { verifikasiStatus: VERIFICATION_STATUS.SEDANG_INPUT_NOMOR_SURAT },
                ],
            });
        } else if (aksesLevel.name === "KASUBBAG_KEMAHASISWAAN") {
            // Kasubbag sees: letters waiting for their verification
            usedFilters.where.AND.push({
                verifikasiStatus: VERIFICATION_STATUS.DIPROSES_OLEH_KASUBBAG,
            });
        }

        // Modified include to get all related status records
        usedFilters.include = {
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
                            aksesLevel: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    },
                },
            },
        };

        usedFilters.orderBy = {
            createdAt: "asc",
        };

        // First, get all surat records
        const [suratKeteranganLulus, totalData] = await Promise.all([
            prisma.suratKeteranganLulus.findMany(usedFilters),
            prisma.suratKeteranganLulus.count({
                where: usedFilters.where,
            }),
        ]);

        let totalPage = 1;
        if (totalData > usedFilters.take)
            totalPage = Math.ceil(totalData / usedFilters.take);

        // Add additional metadata for each letter
        const entriesWithMetadata = suratKeteranganLulus.map((surat) => {
            const suratWithStatus = surat as typeof surat & { status: any[] };
            return {
                ...surat,
                statusCount: suratWithStatus.status.length,
                latestStatus: suratWithStatus.status[suratWithStatus.status.length - 1],
                isActive: ![
                    VERIFICATION_STATUS.DISETUJUI,
                    VERIFICATION_STATUS.DITOLAK_OLEH_OPERATOR,
                    VERIFICATION_STATUS.DITOLAK_OLEH_KASUBBAG,
                ].includes(surat.verifikasiStatus as any),
                canBeUpdated: [
                    VERIFICATION_STATUS.DITOLAK_OLEH_OPERATOR,
                    VERIFICATION_STATUS.DITOLAK_OLEH_KASUBBAG,
                    VERIFICATION_STATUS.DIPROSES_OLEH_OPERATOR,
                ].includes(surat.verifikasiStatus as any),
            };
        });

        return {
            status: true,
            data: {
                entries: entriesWithMetadata,
                totalData,
                totalPage,
            },
        };
    } catch (err) {
        Logger.error(`SuratKeteranganLulusService.getAll : ${err} `);
        return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
}

export type GetAllHistoryLulusResponse =
  | PagedList<SuratKeteranganLulusDTO[]>
  | {};

export async function getAllHistory(
  filters: FilteringQueryV2,
  user: UserJWTDAO
): Promise<ServiceResponse<GetAllHistoryLulusResponse>> {
  try {
    const usedFilters = buildFilterQueryLimitOffsetV2(filters);

    const aksesLevel = await prisma.aksesLevel.findUnique({
      where: {
        id: user.aksesLevelId,
      },
    });

    if (!aksesLevel)
      return BadRequestWithMessage("Akses Level tidak ditemukan!");

    // Only KASUBBAG_KEMAHASISWAAN and OPERATOR_KEMAHASISWAAN can access history
    if (
      aksesLevel.name !== "KASUBBAG_KEMAHASISWAAN" &&
      aksesLevel.name !== "OPERATOR_KEMAHASISWAAN"
    ) {
      return BadRequestWithMessage(
        "Anda tidak memiliki akses untuk melihat history surat keterangan lulus!"
      );
    }

    // Include all related data for comprehensive history
    usedFilters.include = {
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
              aksesLevel: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    };

    // Order by creation date (newest first for history view)
    usedFilters.orderBy = {
      createdAt: "desc",
    };

    // Get all surat records
    const [suratKeteranganLulus, totalData] = await Promise.all([
      prisma.suratKeteranganLulus.findMany(usedFilters),
      prisma.suratKeteranganLulus.count({
        where: usedFilters.where,
      }),
    ]);

    let totalPage = 1;
    if (totalData > usedFilters.take)
      totalPage = Math.ceil(totalData / usedFilters.take);

    // Add additional metadata for each letter in history
    const historyWithMetadata = suratKeteranganLulus.map((surat) => {
      const suratWithStatus = surat as typeof surat & { status: any[] };
      return {
        ...surat,
        statusCount: suratWithStatus.status.length,
        latestStatus: suratWithStatus.status[suratWithStatus.status.length - 1],
        isActive: ![
          VERIFICATION_STATUS.DISETUJUI,
          VERIFICATION_STATUS.DITOLAK_OLEH_OPERATOR,
          VERIFICATION_STATUS.DITOLAK_OLEH_KASUBBAG,
        ].includes(surat.verifikasiStatus as any),
        canBeUpdated: [
          VERIFICATION_STATUS.DITOLAK_OLEH_OPERATOR,
          VERIFICATION_STATUS.DITOLAK_OLEH_KASUBBAG,
          VERIFICATION_STATUS.DIPROSES_OLEH_OPERATOR,
        ].includes(surat.verifikasiStatus as any),
      };
    });

    // Create log entry for history access
    await prisma.log.create({
      data: {
        ulid: ulid(),
        flagMenu: "SURAT_KETERANGAN_LULUS",
        deskripsi: `History pengajuan surat keterangan lulus diakses oleh ${user.nama} (${aksesLevel.name})`,
        aksesLevelId: user.aksesLevelId,
        userId: user.id,
      },
    });

    return {
      status: true,
      data: {
        entries: historyWithMetadata,
        totalData,
        totalPage,
        summary: {
          totalPengajuan: totalData,
          disetujui: historyWithMetadata.filter(
            (s) => s.verifikasiStatus === VERIFICATION_STATUS.DISETUJUI
          ).length,
          ditolak: historyWithMetadata.filter(
            (s) =>
              s.verifikasiStatus ===
                VERIFICATION_STATUS.DITOLAK_OLEH_OPERATOR ||
              s.verifikasiStatus === VERIFICATION_STATUS.DITOLAK_OLEH_KASUBBAG
          ).length,
          sedangDiproses: historyWithMetadata.filter((s) => s.isActive).length,
        },
      },
    };
  } catch (err) {
    Logger.error(`SuratKeteranganLulusService.getAllHistory : ${err}`);
    return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
  }
}

export type GetByIdResponse = SuratKeteranganLulusDTO | {};
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

    const suratKeteranganLulus = await prisma.suratKeteranganLulus.findFirst({
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

    if (!suratKeteranganLulus) return INVALID_ID_SERVICE_RESPONSE;

    return {
      status: true,
      data: suratKeteranganLulus,
    };
  } catch (err) {
    Logger.error(`SuratKeteranganLulusService.getById : ${err}`);
    return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
  }
}

export type UpdateResponse = SuratKeteranganLulusDTO | {};
export async function update(
  id: string,
  data: Partial<SuratKeteranganLulusDTO>,
  user: UserJWTDAO
): Promise<ServiceResponse<UpdateResponse>> {
  try {
    let suratKeteranganLulus = await prisma.suratKeteranganLulus.findUnique({
      where: { ulid: id },
    });

    if (!suratKeteranganLulus) return INVALID_ID_SERVICE_RESPONSE;

    // Only the student who created the letter can update
    if (suratKeteranganLulus.userId !== user.id) {
      return BadRequestWithMessage(
        "Anda tidak berwenang untuk mengubah surat ini!"
      );
    }

    // Only allow update if status is rejected or still in process by operator
    const currentStatus = suratKeteranganLulus.verifikasiStatus;
    const canUpdate =
      currentStatus === VERIFICATION_STATUS.DITOLAK_OLEH_OPERATOR ||
      currentStatus === VERIFICATION_STATUS.DITOLAK_OLEH_KASUBBAG ||
      currentStatus === VERIFICATION_STATUS.DIPROSES_OLEH_OPERATOR;

    if (!canUpdate) {
      return BadRequestWithMessage("Surat tidak dapat diubah pada status ini!");
    }

    // Reset status to initial state when updating
    const resetStatus = VERIFICATION_STATUS.DIPROSES_OLEH_OPERATOR;

    suratKeteranganLulus = await prisma.suratKeteranganLulus.update({
      where: { ulid: id },
      data: {
        ...data,
        verifikasiStatus: resetStatus,
        alasanPenolakan: suratKeteranganLulus.alasanPenolakan,
        status: {
          create: {
            ulid: ulid(),
            nama: resetStatus,
            deskripsi: `Surat diperbarui oleh ${user.nama} - menunggu verifikasi ulang dari operator kemahasiswaan`,
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

    // Create log entry for update
    await prisma.log.create({
      data: {
        ulid: ulid(),
        flagMenu: "SURAT_KETERANGAN_LULUS",
        deskripsi: `Surat dengan ID ${id} diperbarui oleh ${user.nama} - status direset ke awal proses verifikasi`,
        aksesLevelId: user.aksesLevelId,
        userId: user.id,
      },
    });

    return {
      status: true,
      data: suratKeteranganLulus,
    };
  } catch (err) {
    Logger.error(`SuratKeteranganLulusService.update : ${err}`);
    return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
  }
}

export type VerificationSuratLulusResponse = SuratKeteranganLulusDTO | {};
export async function verificationStatus(
  id: string,
  data: VerifikasiSuratKeteranganLulusDTO,
  user: UserJWTDAO
): Promise<ServiceResponse<VerificationSuratLulusResponse>> {
  try {
    const surat = await prisma.suratKeteranganLulus.findUnique({
      where: { ulid: id },
    });

    if (!surat) return INVALID_ID_SERVICE_RESPONSE;

    // Get user's access level
    const aksesLevel = await prisma.aksesLevel.findUnique({
      where: { id: user.aksesLevelId },
    });

    if (!aksesLevel)
      return BadRequestWithMessage("Akses level tidak ditemukan!");

    // Check authorization based on current status and user role
    const currentStatus = surat.verifikasiStatus;
    let isAuthorized = false;

    if (
      currentStatus === VERIFICATION_STATUS.DIPROSES_OLEH_OPERATOR &&
      aksesLevel.name === "OPERATOR_KEMAHASISWAAN"
    ) {
      isAuthorized = true;
    } else if (
      currentStatus === VERIFICATION_STATUS.DIPROSES_OLEH_KASUBBAG &&
      aksesLevel.name === "KASUBBAG_KEMAHASISWAAN"
    ) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      return BadRequestWithMessage(
        "Anda tidak berwenang untuk memverifikasi surat pada tahap ini!"
      );
    }

    if (data.action === "DISETUJUI") {
      if (currentStatus === VERIFICATION_STATUS.DIPROSES_OLEH_OPERATOR) {
        await flowCreatingStatusVerification(
          currentStatus,
          id,
          user.nama,
          user.id,
          user.aksesLevelId,
          false,
          true
        );
        await flowCreatingStatusVerification(
          VERIFICATION_STATUS.DISETUJUI_OLEH_OPERATOR,
          id,
          user.nama,
          user.id,
          user.aksesLevelId,
          false,
          true
        );
      } else if (currentStatus === VERIFICATION_STATUS.DIPROSES_OLEH_KASUBBAG) {
        await flowCreatingStatusVerification(
          currentStatus,
          id,
          user.nama,
          user.id,
          user.aksesLevelId,
          false,
          true
        );
        await flowCreatingStatusVerification(
          VERIFICATION_STATUS.DISETUJUI_OLEH_KASUBBAG,
          id,
          user.nama,
          user.id,
          user.aksesLevelId,
          false,
          true
        );
      }
    } else {
      // Handle rejection
      let nextStatus: string;
      if (aksesLevel.name === "OPERATOR_KEMAHASISWAAN") {
        nextStatus = VERIFICATION_STATUS.DITOLAK_OLEH_OPERATOR;
      } else {
        nextStatus = VERIFICATION_STATUS.DITOLAK_OLEH_KASUBBAG;
      }

      const statusDescription = `Surat ditolak oleh ${user.nama} (${aksesLevel.name}): ${data.alasanPenolakan}`;

      await prisma.suratKeteranganLulus.update({
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

    // Get updated surat
    const updatedSurat = await prisma.suratKeteranganLulus.findUnique({
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

    if (!updatedSurat) return INVALID_ID_SERVICE_RESPONSE;

    // Create log entry
    await prisma.log.create({
      data: {
        ulid: ulid(),
        flagMenu: "SURAT_KETERANGAN_LULUS",
        deskripsi: `Verifikasi surat ID ${id}: ${data.action} oleh ${user.nama} (${aksesLevel.name})`,
        aksesLevelId: user.aksesLevelId,
        userId: user.id,
      },
    });

    return {
      status: true,
      data: updatedSurat,
    };
  } catch (error) {
    Logger.error(`SuratKeteranganLulusService.verificationStatus : ${error}`);
    return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
  }
}

// Input nomor surat untuk Surat Keterangan Lulus
export async function letterProcess(
  id: string,
  user: UserJWTDAO,
  data: LetterProcessDTO
): Promise<ServiceResponse<{}>> {
  try {
    const suratKeteranganLulus = await prisma.suratKeteranganLulus.findUnique({
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

    if (!suratKeteranganLulus) return INVALID_ID_SERVICE_RESPONSE;

    // Get user's access level
    const aksesLevel = await prisma.aksesLevel.findUnique({
      where: { id: user.aksesLevelId },
    });

    if (!aksesLevel)
      return BadRequestWithMessage("Akses level tidak ditemukan!");

    // Check if user is authorized to input nomor surat (only OPERATOR_KEMAHASISWAAN)
    if (aksesLevel.name !== "OPERATOR_KEMAHASISWAAN") {
      return BadRequestWithMessage(
        "Hanya Operator Kemahasiswaan yang dapat melakukan input nomor surat!"
      );
    }

    // Get current verification status
    const currentStatus = suratKeteranganLulus.verifikasiStatus;

    // Check if the letter is already processed
    if (currentStatus === VERIFICATION_STATUS.DISETUJUI) {
      return BadRequestWithMessage("Surat sudah diproses!");
    } else if (
      currentStatus === VERIFICATION_STATUS.DITOLAK_OLEH_OPERATOR ||
      currentStatus === VERIFICATION_STATUS.DITOLAK_OLEH_KASUBBAG
    ) {
      return BadRequestWithMessage(
        "Surat ditolak, Mohon periksa alasan penolakan dan ajukan surat baru!"
      );
    }

    if (currentStatus !== VERIFICATION_STATUS.SEDANG_INPUT_NOMOR_SURAT) {
      return BadRequestWithMessage(
        "Nomor surat hanya dapat ditambahkan ketika status SEDANG INPUT NOMOR SURAT!"
      );
    }

    // Get the next status
    const nextStatus = getNextVerificationStatus(currentStatus);

    // Update the letter with new status and nomorSurat
    const updatedSurat = await prisma.suratKeteranganLulus.update({
      where: { ulid: id },
      data: {
        verifikasiStatus: nextStatus,
        nomorSurat: data.nomorSurat,
        status: {
          create: {
            ulid: ulid(),
            nama: nextStatus,
            deskripsi: `Surat diproses oleh ${user.nama} (Operator Kemahasiswaan)`,
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
        flagMenu: "SURAT_KETERANGAN_LULUS",
        deskripsi: `Nomor surat diinput oleh ${user.nama} (Operator Kemahasiswaan)`,
        aksesLevelId: user.aksesLevelId,
        userId: user.id,
      },
    });

    // Additional log entry for final DISETUJUI status
    if (
      nextStatus === VERIFICATION_STATUS.DISETUJUI ||
      nextStatus === VERIFICATION_STATUS.DISETUJUI_OLEH_OPERATOR ||
      nextStatus === VERIFICATION_STATUS.DISETUJUI_OLEH_KASUBBAG
    ) {
      await prisma.log.create({
        data: {
          ulid: ulid(),
          flagMenu: "SURAT_KETERANGAN_LULUS",
          deskripsi: `Surat Keterangan Lulus dengan ID ${id} DISETUJUI setelah input nomor surat oleh ${user.nama} (Operator Kemahasiswaan)`,
          aksesLevelId: user.aksesLevelId,
          userId: user.id,
        },
      });
    }

    return {
      status: true,
      data: updatedSurat,
    };
  } catch (error) {
    Logger.error(`SuratKeteranganLulusService.letterProcess : ${error}`);
    return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
  }
}

export type UpdateNomorSuratResponse = SuratKeteranganLulusDTO | {};
export async function updateNomorSurat(
  id: string,
  data: UpdateNomorSuratSuratKeteranganLulusDTO,
  user: UserJWTDAO
): Promise<ServiceResponse<UpdateNomorSuratResponse>> {
  try {
    const surat = await prisma.suratKeteranganLulus.findUnique({
      where: { ulid: id },
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

    if (!surat) return INVALID_ID_SERVICE_RESPONSE;

    // Get user's access level
    const aksesLevel = await prisma.aksesLevel.findUnique({
      where: { id: user.aksesLevelId },
    });

    if (!aksesLevel)
      return BadRequestWithMessage("Akses level tidak ditemukan!");

    // Check authorization based on current status and user role for nomor surat update
    const currentStatus = surat.verifikasiStatus;
    let isAuthorized = false;

    // Only allow update if status is DISETUJUI and user is OPERATOR or KASUBBAG
    if (
      currentStatus === VERIFICATION_STATUS.DISETUJUI &&
      (aksesLevel.name === "OPERATOR_KEMAHASISWAAN" ||
        aksesLevel.name === "KASUBBAG_KEMAHASISWAAN")
    ) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      return BadRequestWithMessage(
        "Anda tidak berwenang untuk mengubah nomor surat pada tahap ini! Hanya Operator Kemahasiswaan dan Kasubbag Kemahasiswaan yang dapat mengubah nomor surat."
      );
    }

    // Check if surat already has nomor surat
    const oldNomorSurat = surat.nomorSurat;

    // Update the letter with new nomor surat
    const updatedSurat = await prisma.suratKeteranganLulus.update({
      where: { ulid: id },
      data: {
        nomorSurat: data.nomorSurat.trim(),
        status: {
          create: {
            ulid: ulid(),
            nama: currentStatus,
            deskripsi: oldNomorSurat
              ? `Nomor surat diubah oleh ${user.nama} (${
                  aksesLevel.name
                }) dari "${oldNomorSurat}" menjadi "${data.nomorSurat.trim()}"`
              : `Nomor surat ditambahkan oleh ${user.nama} (${
                  aksesLevel.name
                }): "${data.nomorSurat.trim()}"`,
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

    // Create log entry
    await prisma.log.create({
      data: {
        ulid: ulid(),
        flagMenu: "SURAT_KETERANGAN_LULUS",
        deskripsi: oldNomorSurat
          ? `Nomor surat Surat Keterangan Lulus dengan ID ${id} diubah oleh ${
              user.nama
            } (${
              aksesLevel.name
            }) dari "${oldNomorSurat}" menjadi "${data.nomorSurat.trim()}"`
          : `Nomor surat Surat Keterangan Lulus dengan ID ${id} ditambahkan oleh ${
              user.nama
            } (${aksesLevel.name}): "${data.nomorSurat.trim()}"`,
        aksesLevelId: user.aksesLevelId,
        userId: user.id,
      },
    });

    return {
      status: true,
      data: updatedSurat,
    };
  } catch (error) {
    Logger.error(`SuratKeteranganLulusService.updateNomorSurat : ${error}`);
    return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
  }
}

// cetak surat keterangan lulus

export async function cetakSurat(
    id: string,
    user: UserJWTDAO
): Promise<ServiceResponse<any>> {
    try {
        const suratKeteranganLulus = await prisma.suratKeteranganLulus.findUnique({
            where: {
                ulid: id,
                verifikasiStatus: VERIFICATION_STATUS.DISETUJUI,
            },
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

        if (!suratKeteranganLulus) {
            return BadRequestWithMessage("Surat tidak ditemukan atau belum disetujui!");
        }

        const pdfData = {
            title: "SURAT KETERANGAN LULUS",
            data: {
                ...suratKeteranganLulus,
                nama: suratKeteranganLulus.user.nama,
                npm: suratKeteranganLulus.user.npm,
                tipeSurat: suratKeteranganLulus.tipeSurat,
                deskripsi: suratKeteranganLulus.deskripsi,
                nomorSurat: suratKeteranganLulus.nomorSurat,
            },
            date: DateTime.now().toFormat("dd MMMM yyyy"),
            ...getCurrentAcademicInfo(),
        };

        const buffer = await buildBufferPDF("surat-keterangan-lulus", pdfData);
        const fileName = `Surat-Keterangan-Lulus-${suratKeteranganLulus.user.npm}`;

        // Create log entry for printing
        await prisma.log.create({
            data: {
                ulid: ulid(),
                flagMenu: "SURAT_KETERANGAN_LULUS",
                deskripsi: `Surat dengan ID ${id} dicetak oleh ${user.nama}`,
                aksesLevelId: user.aksesLevelId,
                userId: user.id,
            },
        });

        return {
            status: true,
            data: {
                buffer,
                fileName,
            },
        };
    } catch (err) {
        Logger.error(`SuratKeteranganLulusService.cetakSurat : ${err}`);
        return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
}

