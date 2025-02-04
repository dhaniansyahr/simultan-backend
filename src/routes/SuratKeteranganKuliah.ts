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
    "/:id",
    AuthMiddleware.checkJwt,
    AuthMiddleware.checkAccess("SURAT_KETERANGAN_KULIAH", "UPDATE"),
    SuratKeteranganKuliahController.update
);

SuratKeteranganKuliahRoutes.put(
    "/:id/verification",
    AuthMiddleware.checkJwt,
    AuthMiddleware.checkAccess("SURAT_KETERANGAN_KULIAH", "VERIFIKASI"),
    SuratKeteranganKuliahValidation.validateVerificationSuratKeteranganKuliahDTO,
    SuratKeteranganKuliahController.verificationSurat
);

SuratKeteranganKuliahRoutes.get(
    "/:id/cetak",
    AuthMiddleware.checkJwt,
    AuthMiddleware.checkAccess("SURAT_KETERANGAN_KULIAH", "EXPORT"),
    SuratKeteranganKuliahController.cetakSurat
);

SuratKeteranganKuliahRoutes.delete(
    "/",
    AuthMiddleware.checkJwt,
    AuthMiddleware.checkAccess("SURAT_KETERANGAN_KULIAH", "DELETE"),
    SuratKeteranganKuliahController.deleteByIds
);

export default SuratKeteranganKuliahRoutes;
