/*
  Warnings:

  - You are about to drop the column `approvedById` on the `SuratKeteranganKuliah` table. All the data in the column will be lost.
  - You are about to drop the column `rejectedById` on the `SuratKeteranganKuliah` table. All the data in the column will be lost.
  - You are about to drop the column `remainingApprovedId` on the `SuratKeteranganKuliah` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `SuratKeteranganKuliah` table. All the data in the column will be lost.
  - Added the required column `description` to the `SuratKeteranganKuliah` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statusHistoryId` to the `SuratKeteranganKuliah` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `SuratKeteranganKuliah` DROP FOREIGN KEY `SuratKeteranganKuliah_approvedById_fkey`;

-- DropForeignKey
ALTER TABLE `SuratKeteranganKuliah` DROP FOREIGN KEY `SuratKeteranganKuliah_rejectedById_fkey`;

-- DropForeignKey
ALTER TABLE `SuratKeteranganKuliah` DROP FOREIGN KEY `SuratKeteranganKuliah_remainingApprovedId_fkey`;

-- AlterTable
ALTER TABLE `SuratKeteranganKuliah` DROP COLUMN `approvedById`,
    DROP COLUMN `rejectedById`,
    DROP COLUMN `remainingApprovedId`,
    DROP COLUMN `status`,
    ADD COLUMN `description` VARCHAR(191) NOT NULL,
    ADD COLUMN `statusHistoryId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `statusHistoryId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `StatusHistory` (
    `id` VARCHAR(191) NOT NULL,
    `action` ENUM('SEDANG_DIPROSES', 'DISETUJUI', 'DITOLAK') NOT NULL,
    `description` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `StatusHistory_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_statusHistoryId_fkey` FOREIGN KEY (`statusHistoryId`) REFERENCES `StatusHistory`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SuratKeteranganKuliah` ADD CONSTRAINT `SuratKeteranganKuliah_statusHistoryId_fkey` FOREIGN KEY (`statusHistoryId`) REFERENCES `StatusHistory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
