import { Hono } from "hono";
import * as CutiSementaraController from "$controllers/rest/CutiSementaraController";
import * as AuthMiddleware from "$middlewares/authMiddleware";

const CutiSementaraRoutes = new Hono();

CutiSementaraRoutes.get(
    "/",
    AuthMiddleware.checkJwt,
    AuthMiddleware.checkAccess("CUTI_SEMENTARA", "VIEW"),
    CutiSementaraController.getAll
);

CutiSementaraRoutes.get(
    "/:id",
    AuthMiddleware.checkJwt,
    AuthMiddleware.checkAccess("CUTI_SEMENTARA", "VIEW"),
    CutiSementaraController.getById
);

CutiSementaraRoutes.post(
    "/",
    AuthMiddleware.checkJwt,
    AuthMiddleware.checkAccess("CUTI_SEMENTARA", "CREATE"),
    CutiSementaraController.create
);

CutiSementaraRoutes.put(
    "/:id",
    AuthMiddleware.checkJwt,
    AuthMiddleware.checkAccess("CUTI_SEMENTARA", "UPDATE"),
    CutiSementaraController.update
);

CutiSementaraRoutes.delete(
    "/",
    AuthMiddleware.checkJwt,
    AuthMiddleware.checkAccess("CUTI_SEMENTARA", "DELETE"),
    CutiSementaraController.deleteByIds
);

export default CutiSementaraRoutes;
