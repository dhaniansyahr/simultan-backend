import { Hono } from "hono";
import * as AuthMiddleware from "$middlewares/authMiddleware";
import * as SuratKeteranganKuliahController from "$controllers/rest/SuratKeteranganKuliahController";
import * as SuratKeteranganKuliahValidation from "$validations/SuratKeteranganKuliahValidation";

const SuratKeteranganKuliahRoutes = new Hono();

SuratKeteranganKuliahRoutes.get("/", SuratKeteranganKuliahController.getAll);

SuratKeteranganKuliahRoutes.post(
    "/",
    AuthMiddleware.checkJwt,
    SuratKeteranganKuliahValidation.validateSuratKeteranganKuliahDTO,
    SuratKeteranganKuliahController.create
);

SuratKeteranganKuliahRoutes.get("/:id", AuthMiddleware.checkJwt, SuratKeteranganKuliahController.getById);

SuratKeteranganKuliahRoutes.put("/:id", AuthMiddleware.checkJwt, SuratKeteranganKuliahController.update);

SuratKeteranganKuliahRoutes.put(
    "/:id/verification",
    AuthMiddleware.checkJwt,
    SuratKeteranganKuliahValidation.validateVerificationSuratKeteranganKuliahDTO,
    SuratKeteranganKuliahController.verificationSurat
);

SuratKeteranganKuliahRoutes.get("/:id/cetak", AuthMiddleware.checkJwt, SuratKeteranganKuliahController.cetakSurat);

SuratKeteranganKuliahRoutes.delete("/", AuthMiddleware.checkJwt, SuratKeteranganKuliahController.deleteByIds);

export default SuratKeteranganKuliahRoutes;
