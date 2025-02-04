/*
  Warnings:

  - Added the required column `offerById` to the `SuratKeteranganKuliah` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `SuratKeteranganKuliah` ADD COLUMN `noSurat` VARCHAR(191) NULL,
    ADD COLUMN `offerById` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `SuratKeteranganKuliah` ADD CONSTRAINT `SuratKeteranganKuliah_offerById_fkey` FOREIGN KEY (`offerById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
