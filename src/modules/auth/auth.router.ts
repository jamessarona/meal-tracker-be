import { Router } from 'express';
import { forgotPassword, getCurrentUser, login, logout, resetPassword, sendVerificationCode, verifyCode } from './auth.controller';
import { authenticate } from '../../middleware/auth.middleware';


const router = Router();

router.post('/send-code', sendVerificationCode);
router.post('/verify-code', verifyCode);

router.post('/login', login);
router.get('/current-user', authenticate, getCurrentUser);
router.post('/logout', authenticate, logout);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;