import { Hono } from "hono";
import * as LegalisirIjazahController from "$controllers/rest/LegalisirIjazahController";
import * as AuthMiddleware from "$middlewares/authMiddleware";
import * as Validation from "$validations/LegalisirIjazahValidation";

const LegalisirIjazahRoutes = new Hono();

LegalisirIjazahRoutes.get("/", AuthMiddleware.checkJwt, AuthMiddleware.checkAccess("LEGALISIR_IJAZAH", "VIEW"), LegalisirIjazahController.getAll);

LegalisirIjazahRoutes.post(
        "/",
        AuthMiddleware.checkJwt,
        AuthMiddleware.checkAccess("LEGALISIR_IJAZAH", "CREATE"),
        Validation.validateLegalisirIjazahDTO,
        LegalisirIjazahController.create
);

LegalisirIjazahRoutes.get("/:id", AuthMiddleware.checkJwt, AuthMiddleware.checkAccess("LEGALISIR_IJAZAH", "VIEW"), LegalisirIjazahController.getById);

LegalisirIjazahRoutes.put("/:id", AuthMiddleware.checkJwt, AuthMiddleware.checkAccess("LEGALISIR_IJAZAH", "UPDATE"), LegalisirIjazahController.update);

LegalisirIjazahRoutes.put(
        "/:id/verifikasi",
        AuthMiddleware.checkJwt,
        AuthMiddleware.checkAccess("LEGALISIR_IJAZAH", "VERIFICATION"),
        Validation.validateVerifikasiStatusDTO,
        LegalisirIjazahController.verification
);

LegalisirIjazahRoutes.put(
        "/proses/:id",
        AuthMiddleware.checkJwt,
        AuthMiddleware.checkAccess("LEGALISIR_IJAZAH", "VERIFICATION"),
        Validation.validateProsesLegalisirDTO,
        LegalisirIjazahController.prosesLegalisir
);

export default LegalisirIjazahRoutes;
