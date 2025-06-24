/*
  Warnings:

  - You are about to alter the column `tempatPengambilan` on the `legalisirijazah` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(2))`.
  - Added the required column `buktiIjazah` to the `LegalisirIjazah` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `legalisirijazah` ADD COLUMN `buktiIjazah` VARCHAR(191) NOT NULL,
    MODIFY `tempatPengambilan` ENUM('Via_POS', 'Ambil_Langsung_DiFakultas') NULL;
