-- DropForeignKey
ALTER TABLE `SuratKeteranganKuliah` DROP FOREIGN KEY `SuratKeteranganKuliah_statusHistoryId_fkey`;

-- AlterTable
ALTER TABLE `StatusHistory` ADD COLUMN `suratKeteranganKuliahId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `StatusHistory` ADD CONSTRAINT `StatusHistory_suratKeteranganKuliahId_fkey` FOREIGN KEY (`suratKeteranganKuliahId`) REFERENCES `SuratKeteranganKuliah`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
