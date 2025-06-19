/*
  Warnings:

  - You are about to alter the column `verifikasiStatus` on the `LegalisirIjazah` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(4))`.
  - You are about to alter the column `verifikasiStatus` on the `PengajuanYudisium` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(4))`.

*/
-- AlterTable
ALTER TABLE `LegalisirIjazah` MODIFY `verifikasiStatus` ENUM('DIPROSES_OPERATOR_AKADEMIK', 'DISETUJUI_OPERATOR_AKADEMIK', 'DIPROSES_KASUBBAG_AKADEMIK', 'DISETUJUI_KASUBBAG_AKADEMIK', 'SURAT_DIPROSES', 'USULAN_DISETUJUI', 'USULAN_DITOLAK') NOT NULL;

-- AlterTable
ALTER TABLE `PengajuanYudisium` MODIFY `verifikasiStatus` ENUM('DIPROSES_OPERATOR_AKADEMIK', 'DISETUJUI_OPERATOR_AKADEMIK', 'DIPROSES_KASUBBAG_AKADEMIK', 'DISETUJUI_KASUBBAG_AKADEMIK', 'SURAT_DIPROSES', 'USULAN_DISETUJUI', 'USULAN_DITOLAK') NOT NULL;
