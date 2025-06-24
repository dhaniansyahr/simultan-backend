/*
  Warnings:

  - Added the required column `buktiIjazah` to the `LegalisirIjazah` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `LegalisirIjazah` ADD COLUMN `alamatPengiriman` VARCHAR(191) NULL,
    ADD COLUMN `buktiIjazah` VARCHAR(191) NOT NULL,
    ADD COLUMN `tipePengambilan` ENUM('SEND', 'COD') NULL;
