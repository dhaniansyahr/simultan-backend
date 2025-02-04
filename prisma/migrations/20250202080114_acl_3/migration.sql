/*
  Warnings:

  - You are about to drop the column `userLevelsId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_userLevelsId_fkey`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `userLevelsId`,
    ADD COLUMN `userLevelId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_userLevelId_fkey` FOREIGN KEY (`userLevelId`) REFERENCES `UserLevel`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
