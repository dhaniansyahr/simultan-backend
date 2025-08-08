import { Hono } from "hono";
import * as AuthMiddleware from "$middlewares/authMiddleware";
import * as SuratKeteranganLulusController from "$controllers/rest/SuratKeteranganLulusController";
import * as SuratKeteranganLulusValidation from "$validations/SuratKeteranganLulusValidation";

const SuratKeteranganLulusRoutes = new Hono();

SuratKeteranganLulusRoutes.get(
  "/",
  AuthMiddleware.checkJwt,
  AuthMiddleware.checkAccess("SURAT_KETERANGAN_LULUS", "VIEW"),
  SuratKeteranganLulusController.getAll
);

SuratKeteranganLulusRoutes.get(
  "/history",
  AuthMiddleware.checkJwt,
  AuthMiddleware.checkAccess("SURAT_KETERANGAN_LULUS", "VIEW"),
  SuratKeteranganLulusController.getAllHistory
);

SuratKeteranganLulusRoutes.post(
  "/",
  AuthMiddleware.checkJwt,
  AuthMiddleware.checkAccess("SURAT_KETERANGAN_LULUS", "CREATE"),
  SuratKeteranganLulusValidation.validateSuratKeteranganLulusDTO,
  SuratKeteranganLulusController.create
);

SuratKeteranganLulusRoutes.get(
  "/:id",
  AuthMiddleware.checkJwt,
  AuthMiddleware.checkAccess("SURAT_KETERANGAN_LULUS", "VIEW"),
  SuratKeteranganLulusController.getById
);

SuratKeteranganLulusRoutes.put(
  "/:id",
  AuthMiddleware.checkJwt,
  AuthMiddleware.checkAccess("SURAT_KETERANGAN_LULUS", "UPDATE"),
  SuratKeteranganLulusValidation.validateSuratKeteranganLulusDTO,
  SuratKeteranganLulusController.update
);

SuratKeteranganLulusRoutes.put(
  "/:id/verification",
  AuthMiddleware.checkJwt,
  AuthMiddleware.checkAccess("SURAT_KETERANGAN_LULUS", "VERIFICATION"),
  SuratKeteranganLulusValidation.validateVerifikasiSuratKeteranganLulusDTO,
  SuratKeteranganLulusController.verification
);

SuratKeteranganLulusRoutes.put(
    "/:id/input-nomor-surat",
    AuthMiddleware.checkJwt,
    AuthMiddleware.checkAccess("SURAT_KETERANGAN_LULUS", "VERIFICATION"),
    SuratKeteranganLulusValidation.validateUpdateNomorSuratSuratKeteranganLulusDTO,
    SuratKeteranganLulusController.letterProcess
);

SuratKeteranganLulusRoutes.patch(
  "/:id/edit-nomor-surat",
  AuthMiddleware.checkJwt,
  AuthMiddleware.checkAccess("SURAT_KETERANGAN_LULUS", "NOMOR_SURAT"),
  SuratKeteranganLulusValidation.validateUpdateNomorSuratSuratKeteranganLulusDTO,
  SuratKeteranganLulusController.updateNomorSurat
);

export default SuratKeteranganLulusRoutes;
