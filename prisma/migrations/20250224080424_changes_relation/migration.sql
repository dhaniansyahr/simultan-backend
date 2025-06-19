/*
  Warnings:

  - You are about to drop the column `statusId` on the `CutiSementara` table. All the data in the column will be lost.
  - You are about to drop the column `statusId` on the `LegalisirIjazah` table. All the data in the column will be lost.
  - You are about to drop the column `statusId` on the `PengajuanYudisium` table. All the data in the column will be lost.
  - You are about to drop the column `statusId` on the `SuratKeteranganKuliah` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `CutiSementara` DROP FOREIGN KEY `CutiSementara_statusId_fkey`;

-- DropForeignKey
ALTER TABLE `LegalisirIjazah` DROP FOREIGN KEY `LegalisirIjazah_statusId_fkey`;

-- DropForeignKey
ALTER TABLE `PengajuanYudisium` DROP FOREIGN KEY `PengajuanYudisium_statusId_fkey`;

-- DropForeignKey
ALTER TABLE `SuratKeteranganKuliah` DROP FOREIGN KEY `SuratKeteranganKuliah_statusId_fkey`;

-- AlterTable
ALTER TABLE `CutiSementara` DROP COLUMN `statusId`;

-- AlterTable
ALTER TABLE `LegalisirIjazah` DROP COLUMN `statusId`;

-- AlterTable
ALTER TABLE `PengajuanYudisium` DROP COLUMN `statusId`;

-- AlterTable
ALTER TABLE `SuratKeteranganKuliah` DROP COLUMN `statusId`;

-- CreateTable
CREATE TABLE `_CutiSementaraToStatus` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CutiSementaraToStatus_AB_unique`(`A`, `B`),
    INDEX `_CutiSementaraToStatus_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PengajuanYudisiumToStatus` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_PengajuanYudisiumToStatus_AB_unique`(`A`, `B`),
    INDEX `_PengajuanYudisiumToStatus_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_LegalisirIjazahToStatus` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_LegalisirIjazahToStatus_AB_unique`(`A`, `B`),
    INDEX `_LegalisirIjazahToStatus_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_StatusToSuratKeteranganKuliah` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_StatusToSuratKeteranganKuliah_AB_unique`(`A`, `B`),
    INDEX `_StatusToSuratKeteranganKuliah_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_CutiSementaraToStatus` ADD CONSTRAINT `_CutiSementaraToStatus_A_fkey` FOREIGN KEY (`A`) REFERENCES `CutiSementara`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CutiSementaraToStatus` ADD CONSTRAINT `_CutiSementaraToStatus_B_fkey` FOREIGN KEY (`B`) REFERENCES `Status`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PengajuanYudisiumToStatus` ADD CONSTRAINT `_PengajuanYudisiumToStatus_A_fkey` FOREIGN KEY (`A`) REFERENCES `PengajuanYudisium`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PengajuanYudisiumToStatus` ADD CONSTRAINT `_PengajuanYudisiumToStatus_B_fkey` FOREIGN KEY (`B`) REFERENCES `Status`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_LegalisirIjazahToStatus` ADD CONSTRAINT `_LegalisirIjazahToStatus_A_fkey` FOREIGN KEY (`A`) REFERENCES `LegalisirIjazah`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_LegalisirIjazahToStatus` ADD CONSTRAINT `_LegalisirIjazahToStatus_B_fkey` FOREIGN KEY (`B`) REFERENCES `Status`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_StatusToSuratKeteranganKuliah` ADD CONSTRAINT `_StatusToSuratKeteranganKuliah_A_fkey` FOREIGN KEY (`A`) REFERENCES `Status`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_StatusToSuratKeteranganKuliah` ADD CONSTRAINT `_StatusToSuratKeteranganKuliah_B_fkey` FOREIGN KEY (`B`) REFERENCES `SuratKeteranganKuliah`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
