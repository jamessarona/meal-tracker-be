-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MANAGEMENT', 'EMPLOYEE', 'VENDOR');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'EMPLOYEE',
    "employee_id" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "middle_name" TEXT,
    "last_name" TEXT NOT NULL,
    "position" TEXT,
    "manager" TEXT,
    "cluster" TEXT,
    "meal_type_id" INTEGER,
    "verification_code" TEXT,
    "verification_expiry" TIMESTAMP(3),
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "verified_at" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_employee_id_key" ON "users"("employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
