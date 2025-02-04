-- AlterTable
ALTER TABLE `User` ADD COLUMN `userLevelsId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `UserLevels` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `UserLevels_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Features` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Features_id_key`(`id`),
    UNIQUE INDEX `Features_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Actions` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `featureName` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Actions_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Acl` (
    `id` VARCHAR(191) NOT NULL,
    `featureName` VARCHAR(191) NOT NULL,
    `actionName` VARCHAR(191) NOT NULL,
    `userLevelId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Acl_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_userLevelsId_fkey` FOREIGN KEY (`userLevelsId`) REFERENCES `UserLevels`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Actions` ADD CONSTRAINT `Actions_featureName_fkey` FOREIGN KEY (`featureName`) REFERENCES `Features`(`name`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Acl` ADD CONSTRAINT `Acl_featureName_fkey` FOREIGN KEY (`featureName`) REFERENCES `Features`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Acl` ADD CONSTRAINT `Acl_userLevelId_fkey` FOREIGN KEY (`userLevelId`) REFERENCES `UserLevels`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
