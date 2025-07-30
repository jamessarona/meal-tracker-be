-- CreateEnum
CREATE TYPE "mealtracker_dev"."LogAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE');

-- CreateTable
CREATE TABLE "mealtracker_dev"."audit_logs" (
    "id" SERIAL NOT NULL,
    "action" "mealtracker_dev"."LogAction" NOT NULL,
    "object_type" TEXT NOT NULL,
    "object_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mealtracker_dev"."audit_log_fields" (
    "id" SERIAL NOT NULL,
    "audit_log_id" INTEGER NOT NULL,
    "field" TEXT NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT,

    CONSTRAINT "audit_log_fields_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "audit_logs_user_id_idx" ON "mealtracker_dev"."audit_logs"("user_id");

-- CreateIndex
CREATE INDEX "audit_logs_object_type_object_id_idx" ON "mealtracker_dev"."audit_logs"("object_type", "object_id");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "mealtracker_dev"."audit_logs"("createdAt");

-- CreateIndex
CREATE INDEX "audit_log_fields_audit_log_id_idx" ON "mealtracker_dev"."audit_log_fields"("audit_log_id");

-- AddForeignKey
ALTER TABLE "mealtracker_dev"."audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "mealtracker_dev"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mealtracker_dev"."audit_log_fields" ADD CONSTRAINT "audit_log_fields_audit_log_id_fkey" FOREIGN KEY ("audit_log_id") REFERENCES "mealtracker_dev"."audit_logs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
