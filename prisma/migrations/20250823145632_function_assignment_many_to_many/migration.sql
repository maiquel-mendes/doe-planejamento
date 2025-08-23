/*
  Warnings:

  - You are about to drop the column `function_id` on the `planning_assignments` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."planning_assignments" DROP CONSTRAINT "planning_assignments_function_id_fkey";

-- AlterTable
ALTER TABLE "public"."planning_assignments" DROP COLUMN "function_id";

-- CreateTable
CREATE TABLE "public"."_OperationalFunctionToPlanningAssignment" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_OperationalFunctionToPlanningAssignment_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_OperationalFunctionToPlanningAssignment_B_index" ON "public"."_OperationalFunctionToPlanningAssignment"("B");

-- AddForeignKey
ALTER TABLE "public"."_OperationalFunctionToPlanningAssignment" ADD CONSTRAINT "_OperationalFunctionToPlanningAssignment_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."operational_functions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_OperationalFunctionToPlanningAssignment" ADD CONSTRAINT "_OperationalFunctionToPlanningAssignment_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."planning_assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
