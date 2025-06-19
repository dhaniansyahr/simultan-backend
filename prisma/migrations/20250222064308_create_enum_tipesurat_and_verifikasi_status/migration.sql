/*
  Warnings:

  - You are about to alter the column `tipeSurat` on the `SuratKeteranganKuliah` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - You are about to alter the column `verifikasiStatus` on the `SuratKeteranganKuliah` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `SuratKeteranganKuliah` MODIFY `tipeSurat` ENUM('KP4', 'SK_PENSIUN', 'SURAT_KETERANGAN_PERUSAHAAN', 'LAINNYA') NOT NULL,
    MODIFY `verifikasiStatus` ENUM('DIPROSES_OPERATOR_KEMAHASISWAAN', 'DISETUJUI_OPERATOR_KEMAHASISWAAN', 'DIPROSES_KASUBBAG_KEMAHASISWAAN', 'DISETUJUI_KASUBBAG_KEMAHASISWAAN', 'SURAT_DIPROSES', 'USULAN_DISETUJUI', 'USULAN_DITOLAK') NOT NULL;
