import prisma from '../../prisma/client';

export class AuthRepository {
  updateVerificationCode(employeeId: number, code: string, expiry: Date) {
    return prisma.user.update({
      where: { employee_id: employeeId },
      data: { verification_code: code, verification_expiry: expiry },
    });
  }

  verifyAndUpdatePassword(employeeId: number, hashedPassword: string) {
    return prisma.user.update({
      where: { employee_id: employeeId },
      data: {
        password: hashedPassword,
        is_verified: true,
        verified_at: new Date(),
        verification_code: null,
        verification_expiry: null,
      },
    });
  }

  createSession(data: {
    token: string;
    user_id: number;
    ip_address?: string | null;
    user_agent?: string | null;
    device?: string | null;
    expires_at: Date;
  }) {
    return prisma.userSession.create({
      data: {
        ...data,
        is_valid: true,
      },
    });
  }

  invalidateSessionByToken(token: string) {
    return prisma.userSession.updateMany({
      where: { token },
      data: { is_valid: false },
    });
  }

  updatePassword(id: number, new_password: string){
  return prisma.user.update({
    where: { id },
    data: { password: new_password },
  });
  }
}