/*
  Warnings:

  - You are about to drop the `Actions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Features` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserLevels` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[featureName,actionName,userLevelId]` on the table `Acl` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Acl` DROP FOREIGN KEY `Acl_featureName_fkey`;

-- DropForeignKey
ALTER TABLE `Acl` DROP FOREIGN KEY `Acl_userLevelId_fkey`;

-- DropForeignKey
ALTER TABLE `Actions` DROP FOREIGN KEY `Actions_featureName_fkey`;

-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_userLevelsId_fkey`;

-- DropTable
DROP TABLE `Actions`;

-- DropTable
DROP TABLE `Features`;

-- DropTable
DROP TABLE `UserLevels`;

-- CreateTable
CREATE TABLE `UserLevel` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `UserLevel_id_key`(`id`),
    UNIQUE INDEX `UserLevel_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Feature` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Feature_id_key`(`id`),
    UNIQUE INDEX `Feature_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Action` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `featureName` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Action_id_key`(`id`),
    UNIQUE INDEX `Action_featureName_name_key`(`featureName`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Acl_featureName_actionName_userLevelId_key` ON `Acl`(`featureName`, `actionName`, `userLevelId`);

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_userLevelsId_fkey` FOREIGN KEY (`userLevelsId`) REFERENCES `UserLevel`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Action` ADD CONSTRAINT `Action_featureName_fkey` FOREIGN KEY (`featureName`) REFERENCES `Feature`(`name`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Acl` ADD CONSTRAINT `Acl_featureName_fkey` FOREIGN KEY (`featureName`) REFERENCES `Feature`(`name`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Acl` ADD CONSTRAINT `Acl_userLevelId_fkey` FOREIGN KEY (`userLevelId`) REFERENCES `UserLevel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
