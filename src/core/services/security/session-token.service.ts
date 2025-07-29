import jwt, { SignOptions } from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { injectable } from 'tsyringe';
import { ITokenService } from './itoken.service';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '1d') as SignOptions['expiresIn'];

export interface SessionPayload {
  id: number;
  role: Role;
  employee_id: number;
  email: string;
}

@injectable()
export class SessionTokenService implements ITokenService<SessionPayload> {
  signToken(payload: SessionPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  verifyToken(token: string): SessionPayload {
    return jwt.verify(token, JWT_SECRET) as SessionPayload;
  }
}