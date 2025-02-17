/*
  Warnings:

  - You are about to alter the column `status` on the `CutiSementara` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `Enum(EnumId(3))`.
  - The values [DIPROSES_OPERATOR_AKADEMIK,DISETUJUI_OPERATOR_AKADEMIK,DIPROSES_KASUBBAG_AKADEMIK,DISETUJUI_KASUBBAG_AKADEMIK] on the enum `CutiSementara_status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `status` on the `SuratKeteranganKuliah` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(3))` to `Enum(EnumId(3))`.

*/
-- AlterTable
ALTER TABLE `CutiSementara` MODIFY `status` ENUM('DIPROSES_OPERATOR_KEMAHASISWAAN', 'DISETUJUI_OPERATOR_KEMAHASISWAAN', 'DIPROSES_KASUBBAG_KEMAHASISWAAN', 'DISETUJUI_KASUBBAG_KEMAHASISWAAN', 'SURAT_DIPROSES', 'USULAN_DISETUJUI', 'USULAN_DITOLAK') NOT NULL DEFAULT 'DIPROSES_OPERATOR_KEMAHASISWAAN';

-- AlterTable
ALTER TABLE `StatusHistory` MODIFY `action` ENUM('DIPROSES_OPERATOR_KEMAHASISWAAN', 'DISETUJUI_OPERATOR_KEMAHASISWAAN', 'DIPROSES_KASUBBAG_KEMAHASISWAAN', 'DISETUJUI_KASUBBAG_KEMAHASISWAAN', 'SURAT_DIPROSES', 'USULAN_DISETUJUI', 'USULAN_DITOLAK') NOT NULL;

-- AlterTable
ALTER TABLE `SuratKeteranganKuliah` MODIFY `status` ENUM('DIPROSES_OPERATOR_KEMAHASISWAAN', 'DISETUJUI_OPERATOR_KEMAHASISWAAN', 'DIPROSES_KASUBBAG_KEMAHASISWAAN', 'DISETUJUI_KASUBBAG_KEMAHASISWAAN', 'SURAT_DIPROSES', 'USULAN_DISETUJUI', 'USULAN_DITOLAK') NOT NULL DEFAULT 'DIPROSES_OPERATOR_KEMAHASISWAAN';
