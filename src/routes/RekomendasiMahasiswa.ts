import { Hono } from "hono";
import * as AuthMiddleware from "$middlewares/authMiddleware";
import * as RekomendasiMahasiswaController from "$controllers/rest/RekomendasiMahasiswaController";
import * as RekomendasiMahasiswaValidation from "$validations/RekomendasiMahasiswaValidation";

const RekomendasiMahasiswaRoutes = new Hono();

RekomendasiMahasiswaRoutes.get(
  "/",
  AuthMiddleware.checkJwt,
  AuthMiddleware.checkAccess("REKOsMENDASI_MAHASISWA", "VIEW"),
  RekomendasiMahasiswaController.getAll
);

RekomendasiMahasiswaRoutes.post(
  "/",
  AuthMiddleware.checkJwt,
  AuthMiddleware.checkAccess("REKOMENDASI_MAHASISWA", "CREATE"),
  RekomendasiMahasiswaValidation.validateRekomendasiMahasiswaDTO,
  RekomendasiMahasiswaController.create
);

RekomendasiMahasiswaRoutes.get(
  "/:id",
  AuthMiddleware.checkJwt,
  AuthMiddleware.checkAccess("REKOMENDASI_MAHASISWA", "VIEW"),
  RekomendasiMahasiswaController.getById
);

RekomendasiMahasiswaRoutes.put(
  "/:id",
  AuthMiddleware.checkJwt,
  AuthMiddleware.checkAccess("REKOMENDASI_MAHASISWA", "UPDATE"),
  RekomendasiMahasiswaValidation.validateRekomendasiMahasiswaDTO,
  RekomendasiMahasiswaController.update
);

RekomendasiMahasiswaRoutes.put(
  "/:id/verification",
  AuthMiddleware.checkJwt,
  AuthMiddleware.checkAccess("REKOMENDASI_MAHASISWA", "VERIFICATION"),
  RekomendasiMahasiswaValidation.validateVerifikasiRekomendasiMahasiswaDTO,
  RekomendasiMahasiswaController.verification
);

RekomendasiMahasiswaRoutes.patch(
  "/:id/edit-nomor-surat",
  AuthMiddleware.checkJwt,
  AuthMiddleware.checkAccess("REKOMENDASI_MAHASISWA", "NOMOR_SURAT"),
  RekomendasiMahasiswaValidation.validateUpdateNomorSuratRekomendasiMahasiswaDTO,
  RekomendasiMahasiswaController.updateNomorSurat
);

export default RekomendasiMahasiswaRoutes;
