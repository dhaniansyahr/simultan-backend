import { Hono } from "hono";
import * as AuthMiddleware from "$middlewares/authMiddleware";
import * as UserLevelController from "$controllers/rest/UserLevelController";
import * as UserLevelValidations from "$validations/UserLevelValidations";

const UserLevelRoutes = new Hono();

UserLevelRoutes.get(
    "/",
    AuthMiddleware.checkJwt,
    AuthMiddleware.checkAccess("USER_LEVEL", "VIEW"),
    UserLevelController.getAll
);

UserLevelRoutes.get(
    "/:id",
    AuthMiddleware.checkJwt,
    AuthMiddleware.checkAccess("USER_LEVEL", "VIEW"),
    UserLevelController.getById
);

UserLevelRoutes.post(
    "/",
    AuthMiddleware.checkJwt,
    AuthMiddleware.checkAccess("USER_LEVEL", "CREATE"),
    UserLevelValidations.validateUserLevelCreateDTO,
    UserLevelController.create
);

UserLevelRoutes.put(
    "/:id",
    AuthMiddleware.checkJwt,
    AuthMiddleware.checkAccess("USER_LEVEL", "UPDATE"),
    UserLevelValidations.validateUserLevelUpdateDTO,
    UserLevelController.update
);

UserLevelRoutes.delete(
    "/",
    AuthMiddleware.checkJwt,
    AuthMiddleware.checkAccess("USER_LEVEL", "DELETE"),
    UserLevelController.deleteByIds
);

export default UserLevelRoutes;
