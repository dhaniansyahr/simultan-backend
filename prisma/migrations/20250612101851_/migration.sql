/*
  Warnings:

  - You are about to alter the column `verifikasiStatus` on the `CutiSementara` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(5))` to `VarChar(191)`.
  - You are about to alter the column `verifikasiStatus` on the `SuratKeteranganKuliah` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(4))` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `CutiSementara` MODIFY `verifikasiStatus` VARCHAR(191) NOT NULL DEFAULT 'DIPROSES OLEH OPERATOR KEMAHASISWAAN';

-- AlterTable
ALTER TABLE `SuratKeteranganKuliah` MODIFY `verifikasiStatus` VARCHAR(191) NOT NULL DEFAULT 'DIPROSES OLEH OPERATOR KEMAHASISWAAN';
