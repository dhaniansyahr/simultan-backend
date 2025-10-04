import { Hono } from "hono";
import * as AuthMiddleware from "$middlewares/authMiddleware";
import * as RekomendasiBeasiswaController from "$controllers/rest/RekomendasiBeasiswaController";
import * as RekomendasiBeasiswaValidation from "$validations/RekomendasiBeasiswaValidation";

const RekomendasiBeasiswaRoutes = new Hono();

RekomendasiBeasiswaRoutes.get(
  "/",
  AuthMiddleware.checkJwt,
  AuthMiddleware.checkAccess("REKOMENDASI_BEASISWA", "VIEW"),
  RekomendasiBeasiswaController.getAll
);

RekomendasiBeasiswaRoutes.get(
  "/history",
  AuthMiddleware.checkJwt,
  AuthMiddleware.checkAccess("REKOMENDASI_BEASISWA", "VIEW"),
  RekomendasiBeasiswaController.getAllHistory
);

RekomendasiBeasiswaRoutes.get(
  "/:id/cetak-surat",
  AuthMiddleware.checkJwt,
  AuthMiddleware.checkAccess("REKOMENDASI_BEASISWA", "EXPORT"),
  RekomendasiBeasiswaController.cetakSurat
);

RekomendasiBeasiswaRoutes.post(
  "/",
  AuthMiddleware.checkJwt,
  AuthMiddleware.checkAccess("REKOMENDASI_BEASISWA", "CREATE"),
  RekomendasiBeasiswaValidation.validateRekomendasiBeasiswaDTO,
  RekomendasiBeasiswaController.create
);

RekomendasiBeasiswaRoutes.get(
  "/:id",
  AuthMiddleware.checkJwt,
  AuthMiddleware.checkAccess("REKOMENDASI_BEASISWA", "VIEW"),
  RekomendasiBeasiswaController.getById
);

RekomendasiBeasiswaRoutes.put(
  "/:id",
  AuthMiddleware.checkJwt,
  AuthMiddleware.checkAccess("REKOMENDASI_BEASISWA", "UPDATE"),
  RekomendasiBeasiswaValidation.validateRekomendasiBeasiswaDTO,
  RekomendasiBeasiswaController.update
);

RekomendasiBeasiswaRoutes.put(
  "/:id/verification",
  AuthMiddleware.checkJwt,
  AuthMiddleware.checkAccess("REKOMENDASI_BEASISWA", "VERIFICATION"),
  RekomendasiBeasiswaValidation.validateVerifikasiRekomendasiBeasiswaDTO,
  RekomendasiBeasiswaController.verification
);

RekomendasiBeasiswaRoutes.put(
  "/:id/input-nomor-surat",
  AuthMiddleware.checkJwt,
  AuthMiddleware.checkAccess("REKOMENDASI_BEASISWA", "VERIFICATION", "NOMOR_SURAT"),
  RekomendasiBeasiswaValidation.validateUpdateNomorSuratRekomendasiMahasiswaDTO,
  RekomendasiBeasiswaController.processLetter
);

RekomendasiBeasiswaRoutes.patch(
  "/:id/edit-nomor-surat",
  AuthMiddleware.checkJwt,
  // AuthMiddleware.checkAccess("REKOMENDASI_BEASISWA", "NOMOR_SURAT"),
  RekomendasiBeasiswaValidation.validateUpdateNomorSuratRekomendasiMahasiswaDTO,
  RekomendasiBeasiswaController.updateNomorSurat
);



export default RekomendasiBeasiswaRoutes;
