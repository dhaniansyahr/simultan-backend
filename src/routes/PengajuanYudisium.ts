import { Hono } from "hono";
import * as PengajuanYudisiumController from "$controllers/rest/PengajuanYudisiumController";
import * as AuthMiddleware from "$middlewares/authMiddleware";
import * as Validation from "$validations/PengajuanYudisiumValidation";

const PengajuanYudisiumRoutes = new Hono();

PengajuanYudisiumRoutes.get(
        "/",
        AuthMiddleware.checkJwt,
        AuthMiddleware.checkAccess("PENGAJUAN_YUDISIUM", "VIEW"),
        PengajuanYudisiumController.getAll
);

PengajuanYudisiumRoutes.post(
        "/",
        AuthMiddleware.checkJwt,
        AuthMiddleware.checkAccess("PENGAJUAN_YUDISIUM", "CREATE"),
        Validation.validatePengajuanYudisiumDTO,
        PengajuanYudisiumController.create
);

PengajuanYudisiumRoutes.get(
        "/:id",
        AuthMiddleware.checkJwt,
        AuthMiddleware.checkAccess("PENGAJUAN_YUDISIUM", "VIEW"),
        PengajuanYudisiumController.getById
);

PengajuanYudisiumRoutes.get(
        "/:id/verifikasi",
        AuthMiddleware.checkJwt,
        AuthMiddleware.checkAccess("PENGAJUAN_YUDISIUM", "VERIFICATION"),
        Validation.validateVerifikasiStatusDTO,
        PengajuanYudisiumController.verification
);

export default PengajuanYudisiumRoutes;
