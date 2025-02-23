import { Hono } from "hono";
import * as LegalisirIjazahController from "$controllers/rest/PengajuanYudisiumController";
import * as AuthMiddleware from "$middlewares/authMiddleware";
import * as Validation from "$validations/LegalisirIjazahValidation";

const LegalisirIjazahRoutes = new Hono();

LegalisirIjazahRoutes.get(
        "/",
        AuthMiddleware.checkJwt,
        AuthMiddleware.checkAccess("PENGAJUAN_YUDISIUM", "VIEW"),
        LegalisirIjazahController.getAll
);

LegalisirIjazahRoutes.post(
        "/",
        AuthMiddleware.checkJwt,
        AuthMiddleware.checkAccess("PENGAJUAN_YUDISIUM", "CREATE"),
        Validation.validateLegalisirIjazahDTO,
        LegalisirIjazahController.create
);

LegalisirIjazahRoutes.get(
        "/:id",
        AuthMiddleware.checkJwt,
        AuthMiddleware.checkAccess("PENGAJUAN_YUDISIUM", "VIEW"),
        LegalisirIjazahController.getById
);

LegalisirIjazahRoutes.get(
        "/:id/verifikasi",
        AuthMiddleware.checkJwt,
        AuthMiddleware.checkAccess("PENGAJUAN_YUDISIUM", "VERIFICATION"),
        Validation.validateVerifikasiStatusDTO,
        LegalisirIjazahController.verification
);

export default LegalisirIjazahRoutes;
