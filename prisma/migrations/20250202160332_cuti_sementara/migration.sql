-- CreateTable
CREATE TABLE `CutiSementara` (
    `id` VARCHAR(191) NOT NULL,
    `suratPersetujuanOrangTuaUrl` VARCHAR(191) NOT NULL,
    `bebasPustakaUrl` VARCHAR(191) NOT NULL,
    `bssFormUrl` VARCHAR(191) NOT NULL,
    `status` ENUM('MENUNGGU', 'DISETUJUI', 'DITOLAK') NOT NULL DEFAULT 'MENUNGGU',
    `noSurat` VARCHAR(191) NULL,
    `reason` VARCHAR(191) NOT NULL,
    `approvedById` VARCHAR(191) NULL,
    `remainingApprovedId` VARCHAR(191) NULL,
    `rejectedById` VARCHAR(191) NULL,
    `offerById` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `CutiSementara_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CutiSementara` ADD CONSTRAINT `CutiSementara_approvedById_fkey` FOREIGN KEY (`approvedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CutiSementara` ADD CONSTRAINT `CutiSementara_remainingApprovedId_fkey` FOREIGN KEY (`remainingApprovedId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CutiSementara` ADD CONSTRAINT `CutiSementara_rejectedById_fkey` FOREIGN KEY (`rejectedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CutiSementara` ADD CONSTRAINT `CutiSementara_offerById_fkey` FOREIGN KEY (`offerById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
