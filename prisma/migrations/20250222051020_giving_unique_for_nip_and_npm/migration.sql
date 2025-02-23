/*
  Warnings:

  - A unique constraint covering the columns `[nip]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nip]` on the table `Dekan` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nip]` on the table `KasubbagAkademik` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nip]` on the table `KasubbagKemahasiswaan` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nip]` on the table `KepalaDepertemen` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nip]` on the table `KepalaProdi` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nip]` on the table `Ktu` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nip]` on the table `OperatorAkademik` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nip]` on the table `OperatorKemahasiswaan` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nip]` on the table `PimpinanFakultas` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[npm]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nip]` on the table `Wd1` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `npm` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `npm` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Admin_nip_key` ON `Admin`(`nip`);

-- CreateIndex
CREATE UNIQUE INDEX `Dekan_nip_key` ON `Dekan`(`nip`);

-- CreateIndex
CREATE UNIQUE INDEX `KasubbagAkademik_nip_key` ON `KasubbagAkademik`(`nip`);

-- CreateIndex
CREATE UNIQUE INDEX `KasubbagKemahasiswaan_nip_key` ON `KasubbagKemahasiswaan`(`nip`);

-- CreateIndex
CREATE UNIQUE INDEX `KepalaDepertemen_nip_key` ON `KepalaDepertemen`(`nip`);

-- CreateIndex
CREATE UNIQUE INDEX `KepalaProdi_nip_key` ON `KepalaProdi`(`nip`);

-- CreateIndex
CREATE UNIQUE INDEX `Ktu_nip_key` ON `Ktu`(`nip`);

-- CreateIndex
CREATE UNIQUE INDEX `OperatorAkademik_nip_key` ON `OperatorAkademik`(`nip`);

-- CreateIndex
CREATE UNIQUE INDEX `OperatorKemahasiswaan_nip_key` ON `OperatorKemahasiswaan`(`nip`);

-- CreateIndex
CREATE UNIQUE INDEX `PimpinanFakultas_nip_key` ON `PimpinanFakultas`(`nip`);

-- CreateIndex
CREATE UNIQUE INDEX `User_npm_key` ON `User`(`npm`);

-- CreateIndex
CREATE UNIQUE INDEX `Wd1_nip_key` ON `Wd1`(`nip`);
