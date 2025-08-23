/*
  Warnings:

  - You are about to drop the `operational_functions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_OperationalFunctionToPlanningAssignment" DROP CONSTRAINT "_OperationalFunctionToPlanningAssignment_A_fkey";

-- DropTable
DROP TABLE "public"."operational_functions";

-- CreateTable
CREATE TABLE "public"."OperationalFunction" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OperationalFunction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OperationalFunction_name_key" ON "public"."OperationalFunction"("name");

-- AddForeignKey
ALTER TABLE "public"."_OperationalFunctionToPlanningAssignment" ADD CONSTRAINT "_OperationalFunctionToPlanningAssignment_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."OperationalFunction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
