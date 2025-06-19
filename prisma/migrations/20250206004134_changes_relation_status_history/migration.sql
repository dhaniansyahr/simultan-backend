/*
  Warnings:

  - You are about to drop the column `statusHistoryId` on the `User` table. All the data in the column will be lost.
  - Added the required column `userId` to the `StatusHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_statusHistoryId_fkey`;

-- AlterTable
ALTER TABLE `StatusHistory` ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `statusHistoryId`;

-- AddForeignKey
ALTER TABLE `StatusHistory` ADD CONSTRAINT `StatusHistory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
