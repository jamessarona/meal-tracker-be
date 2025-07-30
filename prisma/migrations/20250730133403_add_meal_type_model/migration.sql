-- CreateTable
CREATE TABLE "mealtracker_dev"."meal_types" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "meal_types_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "meal_types_name_idx" ON "mealtracker_dev"."meal_types"("name");

-- AddForeignKey
ALTER TABLE "mealtracker_dev"."users" ADD CONSTRAINT "users_meal_type_id_fkey" FOREIGN KEY ("meal_type_id") REFERENCES "mealtracker_dev"."meal_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;
