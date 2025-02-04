/*
  Warnings:

  - Added the required column `type` to the `SuratKeteranganKuliah` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `SuratKeteranganKuliah` ADD COLUMN `type` ENUM('KP4', 'SK_PENSIUN', 'SURAT_KETERANGAN_PERUSAHAAN', 'LAINNYA') NOT NULL;
