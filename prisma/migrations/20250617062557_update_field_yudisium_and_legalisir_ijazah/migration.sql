/*
  Warnings:

  - You are about to drop the column `dokumenUrl` on the `LegalisirIjazah` table. All the data in the column will be lost.
  - You are about to drop the column `dokumenUrl` on the `PengajuanYudisium` table. All the data in the column will be lost.
  - Added the required column `buktiPembayaran` to the `LegalisirIjazah` table without a default value. This is not possible if the table is not empty.
  - Added the required column `namaBank` to the `LegalisirIjazah` table without a default value. This is not possible if the table is not empty.
  - Added the required column `namaRekening` to the `LegalisirIjazah` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nomorRekening` to the `LegalisirIjazah` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalLegalisir` to the `LegalisirIjazah` table without a default value. This is not possible if the table is not empty.
  - Added the required column `suratBebasLab` to the `PengajuanYudisium` table without a default value. This is not possible if the table is not empty.
  - Added the required column `suratBebasPerpustakaan` to the `PengajuanYudisium` table without a default value. This is not possible if the table is not empty.
  - Added the required column `suratDistribusiSkripsi` to the `PengajuanYudisium` table without a default value. This is not possible if the table is not empty.
  - Added the required column `suratPendaftaran` to the `PengajuanYudisium` table without a default value. This is not possible if the table is not empty.
  - Added the required column `suratPendaftaranIka` to the `PengajuanYudisium` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `LegalisirIjazah` DROP COLUMN `dokumenUrl`,
    ADD COLUMN `buktiPembayaran` VARCHAR(191) NOT NULL,
    ADD COLUMN `namaBank` VARCHAR(191) NOT NULL,
    ADD COLUMN `namaRekening` VARCHAR(191) NOT NULL,
    ADD COLUMN `nomorRekening` VARCHAR(191) NOT NULL,
    ADD COLUMN `totalLegalisir` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `PengajuanYudisium` DROP COLUMN `dokumenUrl`,
    ADD COLUMN `suratBebasLab` VARCHAR(191) NOT NULL,
    ADD COLUMN `suratBebasPerpustakaan` VARCHAR(191) NOT NULL,
    ADD COLUMN `suratDistribusiSkripsi` VARCHAR(191) NOT NULL,
    ADD COLUMN `suratPendaftaran` VARCHAR(191) NOT NULL,
    ADD COLUMN `suratPendaftaranIka` VARCHAR(191) NOT NULL;
