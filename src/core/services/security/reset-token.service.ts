import { injectable } from 'tsyringe';
import jwt, { SignOptions } from 'jsonwebtoken';
import { ITokenService } from './itoken.service';

const RESET_SECRET = process.env.JWT_RESET_PASSWORD_SECRET!;
const RESET_EXPIRES_IN = (process.env.JWT_RESET_PASSWORD_EXPIRES_IN || '15m') as SignOptions['expiresIn'];

export interface ResetPayload {
  id: number;
  email: string;
}

@injectable()
export class ResetTokenService implements ITokenService<ResetPayload> {
  signToken(payload: ResetPayload): string {
    return jwt.sign(payload, RESET_SECRET, { expiresIn: RESET_EXPIRES_IN });
  }

  verifyToken(token: string): ResetPayload {
    return jwt.verify(token, RESET_SECRET) as ResetPayload;
  }
}