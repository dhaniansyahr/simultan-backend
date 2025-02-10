/*
  Warnings:

  - You are about to drop the column `statusHistoryId` on the `SuratKeteranganKuliah` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `SuratKeteranganKuliah_statusHistoryId_fkey` ON `SuratKeteranganKuliah`;

-- AlterTable
ALTER TABLE `SuratKeteranganKuliah` DROP COLUMN `statusHistoryId`;
