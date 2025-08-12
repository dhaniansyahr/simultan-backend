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



export default RekomendasiBeasiswaRoutes;
