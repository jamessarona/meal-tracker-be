-- CreateIndex
CREATE INDEX "users_first_name_idx" ON "mealtracker_dev"."users"("first_name");

-- CreateIndex
CREATE INDEX "users_last_name_idx" ON "mealtracker_dev"."users"("last_name");

-- CreateIndex
CREATE INDEX "users_employee_id_idx" ON "mealtracker_dev"."users"("employee_id");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "mealtracker_dev"."users"("email");

-- CreateIndex
CREATE INDEX "users_created_at_idx" ON "mealtracker_dev"."users"("created_at");
