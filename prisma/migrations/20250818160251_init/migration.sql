-- CreateTable
CREATE TABLE "public"."operational_plannings" (
    "_id" TEXT NOT NULL,
    "introduction" JSONB NOT NULL,
    "targets" JSONB NOT NULL,
    "images" JSONB NOT NULL,
    "assignments" JSONB NOT NULL,
    "schedule" JSONB NOT NULL,
    "communications" JSONB NOT NULL,
    "peculiarities" JSONB NOT NULL,
    "medical" JSONB NOT NULL,
    "complementary_measures" JSONB NOT NULL,
    "routes" JSONB NOT NULL,
    "locations" JSONB NOT NULL,
    "status" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "responsible_id" TEXT NOT NULL,
    "responsible_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "operational_plannings_pkey" PRIMARY KEY ("_id")
);
