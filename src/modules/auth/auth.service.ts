import { HashService } from '../../core/services/security/hash.service';
import { HttpError } from "../../utils/httpError";
import crypto, { Hash } from 'crypto';
import { inject, injectable } from "tsyringe";
import { EmailService } from "../../core/services/email/email.service";
import { ITokenService } from '../../core/services/security/itoken.service';
import { UserRepository } from "../user/user.repository";
import { AuthRepository } from "./auth.repository";
import { SessionPayload } from '../../core/services/security/session-token.service';
import { ResetPayload } from '../../core/services/security/reset-token.service';

interface LoginOptions {
  ip?: string;
  userAgent?: string;
  device?: string;
}

@injectable()
export class AuthService {
  constructor(
    @inject("EmailService") private emailService: EmailService,
    @inject("SessionTokenService") private sessionTokenService: ITokenService<SessionPayload>,
    @inject("ResetTokenService") private resetTokenService: ITokenService<ResetPayload>,
    @inject("UserRepository") private userRepository: UserRepository,
    @inject("AuthRepository") private authRepository: AuthRepository,
    @inject("HashService") private hashService: HashService,
  ) {}

  async sendVerificationCode(employee_id: number): Promise<void> {
    const user = await this.userRepository.findByEmployeeId(employee_id);
    if (!user) throw new HttpError("User not found", 404);
    if (user.is_verified) throw new HttpError("User is already verified", 400);

    const verification_code = crypto.randomInt(100000, 999999).toString();
    const verification_expiry = new Date(Date.now() + 15 * 60 * 1000);

    await this.authRepository.updateVerificationCode(employee_id, verification_code, verification_expiry);

    await this.emailService.sendVerificationCode(user.email, user.first_name, verification_code);
  }

  async verifyUserCode(employee_id: number, verification_code: string, new_password: string) {
    const user = await this.userRepository.findByEmployeeId(employee_id);
    if (!user) throw new HttpError('User not found', 404);
    if (user.is_verified) throw new HttpError('User is already verified', 400);

    if (
      !user.verification_code ||
      user.verification_code !== verification_code ||
      !user.verification_expiry ||
      new Date() > user.verification_expiry
    ) {
      throw new HttpError('Invalid or expired verification code', 400);
    }

    const hashedPassword  = await this.hashService.hash(new_password);

    await this.authRepository.verifyAndUpdatePassword(employee_id, hashedPassword);

    return { message: 'Account verified successfully' };
  }

  async login(employee_id: number, password: string, options: LoginOptions = {}) {
    const user = await this.userRepository.findByEmployeeId(employee_id);
    if (!user) throw new HttpError('Invalid credentials', 401);

    const isPasswordValid = await this.hashService.compare(password, user.password);
    if (!isPasswordValid) throw new HttpError('Invalid credentials', 401);
    if (!user.is_active) throw new HttpError('Account is inactive', 403);
    if (!user.is_verified) throw new HttpError('Account is not verified', 403);

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const payload: SessionPayload = {
      id: user.id,
      employee_id: user.employee_id,
      role: user.role,
      email: user.email,
    };

    const token = this.sessionTokenService.signToken(payload);

    await this.authRepository.createSession({
      token,
      employee_id: user.employee_id,
      ip_address: options.ip || null,
      user_agent: options.userAgent || null,
      device: options.device || null,
      expires_at: expiresAt,
    });

    return { user, token, expiresAt };
  }

  async logout(token: string) {
    await this.authRepository.invalidateSessionByToken(token);
  }

  async sendForgotPasswordLink(employeeId: number): Promise<void> {
    const user = await this.userRepository.findByEmployeeId(employeeId);
    if (!user || !user.email) return;

    const payload: ResetPayload = {
      id: user.id, 
      email: user.email
    };

    const token = this.resetTokenService.signToken(payload);
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await this.emailService.sendPasswordResetLink(user.email, user.first_name, resetLink);
  }

  async updatePassword(token: string, new_password: string){
    const payload: ResetPayload = this.resetTokenService.verifyToken(token);
    await this.authRepository.updatePassword(payload.id, new_password);
  }
}