-- CreateTable
CREATE TABLE `SuratKeteranganKuliah` (
    `id` VARCHAR(191) NOT NULL,
    `fileUrl` VARCHAR(191) NOT NULL,
    `status` ENUM('MENUNGGU', 'DISETUJUI', 'DITOLAK') NOT NULL,
    `reason` VARCHAR(191) NULL,
    `approvedById` VARCHAR(191) NULL,
    `remainingApprovedId` VARCHAR(191) NULL,
    `rejectedById` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SuratKeteranganKuliah_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SuratKeteranganKuliah` ADD CONSTRAINT `SuratKeteranganKuliah_approvedById_fkey` FOREIGN KEY (`approvedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SuratKeteranganKuliah` ADD CONSTRAINT `SuratKeteranganKuliah_remainingApprovedId_fkey` FOREIGN KEY (`remainingApprovedId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SuratKeteranganKuliah` ADD CONSTRAINT `SuratKeteranganKuliah_rejectedById_fkey` FOREIGN KEY (`rejectedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
