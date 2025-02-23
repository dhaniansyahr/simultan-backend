import { Hono } from "hono";
import * as AuthMiddleware from "$middlewares/authMiddleware";
import * as SuratKeteranganKuliahController from "$controllers/rest/SuratKeteranganKuliahController";
import * as SuratKeteranganKuliahValidation from "$validations/SuratKeteranganKuliahValidation";

const SuratKeteranganKuliahRoutes = new Hono();

SuratKeteranganKuliahRoutes.get(
        "/",
        AuthMiddleware.checkJwt,
        AuthMiddleware.checkAccess("SURAT_KETERANGAN_KULIAH", "VIEW"),
        SuratKeteranganKuliahController.getAll
);

SuratKeteranganKuliahRoutes.post(
        "/",
        AuthMiddleware.checkJwt,
        AuthMiddleware.checkAccess("SURAT_KETERANGAN_KULIAH", "CREATE"),
        SuratKeteranganKuliahValidation.validateSuratKeteranganKuliahDTO,
        SuratKeteranganKuliahController.create
);

SuratKeteranganKuliahRoutes.get(
        "/:id",
        AuthMiddleware.checkJwt,
        AuthMiddleware.checkAccess("SURAT_KETERANGAN_KULIAH", "VIEW"),
        SuratKeteranganKuliahController.getById
);

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

SuratKeteranganKuliahRoutes.get(
        "/:id/cetak",
        AuthMiddleware.checkJwt,
        AuthMiddleware.checkAccess("SURAT_KETERANGAN_KULIAH", "EXPORT"),
        SuratKeteranganKuliahController.cetakSurat
);

export default SuratKeteranganKuliahRoutes;
