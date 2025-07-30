import { container } from "tsyringe";
import { EmailService  } from "../services/email/email.service";
import { UserService } from "../../modules/user/user.service";
import { UserRepository } from "../../modules/user/user.repository";
import { AuthService } from "../../modules/auth/auth.service";
import { AuthRepository } from "../../modules/auth/auth.repository";
import { HashService } from "../services/security/hash.service";
import { SessionTokenService } from "../services/security/session-token.service";
import { ResetTokenService } from "../services/security/reset-token.service";
import { AuditLogService } from "../../modules/audit-log/audit-log.service";
import { MealTypeRepository } from "../../modules/meal-type/meal-type.repository";
import { MealTypeService } from "../../modules/meal-type/meal-type.service";
import { PrismaClient } from "@prisma/client";
import prisma from "../../prisma/client";

container.register<UserService>("UserService", { useClass: UserService });
container.register<AuthService>("AuthService", { useClass: AuthService });
container.register<EmailService>("EmailService", { useClass: EmailService });
container.register<SessionTokenService>("SessionTokenService", { useClass: SessionTokenService });
container.register<ResetTokenService>("ResetTokenService", { useClass: ResetTokenService });
container.register<HashService>("HashService", { useClass: HashService});
container.register<AuditLogService>("AuditLogService", { useClass: AuditLogService });
container.register<MealTypeService>("MealTypeService", { useClass: MealTypeService });

container.register<UserRepository>("UserRepository", { useClass: UserRepository });
container.register<AuthRepository>("AuthRepository", { useClass: AuthRepository });
container.register<MealTypeRepository>("MealTypeRepository", { useClass: MealTypeRepository });

container.registerInstance<PrismaClient>("PrismaClient", prisma);