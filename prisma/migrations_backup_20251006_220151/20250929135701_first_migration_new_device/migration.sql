-- CreateEnum
CREATE TYPE "PARENT_MENU" AS ENUM ('KEMAHASISWAAN', 'AKADEMIK');

-- CreateEnum
CREATE TYPE "TipeSuratKeteranganKuliah" AS ENUM ('KP4', 'SK_PENSIUN', 'SURAT_KETERANGAN_PERUSAHAAN', 'LAINNYA');

-- CreateEnum
CREATE TYPE "TIPE_PENGAMBILAN" AS ENUM ('SEND', 'COD');

-- CreateEnum
CREATE TYPE "TipeSuratKeteranganLulus" AS ENUM ('UNTUK_BEKERJA', 'UNTUK_MELANJUTKAN_STUDI', 'UNTUK_BEASISWA', 'LAINNYA');

-- CreateEnum
CREATE TYPE "TipeRekomendasi" AS ENUM ('UNTUK_BEASISWA', 'UNTUK_MAGANG', 'UNTUK_KERJA', 'UNTUK_MELANJUTKAN_STUDI', 'LAINNYA');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "ulid" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nama" TEXT,
    "npm" TEXT,
    "adminId" INTEGER,
    "operatorKemahasiswaanId" INTEGER,
    "operatorAkademikId" INTEGER,
    "ktuId" INTEGER,
    "kasubbagKemahasiswaanId" INTEGER,
    "kasubbagAkademikId" INTEGER,
    "dekanId" INTEGER,
    "wd1Id" INTEGER,
    "kadepId" INTEGER,
    "kaprodiId" INTEGER,
    "pimpinanFakultasId" INTEGER,
    "aksesLevelId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "ulid" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nip" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OperatorKemahasiswaan" (
    "id" SERIAL NOT NULL,
    "ulid" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nip" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OperatorKemahasiswaan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OperatorAkademik" (
    "id" SERIAL NOT NULL,
    "ulid" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nip" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OperatorAkademik_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ktu" (
    "id" SERIAL NOT NULL,
    "ulid" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nip" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ktu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KasubbagKemahasiswaan" (
    "id" SERIAL NOT NULL,
    "ulid" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nip" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KasubbagKemahasiswaan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KasubbagAkademik" (
    "id" SERIAL NOT NULL,
    "ulid" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nip" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KasubbagAkademik_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dekan" (
    "id" SERIAL NOT NULL,
    "ulid" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nip" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Dekan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wd1" (
    "id" SERIAL NOT NULL,
    "ulid" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nip" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Wd1_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KepalaDepertemen" (
    "id" SERIAL NOT NULL,
    "ulid" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nip" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KepalaDepertemen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KepalaProdi" (
    "id" SERIAL NOT NULL,
    "ulid" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nip" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KepalaProdi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PimpinanFakultas" (
    "id" SERIAL NOT NULL,
    "ulid" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nip" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PimpinanFakultas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AksesLevel" (
    "id" SERIAL NOT NULL,
    "ulid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AksesLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Menu" (
    "id" SERIAL NOT NULL,
    "ulid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "icon" TEXT,
    "parentMenu" "PARENT_MENU",
    "aksesLevelId" INTEGER NOT NULL,
    "aclId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feature" (
    "id" SERIAL NOT NULL,
    "ulid" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Feature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Action" (
    "id" SERIAL NOT NULL,
    "ulid" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "namaFitur" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Action_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Acl" (
    "id" SERIAL NOT NULL,
    "ulid" TEXT NOT NULL,
    "namaFitur" TEXT NOT NULL,
    "namaAksi" TEXT NOT NULL,
    "aksesLevelId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Acl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SuratKeteranganKuliah" (
    "id" SERIAL NOT NULL,
    "ulid" TEXT NOT NULL,
    "tipeSurat" "TipeSuratKeteranganKuliah" NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "dokumenUrl" TEXT NOT NULL,
    "verifikasiStatus" TEXT NOT NULL DEFAULT 'DIPROSES OLEH OPERATOR KEMAHASISWAAN',
    "alasanPenolakan" TEXT,
    "nomorSurat" TEXT,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SuratKeteranganKuliah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CutiSementara" (
    "id" SERIAL NOT NULL,
    "ulid" TEXT NOT NULL,
    "suratIzinOrangTuaUrl" TEXT NOT NULL,
    "suratBssUrl" TEXT NOT NULL,
    "suratBebasPustakaUrl" TEXT NOT NULL,
    "alasanPengajuan" TEXT NOT NULL,
    "verifikasiStatus" TEXT NOT NULL DEFAULT 'DIPROSES OLEH OPERATOR KEMAHASISWAAN',
    "alasanPenolakan" TEXT,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CutiSementara_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PengajuanYudisium" (
    "id" SERIAL NOT NULL,
    "ulid" TEXT NOT NULL,
    "suratPendaftaran" TEXT NOT NULL,
    "suratBebasLab" TEXT NOT NULL,
    "suratBebasPerpustakaan" TEXT NOT NULL,
    "suratDistribusiSkripsi" TEXT NOT NULL,
    "suratPendaftaranIka" TEXT NOT NULL,
    "verifikasiStatus" TEXT NOT NULL DEFAULT 'DIPROSES OLEH OPERATOR AKADEMIK',
    "alasanPenolakan" TEXT,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PengajuanYudisium_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LegalisirIjazah" (
    "id" SERIAL NOT NULL,
    "ulid" TEXT NOT NULL,
    "totalLegalisir" INTEGER NOT NULL,
    "namaRekening" TEXT,
    "nomorRekening" TEXT,
    "namaBank" TEXT,
    "buktiPembayaran" TEXT NOT NULL,
    "buktiPembayaranOngkir" TEXT,
    "buktiIjazah" TEXT NOT NULL,
    "buktiTranskrip" TEXT NOT NULL,
    "verifikasiStatus" TEXT NOT NULL DEFAULT 'DIPROSES OLEH OPERATOR AKADEMIK',
    "alasanPenolakan" TEXT,
    "tanggalPengambilan" TEXT,
    "noResi" TEXT,
    "tipePengambilan" "TIPE_PENGAMBILAN",
    "alamatPengiriman" TEXT,
    "tempatPengambilan" TEXT,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LegalisirIjazah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SuratKeteranganLulus" (
    "id" SERIAL NOT NULL,
    "ulid" TEXT NOT NULL,
    "tipeSurat" "TipeSuratKeteranganLulus" NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "dokumenTranskrip" TEXT NOT NULL,
    "verifikasiStatus" TEXT NOT NULL DEFAULT 'DIPROSES OLEH OPERATOR KEMAHASISWAAN',
    "alasanPenolakan" TEXT,
    "nomorSurat" TEXT,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SuratKeteranganLulus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RekomendasiBeasiswa" (
    "id" SERIAL NOT NULL,
    "ulid" TEXT NOT NULL,
    "tipeRekomendasi" "TipeRekomendasi" NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "institusiTujuan" TEXT NOT NULL,
    "dokumenPendukung" TEXT,
    "verifikasiStatus" TEXT NOT NULL DEFAULT 'DIPROSES OLEH OPERATOR AKADEMIK',
    "alasanPenolakan" TEXT,
    "nomorSurat" TEXT,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RekomendasiBeasiswa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Status" (
    "id" SERIAL NOT NULL,
    "ulid" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Log" (
    "id" SERIAL NOT NULL,
    "ulid" TEXT NOT NULL,
    "flagMenu" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "aksesLevelId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CutiSementaraToStatus" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_PengajuanYudisiumToStatus" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_LegalisirIjazahToStatus" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_RekomendasiBeasiswaToStatus" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_StatusToSuratKeteranganKuliah" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_StatusToSuratKeteranganLulus" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_ulid_key" ON "User"("ulid");

-- CreateIndex
CREATE UNIQUE INDEX "User_npm_key" ON "User"("npm");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_ulid_key" ON "Admin"("ulid");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_nip_key" ON "Admin"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "OperatorKemahasiswaan_ulid_key" ON "OperatorKemahasiswaan"("ulid");

-- CreateIndex
CREATE UNIQUE INDEX "OperatorKemahasiswaan_nip_key" ON "OperatorKemahasiswaan"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "OperatorAkademik_ulid_key" ON "OperatorAkademik"("ulid");

-- CreateIndex
CREATE UNIQUE INDEX "OperatorAkademik_nip_key" ON "OperatorAkademik"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "Ktu_ulid_key" ON "Ktu"("ulid");

-- CreateIndex
CREATE UNIQUE INDEX "Ktu_nip_key" ON "Ktu"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "KasubbagKemahasiswaan_ulid_key" ON "KasubbagKemahasiswaan"("ulid");

-- CreateIndex
CREATE UNIQUE INDEX "KasubbagKemahasiswaan_nip_key" ON "KasubbagKemahasiswaan"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "KasubbagAkademik_ulid_key" ON "KasubbagAkademik"("ulid");

-- CreateIndex
CREATE UNIQUE INDEX "KasubbagAkademik_nip_key" ON "KasubbagAkademik"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "Dekan_ulid_key" ON "Dekan"("ulid");

-- CreateIndex
CREATE UNIQUE INDEX "Dekan_nip_key" ON "Dekan"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "Wd1_ulid_key" ON "Wd1"("ulid");

-- CreateIndex
CREATE UNIQUE INDEX "Wd1_nip_key" ON "Wd1"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "KepalaDepertemen_ulid_key" ON "KepalaDepertemen"("ulid");

-- CreateIndex
CREATE UNIQUE INDEX "KepalaDepertemen_nip_key" ON "KepalaDepertemen"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "KepalaProdi_ulid_key" ON "KepalaProdi"("ulid");

-- CreateIndex
CREATE UNIQUE INDEX "KepalaProdi_nip_key" ON "KepalaProdi"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "PimpinanFakultas_ulid_key" ON "PimpinanFakultas"("ulid");

-- CreateIndex
CREATE UNIQUE INDEX "PimpinanFakultas_nip_key" ON "PimpinanFakultas"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "AksesLevel_ulid_key" ON "AksesLevel"("ulid");

-- CreateIndex
CREATE UNIQUE INDEX "AksesLevel_name_key" ON "AksesLevel"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Menu_ulid_key" ON "Menu"("ulid");

-- CreateIndex
CREATE UNIQUE INDEX "Feature_ulid_key" ON "Feature"("ulid");

-- CreateIndex
CREATE UNIQUE INDEX "Feature_nama_key" ON "Feature"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "Action_ulid_key" ON "Action"("ulid");

-- CreateIndex
CREATE UNIQUE INDEX "Action_namaFitur_nama_key" ON "Action"("namaFitur", "nama");

-- CreateIndex
CREATE UNIQUE INDEX "Acl_ulid_key" ON "Acl"("ulid");

-- CreateIndex
CREATE UNIQUE INDEX "Acl_namaFitur_namaAksi_aksesLevelId_key" ON "Acl"("namaFitur", "namaAksi", "aksesLevelId");

-- CreateIndex
CREATE UNIQUE INDEX "SuratKeteranganKuliah_ulid_key" ON "SuratKeteranganKuliah"("ulid");

-- CreateIndex
CREATE UNIQUE INDEX "CutiSementara_ulid_key" ON "CutiSementara"("ulid");

-- CreateIndex
CREATE UNIQUE INDEX "PengajuanYudisium_ulid_key" ON "PengajuanYudisium"("ulid");

-- CreateIndex
CREATE UNIQUE INDEX "LegalisirIjazah_ulid_key" ON "LegalisirIjazah"("ulid");

-- CreateIndex
CREATE UNIQUE INDEX "SuratKeteranganLulus_ulid_key" ON "SuratKeteranganLulus"("ulid");

-- CreateIndex
CREATE UNIQUE INDEX "RekomendasiBeasiswa_ulid_key" ON "RekomendasiBeasiswa"("ulid");

-- CreateIndex
CREATE UNIQUE INDEX "Status_ulid_key" ON "Status"("ulid");

-- CreateIndex
CREATE UNIQUE INDEX "Log_ulid_key" ON "Log"("ulid");

-- CreateIndex
CREATE UNIQUE INDEX "_CutiSementaraToStatus_AB_unique" ON "_CutiSementaraToStatus"("A", "B");

-- CreateIndex
CREATE INDEX "_CutiSementaraToStatus_B_index" ON "_CutiSementaraToStatus"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PengajuanYudisiumToStatus_AB_unique" ON "_PengajuanYudisiumToStatus"("A", "B");

-- CreateIndex
CREATE INDEX "_PengajuanYudisiumToStatus_B_index" ON "_PengajuanYudisiumToStatus"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_LegalisirIjazahToStatus_AB_unique" ON "_LegalisirIjazahToStatus"("A", "B");

-- CreateIndex
CREATE INDEX "_LegalisirIjazahToStatus_B_index" ON "_LegalisirIjazahToStatus"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_RekomendasiBeasiswaToStatus_AB_unique" ON "_RekomendasiBeasiswaToStatus"("A", "B");

-- CreateIndex
CREATE INDEX "_RekomendasiBeasiswaToStatus_B_index" ON "_RekomendasiBeasiswaToStatus"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_StatusToSuratKeteranganKuliah_AB_unique" ON "_StatusToSuratKeteranganKuliah"("A", "B");

-- CreateIndex
CREATE INDEX "_StatusToSuratKeteranganKuliah_B_index" ON "_StatusToSuratKeteranganKuliah"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_StatusToSuratKeteranganLulus_AB_unique" ON "_StatusToSuratKeteranganLulus"("A", "B");

-- CreateIndex
CREATE INDEX "_StatusToSuratKeteranganLulus_B_index" ON "_StatusToSuratKeteranganLulus"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_operatorKemahasiswaanId_fkey" FOREIGN KEY ("operatorKemahasiswaanId") REFERENCES "OperatorKemahasiswaan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_operatorAkademikId_fkey" FOREIGN KEY ("operatorAkademikId") REFERENCES "OperatorAkademik"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_ktuId_fkey" FOREIGN KEY ("ktuId") REFERENCES "Ktu"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_kasubbagKemahasiswaanId_fkey" FOREIGN KEY ("kasubbagKemahasiswaanId") REFERENCES "KasubbagKemahasiswaan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_kasubbagAkademikId_fkey" FOREIGN KEY ("kasubbagAkademikId") REFERENCES "KasubbagAkademik"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_dekanId_fkey" FOREIGN KEY ("dekanId") REFERENCES "Dekan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_wd1Id_fkey" FOREIGN KEY ("wd1Id") REFERENCES "Wd1"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_kadepId_fkey" FOREIGN KEY ("kadepId") REFERENCES "KepalaDepertemen"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_kaprodiId_fkey" FOREIGN KEY ("kaprodiId") REFERENCES "KepalaProdi"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_pimpinanFakultasId_fkey" FOREIGN KEY ("pimpinanFakultasId") REFERENCES "PimpinanFakultas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_aksesLevelId_fkey" FOREIGN KEY ("aksesLevelId") REFERENCES "AksesLevel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_aksesLevelId_fkey" FOREIGN KEY ("aksesLevelId") REFERENCES "AksesLevel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_namaFitur_fkey" FOREIGN KEY ("namaFitur") REFERENCES "Feature"("nama") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Acl" ADD CONSTRAINT "Acl_namaFitur_fkey" FOREIGN KEY ("namaFitur") REFERENCES "Feature"("nama") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Acl" ADD CONSTRAINT "Acl_aksesLevelId_fkey" FOREIGN KEY ("aksesLevelId") REFERENCES "AksesLevel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuratKeteranganKuliah" ADD CONSTRAINT "SuratKeteranganKuliah_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CutiSementara" ADD CONSTRAINT "CutiSementara_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PengajuanYudisium" ADD CONSTRAINT "PengajuanYudisium_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LegalisirIjazah" ADD CONSTRAINT "LegalisirIjazah_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuratKeteranganLulus" ADD CONSTRAINT "SuratKeteranganLulus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RekomendasiBeasiswa" ADD CONSTRAINT "RekomendasiBeasiswa_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Status" ADD CONSTRAINT "Status_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CutiSementaraToStatus" ADD CONSTRAINT "_CutiSementaraToStatus_A_fkey" FOREIGN KEY ("A") REFERENCES "CutiSementara"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CutiSementaraToStatus" ADD CONSTRAINT "_CutiSementaraToStatus_B_fkey" FOREIGN KEY ("B") REFERENCES "Status"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PengajuanYudisiumToStatus" ADD CONSTRAINT "_PengajuanYudisiumToStatus_A_fkey" FOREIGN KEY ("A") REFERENCES "PengajuanYudisium"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PengajuanYudisiumToStatus" ADD CONSTRAINT "_PengajuanYudisiumToStatus_B_fkey" FOREIGN KEY ("B") REFERENCES "Status"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LegalisirIjazahToStatus" ADD CONSTRAINT "_LegalisirIjazahToStatus_A_fkey" FOREIGN KEY ("A") REFERENCES "LegalisirIjazah"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LegalisirIjazahToStatus" ADD CONSTRAINT "_LegalisirIjazahToStatus_B_fkey" FOREIGN KEY ("B") REFERENCES "Status"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RekomendasiBeasiswaToStatus" ADD CONSTRAINT "_RekomendasiBeasiswaToStatus_A_fkey" FOREIGN KEY ("A") REFERENCES "RekomendasiBeasiswa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RekomendasiBeasiswaToStatus" ADD CONSTRAINT "_RekomendasiBeasiswaToStatus_B_fkey" FOREIGN KEY ("B") REFERENCES "Status"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StatusToSuratKeteranganKuliah" ADD CONSTRAINT "_StatusToSuratKeteranganKuliah_A_fkey" FOREIGN KEY ("A") REFERENCES "Status"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StatusToSuratKeteranganKuliah" ADD CONSTRAINT "_StatusToSuratKeteranganKuliah_B_fkey" FOREIGN KEY ("B") REFERENCES "SuratKeteranganKuliah"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StatusToSuratKeteranganLulus" ADD CONSTRAINT "_StatusToSuratKeteranganLulus_A_fkey" FOREIGN KEY ("A") REFERENCES "Status"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StatusToSuratKeteranganLulus" ADD CONSTRAINT "_StatusToSuratKeteranganLulus_B_fkey" FOREIGN KEY ("B") REFERENCES "SuratKeteranganLulus"("id") ON DELETE CASCADE ON UPDATE CASCADE;
