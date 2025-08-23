/*
  Warnings:

  - You are about to drop the column `assignments` on the `operational_plannings` table. All the data in the column will be lost.
  - You are about to drop the column `communications` on the `operational_plannings` table. All the data in the column will be lost.
  - You are about to drop the column `complementary_measures` on the `operational_plannings` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `operational_plannings` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `operational_plannings` table. All the data in the column will be lost.
  - You are about to drop the column `introduction` on the `operational_plannings` table. All the data in the column will be lost.
  - You are about to drop the column `locations` on the `operational_plannings` table. All the data in the column will be lost.
  - You are about to drop the column `medical` on the `operational_plannings` table. All the data in the column will be lost.
  - You are about to drop the column `responsible_name` on the `operational_plannings` table. All the data in the column will be lost.
  - You are about to drop the column `routes` on the `operational_plannings` table. All the data in the column will be lost.
  - You are about to drop the column `schedule` on the `operational_plannings` table. All the data in the column will be lost.
  - You are about to drop the column `targets` on the `operational_plannings` table. All the data in the column will be lost.
  - Added the required column `created_by_id` to the `operational_plannings` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."operational_plannings_introduction_key";

-- AlterTable
ALTER TABLE "public"."operational_plannings" DROP COLUMN "assignments",
DROP COLUMN "communications",
DROP COLUMN "complementary_measures",
DROP COLUMN "created_by",
DROP COLUMN "images",
DROP COLUMN "introduction",
DROP COLUMN "locations",
DROP COLUMN "medical",
DROP COLUMN "responsible_name",
DROP COLUMN "routes",
DROP COLUMN "schedule",
DROP COLUMN "targets",
ADD COLUMN     "created_by_id" TEXT NOT NULL,
ALTER COLUMN "peculiarities" DROP NOT NULL,
ALTER COLUMN "peculiarities" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."users" ALTER COLUMN "is_active" SET DEFAULT true;

-- CreateTable
CREATE TABLE "public"."locations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."introduction_sections" (
    "id" TEXT NOT NULL,
    "service_order_number" TEXT NOT NULL,
    "operation_type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "support_unit" TEXT NOT NULL,
    "mandate_type" TEXT NOT NULL,
    "operation_date" TEXT NOT NULL,
    "operation_time" TEXT NOT NULL,
    "planning_id" TEXT NOT NULL,

    CONSTRAINT "introduction_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."planning_targets" (
    "id" TEXT NOT NULL,
    "target_name" TEXT NOT NULL,
    "description" TEXT,
    "location_id" TEXT NOT NULL,
    "planning_id" TEXT NOT NULL,

    CONSTRAINT "planning_targets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."planning_assignments" (
    "id" TEXT NOT NULL,
    "planning_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "function_id" TEXT NOT NULL,
    "vehicle_id" TEXT,
    "medical_plan_id" TEXT,

    CONSTRAINT "planning_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."planning_schedule_items" (
    "id" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "activity" TEXT NOT NULL,
    "responsible" TEXT NOT NULL,
    "planning_id" TEXT NOT NULL,

    CONSTRAINT "planning_schedule_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."medical_plans" (
    "id" TEXT NOT NULL,
    "procedures" TEXT NOT NULL,
    "planning_id" TEXT NOT NULL,
    "hospital_location_id" TEXT NOT NULL,
    "ambulance_vehicle_id" TEXT NOT NULL,

    CONSTRAINT "medical_plans_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "locations_name_key" ON "public"."locations"("name");

-- CreateIndex
CREATE UNIQUE INDEX "introduction_sections_service_order_number_key" ON "public"."introduction_sections"("service_order_number");

-- CreateIndex
CREATE UNIQUE INDEX "introduction_sections_planning_id_key" ON "public"."introduction_sections"("planning_id");

-- CreateIndex
CREATE UNIQUE INDEX "medical_plans_planning_id_key" ON "public"."medical_plans"("planning_id");

-- AddForeignKey
ALTER TABLE "public"."operational_plannings" ADD CONSTRAINT "operational_plannings_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."operational_plannings" ADD CONSTRAINT "operational_plannings_responsible_id_fkey" FOREIGN KEY ("responsible_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."introduction_sections" ADD CONSTRAINT "introduction_sections_planning_id_fkey" FOREIGN KEY ("planning_id") REFERENCES "public"."operational_plannings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."planning_targets" ADD CONSTRAINT "planning_targets_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."planning_targets" ADD CONSTRAINT "planning_targets_planning_id_fkey" FOREIGN KEY ("planning_id") REFERENCES "public"."operational_plannings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."planning_assignments" ADD CONSTRAINT "planning_assignments_function_id_fkey" FOREIGN KEY ("function_id") REFERENCES "public"."operational_functions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."planning_assignments" ADD CONSTRAINT "planning_assignments_medical_plan_id_fkey" FOREIGN KEY ("medical_plan_id") REFERENCES "public"."medical_plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."planning_assignments" ADD CONSTRAINT "planning_assignments_planning_id_fkey" FOREIGN KEY ("planning_id") REFERENCES "public"."operational_plannings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."planning_assignments" ADD CONSTRAINT "planning_assignments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."planning_assignments" ADD CONSTRAINT "planning_assignments_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."planning_schedule_items" ADD CONSTRAINT "planning_schedule_items_planning_id_fkey" FOREIGN KEY ("planning_id") REFERENCES "public"."operational_plannings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."medical_plans" ADD CONSTRAINT "medical_plans_ambulance_vehicle_id_fkey" FOREIGN KEY ("ambulance_vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."medical_plans" ADD CONSTRAINT "medical_plans_hospital_location_id_fkey" FOREIGN KEY ("hospital_location_id") REFERENCES "public"."locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."medical_plans" ADD CONSTRAINT "medical_plans_planning_id_fkey" FOREIGN KEY ("planning_id") REFERENCES "public"."operational_plannings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
