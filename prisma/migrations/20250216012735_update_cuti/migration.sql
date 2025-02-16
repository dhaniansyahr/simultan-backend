/*
  Warnings:

  - You are about to drop the column `approvedById` on the `CutiSementara` table. All the data in the column will be lost.
  - You are about to drop the column `rejectedById` on the `CutiSementara` table. All the data in the column will be lost.
  - You are about to drop the column `remainingApprovedId` on the `CutiSementara` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `CutiSementara` DROP FOREIGN KEY `CutiSementara_approvedById_fkey`;

-- DropForeignKey
ALTER TABLE `CutiSementara` DROP FOREIGN KEY `CutiSementara_rejectedById_fkey`;

-- DropForeignKey
ALTER TABLE `CutiSementara` DROP FOREIGN KEY `CutiSementara_remainingApprovedId_fkey`;

-- AlterTable
ALTER TABLE `CutiSementara` DROP COLUMN `approvedById`,
    DROP COLUMN `rejectedById`,
    DROP COLUMN `remainingApprovedId`;

-- AlterTable
ALTER TABLE `StatusHistory` ADD COLUMN `cutiSementaraId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `StatusHistory` ADD CONSTRAINT `StatusHistory_cutiSementaraId_fkey` FOREIGN KEY (`cutiSementaraId`) REFERENCES `CutiSementara`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
