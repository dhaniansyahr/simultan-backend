import { Hono } from "hono";
import * as AuthMiddleware from "$middlewares/authMiddleware";
import * as AclController from "$controllers/rest/AclController";
import * as AclValidations from "$validations/AclValidations";

const AclRoutes = new Hono();

AclRoutes.post("/", AuthMiddleware.checkJwt, AclValidations.validateAclDTO, AclController.create);

AclRoutes.get(
    "/features",
    AuthMiddleware.checkJwt,
    AuthMiddleware.checkAccess("ACL", "VIEW"),
    AclController.getAllFeatures
);

AclRoutes.get(
    "/:userLevelId",
    AuthMiddleware.checkJwt,
    AuthMiddleware.checkAccess("ACL", "VIEW"),
    AclController.getByUserLevelId
);

export default AclRoutes;
