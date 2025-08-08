/*
  Warnings:

  - Added the required column `buktiTranskrip` to the `LegalisirIjazah` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `legalisirijazah` ADD COLUMN `buktiTranskrip` VARCHAR(191) NOT NULL;
