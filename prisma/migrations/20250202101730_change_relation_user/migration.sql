/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Dekan` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Dosen` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Mahasiswa` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Dekan_userId_key` ON `Dekan`(`userId`);

-- CreateIndex
CREATE UNIQUE INDEX `Dosen_userId_key` ON `Dosen`(`userId`);

-- CreateIndex
CREATE UNIQUE INDEX `Mahasiswa_userId_key` ON `Mahasiswa`(`userId`);
