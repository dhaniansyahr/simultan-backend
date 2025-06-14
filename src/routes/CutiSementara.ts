import { Hono } from "hono";
import * as CutiSementaraController from "$controllers/rest/CutiSementaraController";
import * as AuthMiddleware from "$middlewares/authMiddleware";

const CutiSementaraRoutes = new Hono();

CutiSementaraRoutes.get("/", AuthMiddleware.checkJwt, AuthMiddleware.checkAccess("CUTI_SEMENTARA", "VIEW"), CutiSementaraController.getAll);

CutiSementaraRoutes.get("/:id", AuthMiddleware.checkJwt, AuthMiddleware.checkAccess("CUTI_SEMENTARA", "VIEW"), CutiSementaraController.getById);

CutiSementaraRoutes.get("/:id", AuthMiddleware.checkJwt, AuthMiddleware.checkAccess("CUTI_SEMENTARA", "UPDATE"), CutiSementaraController.update);

CutiSementaraRoutes.post("/", AuthMiddleware.checkJwt, AuthMiddleware.checkAccess("CUTI_SEMENTARA", "CREATE"), CutiSementaraController.create);

CutiSementaraRoutes.put("/:id/verifikasi", AuthMiddleware.checkJwt, AuthMiddleware.checkAccess("CUTI_SEMENTARA", "VERIFICATION"), CutiSementaraController.verificationCuti);

export default CutiSementaraRoutes;
