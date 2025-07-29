import nodemailer from 'nodemailer';
import { injectable } from 'tsyringe';
import { generateVerificationCodeEmail } from './templates/verification-code.template';
import { generateForgotPasswordEmail } from './templates/forgot-password.template';

@injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

  async sendVerificationCode(to: string, name: string, code: string) {
    const html = generateVerificationCodeEmail(name, code);
    await this.transporter.sendMail({
      from: '"APT Meal Tracker" <noreply@aptmeals.com>',
      to,
      subject: 'Your Verification Code',
      html,
    });
  }

  async sendPasswordResetLink(to: string, name: string, link: string) {
    const html = generateForgotPasswordEmail(name, link);
    await this.transporter.sendMail({
      from: '"APT Meal Tracker" <noreply@aptmeals.com>',
      to,
      subject: 'Reset Your Password',
      html,
    });
  }
}
