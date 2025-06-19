import { Hono } from "hono";
import * as MenuController from "$controllers/rest/MenuController";

const MenuRoutes = new Hono();

MenuRoutes.get("/", MenuController.getAll);

MenuRoutes.post("/", MenuController.create);

MenuRoutes.get("/:id", MenuController.getById);

MenuRoutes.put("/:id", MenuController.update);

export default MenuRoutes;
