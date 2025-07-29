import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { AuthService } from './auth.service';
import { HttpError } from '../../utils/httpError';
import asyncHandler from 'express-async-handler';
import { AuthenticatedRequest } from '../../types/authenticated-request';

const authService = container.resolve(AuthService);

export const sendVerificationCode = asyncHandler(async (req: Request, res: Response) => {
  const { employee_id } = req.body;
  if (!employee_id) {
    throw new HttpError('Employee ID is required', 400);
  }

  await authService.sendVerificationCode(Number(employee_id));

  res.status(200).json({ message: 'Verification code sent to your email' });
});

export const verifyCode = asyncHandler(async (req: Request, res: Response) => {
  const { employee_id, verification_code, new_password } = req.body;

  if (!employee_id || !verification_code) {
    throw new HttpError('Employee ID and verification code are required', 400);
  }

  if (!new_password)
    throw new HttpError('New password is required', 400);

  if (new_password.length < 8) {
    throw new HttpError('Password must be at least 8 characters long', 400);
  }

  const result = await authService.verifyUserCode(Number(employee_id), verification_code, new_password);

  res.status(200).json(result);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { employee_id, password } = req.body;

  if (!employee_id || !password) {
    throw new HttpError('Employee ID and password are required', 400);
  }

  const ip = req.ip;
  const userAgent = Array.isArray(req.headers['user-agent']) 
    ? req.headers['user-agent'][0] 
    : req.headers['user-agent'] || 'unknown';

  const device = Array.isArray(req.headers['device-name']) 
    ? req.headers['device-name'][0] 
    : req.headers['device-name'] || 'unknown';

  const { user, token, expiresAt } = await authService.login(
    Number(employee_id),
    password,
    { ip, userAgent, device }
  );

  res.cookie('accessToken', token, {
    httpOnly: true,
    secure: process.env.APP_ENV === 'production',
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24,
  });

  res.status(200).json({
    message: 'Login successful',
    role: user.role,
    employee_id: user.employee_id,
    expires_at: expiresAt,
  });
});

export const getCurrentUser = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;

  if (!user) {
    throw new HttpError('Unauthorized', 401);
  }

  res.status(200).json(user);
});

export const logout = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const token = req.cookies?.accessToken;
  if (!token) {
    res.status(400).json({ success: false, message: 'No active session found' });
    return;
  }

  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: process.env.APP_ENV === 'production',
    sameSite: 'strict',
  });

  await authService.logout(token);

  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { employee_id } = req.body;
  if (!employee_id) {
    throw new HttpError('Employee ID is required', 400);
  }
  await authService.sendForgotPasswordLink(Number(employee_id));

  res.status(200).json({message: 'Reset link has been sent.'});
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token, new_password } = req.body;
  if(!token)
    throw new HttpError('Token is requried', 400)

  if (!new_password)
    throw new HttpError('New password is required', 400);

  if (new_password.length < 8) 
    throw new HttpError('Password must be at least 8 characters long', 400);
  
  try {
    await authService.updatePassword(token, new_password);
    res.status(200).json({ message: "Password reset successful." });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});