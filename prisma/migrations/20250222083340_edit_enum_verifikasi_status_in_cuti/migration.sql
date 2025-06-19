/*
  Warnings:

  - You are about to alter the column `verifikasiStatus` on the `CutiSementara` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(2))`.

*/
-- AlterTable
ALTER TABLE `CutiSementara` MODIFY `verifikasiStatus` ENUM('DIPROSES_OPERATOR_KEMAHASISWAAN', 'DISETUJUI_OPERATOR_KEMAHASISWAAN', 'DIPROSES_KASUBBAG_KEMAHASISWAAN', 'DISETUJUI_KASUBBAG_KEMAHASISWAAN', 'SURAT_DIPROSES', 'USULAN_DISETUJUI', 'USULAN_DITOLAK') NOT NULL;
