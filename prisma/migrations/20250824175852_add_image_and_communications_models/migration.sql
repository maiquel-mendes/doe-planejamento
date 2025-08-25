-- DropForeignKey
ALTER TABLE "public"."introduction_sections" DROP CONSTRAINT "introduction_sections_planning_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."medical_plans" DROP CONSTRAINT "medical_plans_planning_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."planning_assignments" DROP CONSTRAINT "planning_assignments_planning_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."planning_schedule_items" DROP CONSTRAINT "planning_schedule_items_planning_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."planning_targets" DROP CONSTRAINT "planning_targets_planning_id_fkey";

-- CreateTable
CREATE TABLE "public"."communications_plans" (
    "id" TEXT NOT NULL,
    "operatorChannel" TEXT NOT NULL,
    "vehicleChannel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "planningId" TEXT NOT NULL,

    CONSTRAINT "communications_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."images" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "altText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "planningTargetId" TEXT,
    "locationId" TEXT,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "communications_plans_planningId_key" ON "public"."communications_plans"("planningId");

-- AddForeignKey
ALTER TABLE "public"."introduction_sections" ADD CONSTRAINT "introduction_sections_planning_id_fkey" FOREIGN KEY ("planning_id") REFERENCES "public"."operational_plannings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."planning_targets" ADD CONSTRAINT "planning_targets_planning_id_fkey" FOREIGN KEY ("planning_id") REFERENCES "public"."operational_plannings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."planning_assignments" ADD CONSTRAINT "planning_assignments_planning_id_fkey" FOREIGN KEY ("planning_id") REFERENCES "public"."operational_plannings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."planning_schedule_items" ADD CONSTRAINT "planning_schedule_items_planning_id_fkey" FOREIGN KEY ("planning_id") REFERENCES "public"."operational_plannings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."medical_plans" ADD CONSTRAINT "medical_plans_planning_id_fkey" FOREIGN KEY ("planning_id") REFERENCES "public"."operational_plannings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."communications_plans" ADD CONSTRAINT "communications_plans_planningId_fkey" FOREIGN KEY ("planningId") REFERENCES "public"."operational_plannings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."images" ADD CONSTRAINT "images_planningTargetId_fkey" FOREIGN KEY ("planningTargetId") REFERENCES "public"."planning_targets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."images" ADD CONSTRAINT "images_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "public"."locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
