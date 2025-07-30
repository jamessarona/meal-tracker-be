-- CreateTable
CREATE TABLE "mealtracker_dev"."locations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "locations_name_key" ON "mealtracker_dev"."locations"("name");

-- CreateIndex
CREATE INDEX "locations_name_idx" ON "mealtracker_dev"."locations"("name");
