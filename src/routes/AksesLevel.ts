import { Hono } from "hono";
import * as AuthMiddleware from "$middlewares/authMiddleware";
import * as AksesLevelController from "$controllers/rest/AksesLevelController";
import * as AksesLevelValidation from "$validations/AksesLevelValidations";

const UserLevelRoutes = new Hono();

UserLevelRoutes.get("/", AuthMiddleware.checkJwt, AksesLevelController.getAll);

UserLevelRoutes.get("/:id", AuthMiddleware.checkJwt, AksesLevelController.getById);

UserLevelRoutes.post(
        "/",
        AuthMiddleware.checkJwt,
        AksesLevelValidation.validateAksesLevelCreateDTO,
        AksesLevelController.create
);

UserLevelRoutes.put(
        "/:id",
        AuthMiddleware.checkJwt,
        AksesLevelValidation.validateAksesLevelUpdateDTO,
        AksesLevelController.update
);

UserLevelRoutes.delete("/", AuthMiddleware.checkJwt, AksesLevelController.deleteByIds);

export default UserLevelRoutes;
