import { Request } from 'express';
import { CurrentUserDTO } from '../modules/auth/auth.dto';

export interface AuthenticatedRequest extends Request {
  user?: CurrentUserDTO;
}