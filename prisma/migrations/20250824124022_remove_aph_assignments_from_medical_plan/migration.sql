/*
  Warnings:

  - You are about to drop the column `medical_plan_id` on the `planning_assignments` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."planning_assignments" DROP CONSTRAINT "planning_assignments_medical_plan_id_fkey";

-- AlterTable
ALTER TABLE "public"."planning_assignments" DROP COLUMN "medical_plan_id";
