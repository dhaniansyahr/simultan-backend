/*
  Warnings:

  - The primary key for the `Acl` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `actionName` on the `Acl` table. All the data in the column will be lost.
  - You are about to drop the column `featureName` on the `Acl` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Acl` table. All the data in the column will be lost.
  - You are about to drop the column `userLevelId` on the `Acl` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `Acl` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `Action` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `featureName` on the `Action` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Action` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Action` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `Action` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `CutiSementara` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `bebasPustakaUrl` on the `CutiSementara` table. All the data in the column will be lost.
  - You are about to drop the column `bssFormUrl` on the `CutiSementara` table. All the data in the column will be lost.
  - You are about to drop the column `noSurat` on the `CutiSementara` table. All the data in the column will be lost.
  - You are about to drop the column `offerById` on the `CutiSementara` table. All the data in the column will be lost.
  - You are about to drop the column `reason` on the `CutiSementara` table. All the data in the column will be lost.
  - You are about to drop the column `rejectedReason` on the `CutiSementara` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `CutiSementara` table. All the data in the column will be lost.
  - You are about to drop the column `suratPersetujuanOrangTuaUrl` on the `CutiSementara` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `CutiSementara` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `CutiSementara` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `Dekan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `name` on the `Dekan` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Dekan` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Dekan` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `Dekan` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `Feature` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `name` on the `Feature` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Feature` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `Feature` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `SuratKeteranganKuliah` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `description` on the `SuratKeteranganKuliah` table. All the data in the column will be lost.
  - You are about to drop the column `fileUrl` on the `SuratKeteranganKuliah` table. All the data in the column will be lost.
  - You are about to drop the column `noSurat` on the `SuratKeteranganKuliah` table. All the data in the column will be lost.
  - You are about to drop the column `offerById` on the `SuratKeteranganKuliah` table. All the data in the column will be lost.
  - You are about to drop the column `reason` on the `SuratKeteranganKuliah` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `SuratKeteranganKuliah` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `SuratKeteranganKuliah` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `SuratKeteranganKuliah` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `SuratKeteranganKuliah` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `userLevelId` on the `User` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to drop the `Dosen` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Mahasiswa` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StatusHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserLevel` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[ulid]` on the table `Acl` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ulid]` on the table `Action` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nama]` on the table `Action` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ulid]` on the table `CutiSementara` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ulid]` on the table `Dekan` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ulid]` on the table `Feature` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nama]` on the table `Feature` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ulid]` on the table `SuratKeteranganKuliah` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ulid]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `actionId` to the `Acl` table without a default value. This is not possible if the table is not empty.
  - Added the required column `aksesLevelId` to the `Acl` table without a default value. This is not possible if the table is not empty.
  - Added the required column `featureId` to the `Acl` table without a default value. This is not possible if the table is not empty.
  - Added the required column `namaAksi` to the `Acl` table without a default value. This is not possible if the table is not empty.
  - Added the required column `namaFitur` to the `Acl` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ulid` to the `Acl` table without a default value. This is not possible if the table is not empty.
  - Added the required column `featureId` to the `Action` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nama` to the `Action` table without a default value. This is not possible if the table is not empty.
  - Added the required column `namaFitur` to the `Action` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ulid` to the `Action` table without a default value. This is not possible if the table is not empty.
  - Added the required column `alasanPengajuan` to the `CutiSementara` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statusId` to the `CutiSementara` table without a default value. This is not possible if the table is not empty.
  - Added the required column `suratBebasPustakaUrl` to the `CutiSementara` table without a default value. This is not possible if the table is not empty.
  - Added the required column `suratBssUrl` to the `CutiSementara` table without a default value. This is not possible if the table is not empty.
  - Added the required column `suratIzinOrangTuaUrl` to the `CutiSementara` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ulid` to the `CutiSementara` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `CutiSementara` table without a default value. This is not possible if the table is not empty.
  - Added the required column `verifikasiStatus` to the `CutiSementara` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Dekan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nama` to the `Dekan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ulid` to the `Dekan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nama` to the `Feature` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ulid` to the `Feature` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deskripsi` to the `SuratKeteranganKuliah` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dokumenUrl` to the `SuratKeteranganKuliah` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statusId` to the `SuratKeteranganKuliah` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipeSurat` to the `SuratKeteranganKuliah` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ulid` to the `SuratKeteranganKuliah` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `SuratKeteranganKuliah` table without a default value. This is not possible if the table is not empty.
  - Added the required column `verifikasiStatus` to the `SuratKeteranganKuliah` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ulid` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Acl` DROP FOREIGN KEY `Acl_featureName_fkey`;

-- DropForeignKey
ALTER TABLE `Acl` DROP FOREIGN KEY `Acl_userLevelId_fkey`;

-- DropForeignKey
ALTER TABLE `Action` DROP FOREIGN KEY `Action_featureName_fkey`;

-- DropForeignKey
ALTER TABLE `CutiSementara` DROP FOREIGN KEY `CutiSementara_offerById_fkey`;

-- DropForeignKey
ALTER TABLE `Dekan` DROP FOREIGN KEY `Dekan_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Dosen` DROP FOREIGN KEY `Dosen_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Mahasiswa` DROP FOREIGN KEY `Mahasiswa_userId_fkey`;

-- DropForeignKey
ALTER TABLE `StatusHistory` DROP FOREIGN KEY `StatusHistory_cutiSementaraId_fkey`;

-- DropForeignKey
ALTER TABLE `StatusHistory` DROP FOREIGN KEY `StatusHistory_suratKeteranganKuliahId_fkey`;

-- DropForeignKey
ALTER TABLE `StatusHistory` DROP FOREIGN KEY `StatusHistory_userId_fkey`;

-- DropForeignKey
ALTER TABLE `SuratKeteranganKuliah` DROP FOREIGN KEY `SuratKeteranganKuliah_offerById_fkey`;

-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_userLevelId_fkey`;

-- DropIndex
DROP INDEX `Acl_featureName_actionName_userLevelId_key` ON `Acl`;

-- DropIndex
DROP INDEX `Acl_id_key` ON `Acl`;

-- DropIndex
DROP INDEX `Action_featureName_name_key` ON `Action`;

-- DropIndex
DROP INDEX `Action_id_key` ON `Action`;

-- DropIndex
DROP INDEX `CutiSementara_id_key` ON `CutiSementara`;

-- DropIndex
DROP INDEX `Dekan_id_key` ON `Dekan`;

-- DropIndex
DROP INDEX `Dekan_nip_key` ON `Dekan`;

-- DropIndex
DROP INDEX `Feature_id_key` ON `Feature`;

-- DropIndex
DROP INDEX `Feature_name_key` ON `Feature`;

-- DropIndex
DROP INDEX `SuratKeteranganKuliah_id_key` ON `SuratKeteranganKuliah`;

-- DropIndex
DROP INDEX `User_email_key` ON `User`;

-- DropIndex
DROP INDEX `User_id_key` ON `User`;

-- AlterTable
ALTER TABLE `Acl` DROP PRIMARY KEY,
    DROP COLUMN `actionName`,
    DROP COLUMN `featureName`,
    DROP COLUMN `updatedAt`,
    DROP COLUMN `userLevelId`,
    ADD COLUMN `actionId` INTEGER NOT NULL,
    ADD COLUMN `aksesLevelId` INTEGER NOT NULL,
    ADD COLUMN `featureId` INTEGER NOT NULL,
    ADD COLUMN `namaAksi` VARCHAR(191) NOT NULL,
    ADD COLUMN `namaFitur` VARCHAR(191) NOT NULL,
    ADD COLUMN `ulid` VARCHAR(191) NOT NULL,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Action` DROP PRIMARY KEY,
    DROP COLUMN `featureName`,
    DROP COLUMN `name`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `featureId` INTEGER NOT NULL,
    ADD COLUMN `nama` VARCHAR(191) NOT NULL,
    ADD COLUMN `namaFitur` VARCHAR(191) NOT NULL,
    ADD COLUMN `ulid` VARCHAR(191) NOT NULL,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `CutiSementara` DROP PRIMARY KEY,
    DROP COLUMN `bebasPustakaUrl`,
    DROP COLUMN `bssFormUrl`,
    DROP COLUMN `noSurat`,
    DROP COLUMN `offerById`,
    DROP COLUMN `reason`,
    DROP COLUMN `rejectedReason`,
    DROP COLUMN `status`,
    DROP COLUMN `suratPersetujuanOrangTuaUrl`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `alasanPengajuan` TEXT NOT NULL,
    ADD COLUMN `alasanPenolakan` TEXT NULL,
    ADD COLUMN `statusId` INTEGER NOT NULL,
    ADD COLUMN `suratBebasPustakaUrl` VARCHAR(191) NOT NULL,
    ADD COLUMN `suratBssUrl` VARCHAR(191) NOT NULL,
    ADD COLUMN `suratIzinOrangTuaUrl` VARCHAR(191) NOT NULL,
    ADD COLUMN `ulid` VARCHAR(191) NOT NULL,
    ADD COLUMN `userId` INTEGER NOT NULL,
    ADD COLUMN `verifikasiStatus` VARCHAR(191) NOT NULL,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Dekan` DROP PRIMARY KEY,
    DROP COLUMN `name`,
    DROP COLUMN `updatedAt`,
    DROP COLUMN `userId`,
    ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `nama` VARCHAR(191) NOT NULL,
    ADD COLUMN `ulid` VARCHAR(191) NOT NULL,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Feature` DROP PRIMARY KEY,
    DROP COLUMN `name`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `nama` VARCHAR(191) NOT NULL,
    ADD COLUMN `ulid` VARCHAR(191) NOT NULL,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `SuratKeteranganKuliah` DROP PRIMARY KEY,
    DROP COLUMN `description`,
    DROP COLUMN `fileUrl`,
    DROP COLUMN `noSurat`,
    DROP COLUMN `offerById`,
    DROP COLUMN `reason`,
    DROP COLUMN `status`,
    DROP COLUMN `type`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `alasanPenolakan` TEXT NULL,
    ADD COLUMN `deskripsi` TEXT NOT NULL,
    ADD COLUMN `dokumenUrl` VARCHAR(191) NOT NULL,
    ADD COLUMN `statusId` INTEGER NOT NULL,
    ADD COLUMN `tipeSurat` VARCHAR(191) NOT NULL,
    ADD COLUMN `ulid` VARCHAR(191) NOT NULL,
    ADD COLUMN `userId` INTEGER NOT NULL,
    ADD COLUMN `verifikasiStatus` VARCHAR(191) NOT NULL,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    DROP COLUMN `email`,
    DROP COLUMN `fullName`,
    DROP COLUMN `userLevelId`,
    ADD COLUMN `adminId` INTEGER NULL,
    ADD COLUMN `aksesLevelId` INTEGER NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `dekanId` INTEGER NULL,
    ADD COLUMN `kadepId` INTEGER NULL,
    ADD COLUMN `kaprodiId` INTEGER NULL,
    ADD COLUMN `kasubbagAkademikId` INTEGER NULL,
    ADD COLUMN `kasubbagKemahasiswaanId` INTEGER NULL,
    ADD COLUMN `ktuId` INTEGER NULL,
    ADD COLUMN `operatorAkademikId` INTEGER NULL,
    ADD COLUMN `operatorKemahasiswaanId` INTEGER NULL,
    ADD COLUMN `pimpinanFakultasId` INTEGER NULL,
    ADD COLUMN `ulid` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `wd1Id` INTEGER NULL,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- DropTable
DROP TABLE `Dosen`;

-- DropTable
DROP TABLE `Mahasiswa`;

-- DropTable
DROP TABLE `StatusHistory`;

-- DropTable
DROP TABLE `UserLevel`;

-- CreateTable
CREATE TABLE `Admin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ulid` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `nip` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Admin_ulid_key`(`ulid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OperatorKemahasiswaan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ulid` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `nip` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `OperatorKemahasiswaan_ulid_key`(`ulid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OperatorAkademik` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ulid` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `nip` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `OperatorAkademik_ulid_key`(`ulid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ktu` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ulid` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `nip` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Ktu_ulid_key`(`ulid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `KasubbagKemahasiswaan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ulid` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `nip` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `KasubbagKemahasiswaan_ulid_key`(`ulid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `KasubbagAkademik` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ulid` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `nip` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `KasubbagAkademik_ulid_key`(`ulid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Wd1` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ulid` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `nip` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Wd1_ulid_key`(`ulid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `KepalaDepertemen` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ulid` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `nip` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `KepalaDepertemen_ulid_key`(`ulid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `KepalaProdi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ulid` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `nip` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `KepalaProdi_ulid_key`(`ulid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PimpinanFakultas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ulid` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `nip` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `PimpinanFakultas_ulid_key`(`ulid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AksesLevel` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ulid` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `AksesLevel_ulid_key`(`ulid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Menu` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ulid` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NOT NULL,
    `aksesLevelId` INTEGER NOT NULL,
    `aclId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Menu_ulid_key`(`ulid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PengajuanYudisium` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ulid` VARCHAR(191) NOT NULL,
    `dokumenUrl` VARCHAR(191) NOT NULL,
    `verifikasiStatus` VARCHAR(191) NOT NULL,
    `alasanPenolakan` TEXT NULL,
    `statusId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `PengajuanYudisium_ulid_key`(`ulid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LegalisirIjazah` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ulid` VARCHAR(191) NOT NULL,
    `dokumenUrl` VARCHAR(191) NOT NULL,
    `verifikasiStatus` VARCHAR(191) NOT NULL,
    `alasanPenolakan` TEXT NULL,
    `statusId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `LegalisirIjazah_ulid_key`(`ulid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Status` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ulid` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `deskripsi` TEXT NOT NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Status_ulid_key`(`ulid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ulid` VARCHAR(191) NOT NULL,
    `flagMenu` VARCHAR(191) NOT NULL,
    `deskripsi` TEXT NOT NULL,
    `aksesLevelId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Log_ulid_key`(`ulid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Acl_ulid_key` ON `Acl`(`ulid`);

-- CreateIndex
CREATE UNIQUE INDEX `Action_ulid_key` ON `Action`(`ulid`);

-- CreateIndex
CREATE UNIQUE INDEX `Action_nama_key` ON `Action`(`nama`);

-- CreateIndex
CREATE UNIQUE INDEX `CutiSementara_ulid_key` ON `CutiSementara`(`ulid`);

-- CreateIndex
CREATE UNIQUE INDEX `Dekan_ulid_key` ON `Dekan`(`ulid`);

-- CreateIndex
CREATE UNIQUE INDEX `Feature_ulid_key` ON `Feature`(`ulid`);

-- CreateIndex
CREATE UNIQUE INDEX `Feature_nama_key` ON `Feature`(`nama`);

-- CreateIndex
CREATE UNIQUE INDEX `SuratKeteranganKuliah_ulid_key` ON `SuratKeteranganKuliah`(`ulid`);

-- CreateIndex
CREATE UNIQUE INDEX `User_ulid_key` ON `User`(`ulid`);

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `Admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_operatorKemahasiswaanId_fkey` FOREIGN KEY (`operatorKemahasiswaanId`) REFERENCES `OperatorKemahasiswaan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_operatorAkademikId_fkey` FOREIGN KEY (`operatorAkademikId`) REFERENCES `OperatorAkademik`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_ktuId_fkey` FOREIGN KEY (`ktuId`) REFERENCES `Ktu`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_kasubbagKemahasiswaanId_fkey` FOREIGN KEY (`kasubbagKemahasiswaanId`) REFERENCES `KasubbagKemahasiswaan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_kasubbagAkademikId_fkey` FOREIGN KEY (`kasubbagAkademikId`) REFERENCES `KasubbagAkademik`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_dekanId_fkey` FOREIGN KEY (`dekanId`) REFERENCES `Dekan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_wd1Id_fkey` FOREIGN KEY (`wd1Id`) REFERENCES `Wd1`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_kadepId_fkey` FOREIGN KEY (`kadepId`) REFERENCES `KepalaDepertemen`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_kaprodiId_fkey` FOREIGN KEY (`kaprodiId`) REFERENCES `KepalaProdi`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_pimpinanFakultasId_fkey` FOREIGN KEY (`pimpinanFakultasId`) REFERENCES `PimpinanFakultas`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_aksesLevelId_fkey` FOREIGN KEY (`aksesLevelId`) REFERENCES `AksesLevel`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Menu` ADD CONSTRAINT `Menu_aksesLevelId_fkey` FOREIGN KEY (`aksesLevelId`) REFERENCES `AksesLevel`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Action` ADD CONSTRAINT `Action_featureId_fkey` FOREIGN KEY (`featureId`) REFERENCES `Feature`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Acl` ADD CONSTRAINT `Acl_featureId_fkey` FOREIGN KEY (`featureId`) REFERENCES `Feature`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Acl` ADD CONSTRAINT `Acl_actionId_fkey` FOREIGN KEY (`actionId`) REFERENCES `Action`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Acl` ADD CONSTRAINT `Acl_aksesLevelId_fkey` FOREIGN KEY (`aksesLevelId`) REFERENCES `AksesLevel`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SuratKeteranganKuliah` ADD CONSTRAINT `SuratKeteranganKuliah_statusId_fkey` FOREIGN KEY (`statusId`) REFERENCES `Status`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SuratKeteranganKuliah` ADD CONSTRAINT `SuratKeteranganKuliah_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CutiSementara` ADD CONSTRAINT `CutiSementara_statusId_fkey` FOREIGN KEY (`statusId`) REFERENCES `Status`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CutiSementara` ADD CONSTRAINT `CutiSementara_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PengajuanYudisium` ADD CONSTRAINT `PengajuanYudisium_statusId_fkey` FOREIGN KEY (`statusId`) REFERENCES `Status`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PengajuanYudisium` ADD CONSTRAINT `PengajuanYudisium_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LegalisirIjazah` ADD CONSTRAINT `LegalisirIjazah_statusId_fkey` FOREIGN KEY (`statusId`) REFERENCES `Status`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LegalisirIjazah` ADD CONSTRAINT `LegalisirIjazah_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Status` ADD CONSTRAINT `Status_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Log` ADD CONSTRAINT `Log_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
