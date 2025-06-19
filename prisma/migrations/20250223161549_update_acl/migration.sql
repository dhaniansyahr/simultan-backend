/*
  Warnings:

  - You are about to drop the column `actionId` on the `Acl` table. All the data in the column will be lost.
  - You are about to drop the column `featureId` on the `Acl` table. All the data in the column will be lost.
  - You are about to drop the column `featureId` on the `Action` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Acl` DROP FOREIGN KEY `Acl_actionId_fkey`;

-- DropForeignKey
ALTER TABLE `Acl` DROP FOREIGN KEY `Acl_featureId_fkey`;

-- DropForeignKey
ALTER TABLE `Action` DROP FOREIGN KEY `Action_featureId_fkey`;

-- AlterTable
ALTER TABLE `Acl` DROP COLUMN `actionId`,
    DROP COLUMN `featureId`;

-- AlterTable
ALTER TABLE `Action` DROP COLUMN `featureId`;

-- AddForeignKey
ALTER TABLE `Action` ADD CONSTRAINT `Action_namaFitur_fkey` FOREIGN KEY (`namaFitur`) REFERENCES `Feature`(`nama`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Acl` ADD CONSTRAINT `Acl_namaFitur_fkey` FOREIGN KEY (`namaFitur`) REFERENCES `Feature`(`nama`) ON DELETE RESTRICT ON UPDATE CASCADE;
