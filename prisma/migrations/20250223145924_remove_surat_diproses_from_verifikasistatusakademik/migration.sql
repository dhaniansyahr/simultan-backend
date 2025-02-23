/*
  Warnings:

  - The values [SURAT_DIPROSES] on the enum `LegalisirIjazah_verifikasiStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [SURAT_DIPROSES] on the enum `LegalisirIjazah_verifikasiStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `LegalisirIjazah` MODIFY `verifikasiStatus` ENUM('DIPROSES_OPERATOR_AKADEMIK', 'DISETUJUI_OPERATOR_AKADEMIK', 'DIPROSES_KASUBBAG_AKADEMIK', 'DISETUJUI_KASUBBAG_AKADEMIK', 'USULAN_DISETUJUI', 'USULAN_DITOLAK') NOT NULL;

-- AlterTable
ALTER TABLE `PengajuanYudisium` MODIFY `verifikasiStatus` ENUM('DIPROSES_OPERATOR_AKADEMIK', 'DISETUJUI_OPERATOR_AKADEMIK', 'DIPROSES_KASUBBAG_AKADEMIK', 'DISETUJUI_KASUBBAG_AKADEMIK', 'USULAN_DISETUJUI', 'USULAN_DITOLAK') NOT NULL;
