import { container } from "tsyringe";
import { EmailService  } from "../services/email/email.service";
import { UserService } from "../../modules/user/user.service";
import { UserRepository } from "../../modules/user/user.repository";
import { AuthService } from "../../modules/auth/auth.service";
import { AuthRepository } from "../../modules/auth/auth.repository";
import { HashService } from "../services/security/hash.service";
import { SessionTokenService } from "../services/security/session-token.service";
import { ResetTokenService } from "../services/security/reset-token.service";

container.register<UserService>("UserService", { useClass: UserService });
container.register<AuthService>("AuthService", { useClass: AuthService });
container.register<EmailService>("EmailService", { useClass: EmailService });
container.register<SessionTokenService>("SessionTokenService", { useClass: SessionTokenService });
container.register<ResetTokenService>("ResetTokenService", { useClass: ResetTokenService });
container.register<HashService>("HashService", { useClass: HashService});

container.register<UserRepository>("UserRepository", { useClass: UserRepository });
container.register<AuthRepository>("AuthRepository", { useClass: AuthRepository });
