/*
  Warnings:

  - A unique constraint covering the columns `[publicId]` on the table `images` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `publicId` to the `images` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."images" ADD COLUMN     "publicId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "images_publicId_key" ON "public"."images"("publicId");
