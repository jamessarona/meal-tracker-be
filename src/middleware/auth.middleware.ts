import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import prisma from '../prisma/client';
import { AuthenticatedRequest } from '../types/authenticated-request';
import { HttpError } from '../utils/httpError';
import { CurrentUserDTO } from '../modules/auth/auth.dto';
import { SessionPayload } from '../core/services/security/session-token.service';

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      throw new HttpError('Unauthorized', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as SessionPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        employee_id: true,
        first_name: true,
        middle_name: true,
        last_name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      throw new HttpError('Unauthorized', 401);
    }

    const currentUser: CurrentUserDTO = {
      id: user.id,
      role: user.role,
      employee_id: user.employee_id,
      email: user.email,
      first_name: user.first_name,
      middle_name: user.middle_name ?? undefined,
      last_name: user.last_name,
    };

    req.user = currentUser;

    next();
  } catch (error) {
    next(new HttpError('Unauthorized', 401));
  }
};