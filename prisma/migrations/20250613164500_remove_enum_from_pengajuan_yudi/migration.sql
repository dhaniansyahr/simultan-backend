/*
  Warnings:

  - You are about to alter the column `verifikasiStatus` on the `PengajuanYudisium` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `PengajuanYudisium` MODIFY `verifikasiStatus` VARCHAR(191) NOT NULL DEFAULT 'DIPROSES OLEH OPERATOR AKADEMIK';
