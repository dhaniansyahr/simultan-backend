/*
  Warnings:

  - You are about to drop the `_rekomendasimahasiswatostatus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rekomendasimahasiswa` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_rekomendasimahasiswatostatus` DROP FOREIGN KEY `_RekomendasiMahasiswaToStatus_A_fkey`;

-- DropForeignKey
ALTER TABLE `_rekomendasimahasiswatostatus` DROP FOREIGN KEY `_RekomendasiMahasiswaToStatus_B_fkey`;

-- DropForeignKey
ALTER TABLE `rekomendasimahasiswa` DROP FOREIGN KEY `RekomendasiMahasiswa_userId_fkey`;

-- DropTable
DROP TABLE `_rekomendasimahasiswatostatus`;

-- DropTable
DROP TABLE `rekomendasimahasiswa`;

-- CreateTable
CREATE TABLE `RekomendasiBeasiswa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ulid` VARCHAR(191) NOT NULL,
    `tipeRekomendasi` ENUM('UNTUK_BEASISWA', 'UNTUK_MAGANG', 'UNTUK_KERJA', 'UNTUK_MELANJUTKAN_STUDI', 'LAINNYA') NOT NULL,
    `deskripsi` TEXT NOT NULL,
    `institusiTujuan` VARCHAR(191) NOT NULL,
    `dokumenPendukung` VARCHAR(191) NULL,
    `verifikasiStatus` VARCHAR(191) NOT NULL DEFAULT 'DIPROSES OLEH OPERATOR AKADEMIK',
    `alasanPenolakan` TEXT NULL,
    `nomorSurat` VARCHAR(191) NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `RekomendasiBeasiswa_ulid_key`(`ulid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_RekomendasiBeasiswaToStatus` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_RekomendasiBeasiswaToStatus_AB_unique`(`A`, `B`),
    INDEX `_RekomendasiBeasiswaToStatus_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RekomendasiBeasiswa` ADD CONSTRAINT `RekomendasiBeasiswa_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RekomendasiBeasiswaToStatus` ADD CONSTRAINT `_RekomendasiBeasiswaToStatus_A_fkey` FOREIGN KEY (`A`) REFERENCES `RekomendasiBeasiswa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RekomendasiBeasiswaToStatus` ADD CONSTRAINT `_RekomendasiBeasiswaToStatus_B_fkey` FOREIGN KEY (`B`) REFERENCES `Status`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
