import { Hono } from "hono";
import * as AuthMiddleware from "$middlewares/authMiddleware";
import * as AclController from "$controllers/rest/AclController";
import * as AclValidations from "$validations/AclValidations";

const AclRoutes = new Hono();

AclRoutes.post("/", AuthMiddleware.checkJwt, AclValidations.validateAclDTO, AclController.create);

AclRoutes.get("/features", AuthMiddleware.checkJwt, AclController.getAllFeatures);

AclRoutes.get("/level-akses", AuthMiddleware.checkJwt, AclController.getAllLevelAkses);

AclRoutes.get("/:aksesLevelId", AuthMiddleware.checkJwt, AclController.getByUserLevelId);

AclRoutes.get("/menu/:aksesLevelId", AuthMiddleware.checkJwt, AclController.getMenuByAksesLevelId);

export default AclRoutes;
