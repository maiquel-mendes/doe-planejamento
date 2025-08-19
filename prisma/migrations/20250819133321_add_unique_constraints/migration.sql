/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `operational_functions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[introduction]` on the table `operational_plannings` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "operational_functions_name_key" ON "public"."operational_functions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "operational_plannings_introduction_key" ON "public"."operational_plannings"("introduction");
