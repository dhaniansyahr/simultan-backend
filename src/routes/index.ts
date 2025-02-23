import { response_not_found, response_success } from "$utils/response.utils";
import { Context, Hono } from "hono";
import * as AuthController from "$controllers/rest/AuthController";
import * as AuthValidation from "$validations/AuthValidations";
import RoutesRegistry from "./registry";
import * as AuthMiddleware from "$middlewares/authMiddleware";
import * as ExampleBufferController from "$controllers/rest/ExampleBufferController";

const router = new Hono();

router.post("/api/login", AuthValidation.validateLoginDTO, AuthController.login);
router.post("/api/register", AuthValidation.validateRegisterDTO, AuthController.register);
router.post("/api/verify-token", AuthController.verifyToken);
router.put("/api/update-password", AuthMiddleware.checkJwt, AuthController.changePassword);
router.get("/api/example/buffer/pdf", ExampleBufferController.getPDF);
router.route("/api/users", RoutesRegistry.UserRoutes);

// Surat Keterangan Kuliah
router.route("/api/surat-keterangan-kuliah", RoutesRegistry.SuratKeteranganKuliahRoutes);
router.route("/api/acl", RoutesRegistry.AclRoutes);
router.route("/api/cuti-sementara", RoutesRegistry.CutiSementaraRoutes);
router.route("/api/pengajuan-yudisium", RoutesRegistry.PengajuanYudisiumRoutes);
router.route("/api/legalisir-ijazah", RoutesRegistry.LegalisirIjazahRoutes);

router.get("/", (c: Context) => {
        return response_success(c, "main routes!");
});

router.get("/robots.txt", (c: Context) => {
        return c.text(`User-agent: *\nAllow: /`);
});

router.get("/ping", (c: Context) => {
        return response_success(c, "pong!");
});

router.all("*", (c: Context) => {
        return response_not_found(c);
});

export default router;
