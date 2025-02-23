/*
  Warnings:

  - A unique constraint covering the columns `[namaFitur,namaAksi,aksesLevelId]` on the table `Acl` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[namaFitur,nama]` on the table `Action` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Action_nama_key` ON `Action`;

-- CreateIndex
CREATE UNIQUE INDEX `Acl_namaFitur_namaAksi_aksesLevelId_key` ON `Acl`(`namaFitur`, `namaAksi`, `aksesLevelId`);

-- CreateIndex
CREATE UNIQUE INDEX `Action_namaFitur_nama_key` ON `Action`(`namaFitur`, `nama`);
