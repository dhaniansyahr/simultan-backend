import { Hono } from "hono";
import * as AuthMiddleware from "$middlewares/authMiddleware";
import * as SuratKeteranganKuliahController from "$controllers/rest/SuratKeteranganKuliahController";
import * as SuratKeteranganKuliahValidation from "$validations/SuratKeteranganKuliahValidation";

const SuratKeteranganKuliahRoutes = new Hono();

SuratKeteranganKuliahRoutes.get("/", AuthMiddleware.checkJwt, AuthMiddleware.checkAccess("SURAT_KETERANGAN_KULIAH", "VIEW"), SuratKeteranganKuliahController.getAll);

SuratKeteranganKuliahRoutes.get(
        "/history",
        AuthMiddleware.checkJwt,
        AuthMiddleware.checkAccess("SURAT_KETERANGAN_KULIAH", "VIEW"),
        SuratKeteranganKuliahController.getAllHistory
);

SuratKeteranganKuliahRoutes.post(
        "/",
        AuthMiddleware.checkJwt,
        AuthMiddleware.checkAccess("SURAT_KETERANGAN_KULIAH", "CREATE"),
        SuratKeteranganKuliahValidation.validateSuratKeteranganKuliahDTO,
        SuratKeteranganKuliahController.create
);

SuratKeteranganKuliahRoutes.get("/:id", AuthMiddleware.checkJwt, AuthMiddleware.checkAccess("SURAT_KETERANGAN_KULIAH", "VIEW"), SuratKeteranganKuliahController.getById);

SuratKeteranganKuliahRoutes.put("/:id", AuthMiddleware.checkJwt, AuthMiddleware.checkAccess("SURAT_KETERANGAN_KULIAH", "UPDATE"), SuratKeteranganKuliahController.update);

SuratKeteranganKuliahRoutes.put(
        "/:id/verification",
        AuthMiddleware.checkJwt,
        AuthMiddleware.checkAccess("SURAT_KETERANGAN_KULIAH", "VERIFICATION"),
        SuratKeteranganKuliahValidation.validateVerificationSuratKeteranganKuliahDTO,
        SuratKeteranganKuliahController.verificationSurat
);

SuratKeteranganKuliahRoutes.put(
        "/:id/input-nomor-surat",
        AuthMiddleware.checkJwt,
        AuthMiddleware.checkAccess("SURAT_KETERANGAN_KULIAH", "VERIFICATION"),
        SuratKeteranganKuliahValidation.validateInputNomorSuratSuratKeteranganKuliahDTO,
        SuratKeteranganKuliahController.letterProcess
);

SuratKeteranganKuliahRoutes.patch(
        "/:id/nomor-surat", 
        AuthMiddleware.checkJwt, 
        AuthMiddleware.checkAccess("SURAT_KETERANGAN_KULIAH", "NOMOR_SURAT"), 
        SuratKeteranganKuliahController.updateNomorSurat
);

SuratKeteranganKuliahRoutes.get(
        "/:id/cetak-surat",
        AuthMiddleware.checkJwt,
        AuthMiddleware.checkAccess("SURAT_KETERANGAN_KULIAH", "EXPORT"),
        SuratKeteranganKuliahController.cetakSurat
);

export default SuratKeteranganKuliahRoutes;
