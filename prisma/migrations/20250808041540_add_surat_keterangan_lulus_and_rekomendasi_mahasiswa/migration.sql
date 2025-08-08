-- CreateTable
CREATE TABLE `SuratKeteranganLulus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ulid` VARCHAR(191) NOT NULL,
    `tipeSurat` ENUM('UNTUK_BEKERJA', 'UNTUK_MELANJUTKAN_STUDI', 'UNTUK_BEASISWA', 'LAINNYA') NOT NULL,
    `deskripsi` TEXT NOT NULL,
    `dokumenTranskrip` VARCHAR(191) NOT NULL,
    `dokumenIjazah` VARCHAR(191) NOT NULL,
    `verifikasiStatus` VARCHAR(191) NOT NULL DEFAULT 'DIPROSES OLEH OPERATOR KEMAHASISWAAN',
    `alasanPenolakan` TEXT NULL,
    `nomorSurat` VARCHAR(191) NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `SuratKeteranganLulus_ulid_key`(`ulid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RekomendasiMahasiswa` (
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

    UNIQUE INDEX `RekomendasiMahasiswa_ulid_key`(`ulid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_RekomendasiMahasiswaToStatus` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_RekomendasiMahasiswaToStatus_AB_unique`(`A`, `B`),
    INDEX `_RekomendasiMahasiswaToStatus_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_StatusToSuratKeteranganLulus` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_StatusToSuratKeteranganLulus_AB_unique`(`A`, `B`),
    INDEX `_StatusToSuratKeteranganLulus_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SuratKeteranganLulus` ADD CONSTRAINT `SuratKeteranganLulus_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RekomendasiMahasiswa` ADD CONSTRAINT `RekomendasiMahasiswa_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RekomendasiMahasiswaToStatus` ADD CONSTRAINT `_RekomendasiMahasiswaToStatus_A_fkey` FOREIGN KEY (`A`) REFERENCES `RekomendasiMahasiswa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RekomendasiMahasiswaToStatus` ADD CONSTRAINT `_RekomendasiMahasiswaToStatus_B_fkey` FOREIGN KEY (`B`) REFERENCES `Status`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_StatusToSuratKeteranganLulus` ADD CONSTRAINT `_StatusToSuratKeteranganLulus_A_fkey` FOREIGN KEY (`A`) REFERENCES `Status`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_StatusToSuratKeteranganLulus` ADD CONSTRAINT `_StatusToSuratKeteranganLulus_B_fkey` FOREIGN KEY (`B`) REFERENCES `SuratKeteranganLulus`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
