-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ulid` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NULL,
    `npm` VARCHAR(191) NULL,
    `semester` INTEGER NULL,
    `adminId` INTEGER NULL,
    `operatorKemahasiswaanId` INTEGER NULL,
    `operatorAkademikId` INTEGER NULL,
    `ktuId` INTEGER NULL,
    `kasubbagKemahasiswaanId` INTEGER NULL,
    `kasubbagAkademikId` INTEGER NULL,
    `dekanId` INTEGER NULL,
    `wd1Id` INTEGER NULL,
    `kadepId` INTEGER NULL,
    `kaprodiId` INTEGER NULL,
    `pimpinanFakultasId` INTEGER NULL,
    `aksesLevelId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_ulid_key`(`ulid`),
    UNIQUE INDEX `User_npm_key`(`npm`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Admin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ulid` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `nip` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Admin_ulid_key`(`ulid`),
    UNIQUE INDEX `Admin_nip_key`(`nip`),
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
    UNIQUE INDEX `OperatorKemahasiswaan_nip_key`(`nip`),
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
    UNIQUE INDEX `OperatorAkademik_nip_key`(`nip`),
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
    UNIQUE INDEX `Ktu_nip_key`(`nip`),
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
    UNIQUE INDEX `KasubbagKemahasiswaan_nip_key`(`nip`),
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
    UNIQUE INDEX `KasubbagAkademik_nip_key`(`nip`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Dekan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ulid` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `nip` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Dekan_ulid_key`(`ulid`),
    UNIQUE INDEX `Dekan_nip_key`(`nip`),
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
    UNIQUE INDEX `Wd1_nip_key`(`nip`),
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
    UNIQUE INDEX `KepalaDepertemen_nip_key`(`nip`),
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
    UNIQUE INDEX `KepalaProdi_nip_key`(`nip`),
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
    UNIQUE INDEX `PimpinanFakultas_nip_key`(`nip`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AksesLevel` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ulid` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `AksesLevel_ulid_key`(`ulid`),
    UNIQUE INDEX `AksesLevel_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Menu` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ulid` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NULL,
    `parentMenu` ENUM('KEMAHASISWAAN', 'AKADEMIK') NULL,
    `aksesLevelId` INTEGER NOT NULL,
    `aclId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Menu_ulid_key`(`ulid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Feature` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ulid` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Feature_ulid_key`(`ulid`),
    UNIQUE INDEX `Feature_nama_key`(`nama`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Action` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ulid` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `namaFitur` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Action_ulid_key`(`ulid`),
    UNIQUE INDEX `Action_namaFitur_nama_key`(`namaFitur`, `nama`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Acl` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ulid` VARCHAR(191) NOT NULL,
    `namaFitur` VARCHAR(191) NOT NULL,
    `namaAksi` VARCHAR(191) NOT NULL,
    `aksesLevelId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Acl_ulid_key`(`ulid`),
    UNIQUE INDEX `Acl_namaFitur_namaAksi_aksesLevelId_key`(`namaFitur`, `namaAksi`, `aksesLevelId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SuratKeteranganKuliah` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ulid` VARCHAR(191) NOT NULL,
    `tipeSurat` ENUM('KP4', 'SK_PENSIUN', 'SURAT_KETERANGAN_PERUSAHAAN', 'LAINNYA') NOT NULL,
    `deskripsi` TEXT NOT NULL,
    `dokumenUrl` VARCHAR(191) NOT NULL,
    `verifikasiStatus` VARCHAR(191) NOT NULL DEFAULT 'DIPROSES OLEH OPERATOR KEMAHASISWAAN',
    `alasanPenolakan` TEXT NULL,
    `nomorSurat` VARCHAR(191) NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `SuratKeteranganKuliah_ulid_key`(`ulid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CutiSementara` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ulid` VARCHAR(191) NOT NULL,
    `suratIzinOrangTuaUrl` VARCHAR(191) NOT NULL,
    `suratBssUrl` VARCHAR(191) NOT NULL,
    `suratBebasPustakaUrl` VARCHAR(191) NOT NULL,
    `alasanPengajuan` TEXT NOT NULL,
    `verifikasiStatus` VARCHAR(191) NOT NULL DEFAULT 'DIPROSES OLEH OPERATOR KEMAHASISWAAN',
    `alasanPenolakan` TEXT NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `CutiSementara_ulid_key`(`ulid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PengajuanYudisium` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ulid` VARCHAR(191) NOT NULL,
    `suratPendaftaran` VARCHAR(191) NOT NULL,
    `suratBebasLab` VARCHAR(191) NOT NULL,
    `suratBebasPerpustakaan` VARCHAR(191) NOT NULL,
    `suratDistribusiSkripsi` VARCHAR(191) NOT NULL,
    `suratPendaftaranIka` VARCHAR(191) NOT NULL,
    `verifikasiStatus` VARCHAR(191) NOT NULL DEFAULT 'DIPROSES OLEH OPERATOR AKADEMIK',
    `alasanPenolakan` TEXT NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `PengajuanYudisium_ulid_key`(`ulid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LegalisirIjazah` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ulid` VARCHAR(191) NOT NULL,
    `totalLegalisir` INTEGER NOT NULL,
    `namaRekening` VARCHAR(191) NULL,
    `nomorRekening` VARCHAR(191) NULL,
    `namaBank` VARCHAR(191) NULL,
    `buktiPembayaran` VARCHAR(191) NOT NULL,
    `buktiPembayaranOngkir` VARCHAR(191) NULL,
    `buktiIjazah` VARCHAR(191) NOT NULL,
    `buktiTranskrip` VARCHAR(191) NOT NULL,
    `verifikasiStatus` VARCHAR(191) NOT NULL DEFAULT 'DIPROSES OLEH OPERATOR AKADEMIK',
    `alasanPenolakan` TEXT NULL,
    `tanggalPengambilan` VARCHAR(191) NULL,
    `noResi` VARCHAR(191) NULL,
    `tipePengambilan` ENUM('SEND', 'COD') NULL,
    `alamatPengiriman` VARCHAR(191) NULL,
    `tempatPengambilan` VARCHAR(191) NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `LegalisirIjazah_ulid_key`(`ulid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SuratKeteranganLulus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ulid` VARCHAR(191) NOT NULL,
    `tipeSurat` ENUM('UNTUK_BEKERJA', 'UNTUK_MELANJUTKAN_STUDI', 'UNTUK_BEASISWA', 'LAINNYA') NOT NULL,
    `deskripsi` TEXT NOT NULL,
    `dokumenTranskrip` VARCHAR(191) NOT NULL,
    `verifikasiStatus` VARCHAR(191) NOT NULL DEFAULT 'DIPROSES OLEH OPERATOR KEMAHASISWAAN',
    `alasanPenolakan` TEXT NULL,
    `nomorSurat` VARCHAR(191) NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `SuratKeteranganLulus_ulid_key`(`ulid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

-- CreateTable
CREATE TABLE `_CutiSementaraToStatus` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CutiSementaraToStatus_AB_unique`(`A`, `B`),
    INDEX `_CutiSementaraToStatus_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PengajuanYudisiumToStatus` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_PengajuanYudisiumToStatus_AB_unique`(`A`, `B`),
    INDEX `_PengajuanYudisiumToStatus_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_LegalisirIjazahToStatus` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_LegalisirIjazahToStatus_AB_unique`(`A`, `B`),
    INDEX `_LegalisirIjazahToStatus_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_RekomendasiBeasiswaToStatus` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_RekomendasiBeasiswaToStatus_AB_unique`(`A`, `B`),
    INDEX `_RekomendasiBeasiswaToStatus_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_StatusToSuratKeteranganKuliah` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_StatusToSuratKeteranganKuliah_AB_unique`(`A`, `B`),
    INDEX `_StatusToSuratKeteranganKuliah_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_StatusToSuratKeteranganLulus` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_StatusToSuratKeteranganLulus_AB_unique`(`A`, `B`),
    INDEX `_StatusToSuratKeteranganLulus_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
ALTER TABLE `Action` ADD CONSTRAINT `Action_namaFitur_fkey` FOREIGN KEY (`namaFitur`) REFERENCES `Feature`(`nama`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Acl` ADD CONSTRAINT `Acl_namaFitur_fkey` FOREIGN KEY (`namaFitur`) REFERENCES `Feature`(`nama`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Acl` ADD CONSTRAINT `Acl_aksesLevelId_fkey` FOREIGN KEY (`aksesLevelId`) REFERENCES `AksesLevel`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SuratKeteranganKuliah` ADD CONSTRAINT `SuratKeteranganKuliah_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CutiSementara` ADD CONSTRAINT `CutiSementara_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PengajuanYudisium` ADD CONSTRAINT `PengajuanYudisium_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LegalisirIjazah` ADD CONSTRAINT `LegalisirIjazah_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SuratKeteranganLulus` ADD CONSTRAINT `SuratKeteranganLulus_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RekomendasiBeasiswa` ADD CONSTRAINT `RekomendasiBeasiswa_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Status` ADD CONSTRAINT `Status_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Log` ADD CONSTRAINT `Log_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CutiSementaraToStatus` ADD CONSTRAINT `_CutiSementaraToStatus_A_fkey` FOREIGN KEY (`A`) REFERENCES `CutiSementara`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CutiSementaraToStatus` ADD CONSTRAINT `_CutiSementaraToStatus_B_fkey` FOREIGN KEY (`B`) REFERENCES `Status`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PengajuanYudisiumToStatus` ADD CONSTRAINT `_PengajuanYudisiumToStatus_A_fkey` FOREIGN KEY (`A`) REFERENCES `PengajuanYudisium`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PengajuanYudisiumToStatus` ADD CONSTRAINT `_PengajuanYudisiumToStatus_B_fkey` FOREIGN KEY (`B`) REFERENCES `Status`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_LegalisirIjazahToStatus` ADD CONSTRAINT `_LegalisirIjazahToStatus_A_fkey` FOREIGN KEY (`A`) REFERENCES `LegalisirIjazah`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_LegalisirIjazahToStatus` ADD CONSTRAINT `_LegalisirIjazahToStatus_B_fkey` FOREIGN KEY (`B`) REFERENCES `Status`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RekomendasiBeasiswaToStatus` ADD CONSTRAINT `_RekomendasiBeasiswaToStatus_A_fkey` FOREIGN KEY (`A`) REFERENCES `RekomendasiBeasiswa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RekomendasiBeasiswaToStatus` ADD CONSTRAINT `_RekomendasiBeasiswaToStatus_B_fkey` FOREIGN KEY (`B`) REFERENCES `Status`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_StatusToSuratKeteranganKuliah` ADD CONSTRAINT `_StatusToSuratKeteranganKuliah_A_fkey` FOREIGN KEY (`A`) REFERENCES `Status`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_StatusToSuratKeteranganKuliah` ADD CONSTRAINT `_StatusToSuratKeteranganKuliah_B_fkey` FOREIGN KEY (`B`) REFERENCES `SuratKeteranganKuliah`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_StatusToSuratKeteranganLulus` ADD CONSTRAINT `_StatusToSuratKeteranganLulus_A_fkey` FOREIGN KEY (`A`) REFERENCES `Status`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_StatusToSuratKeteranganLulus` ADD CONSTRAINT `_StatusToSuratKeteranganLulus_B_fkey` FOREIGN KEY (`B`) REFERENCES `SuratKeteranganLulus`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
