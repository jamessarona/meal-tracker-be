export function generateForgotPasswordEmail(firstName: string, resetLink: string) {
  return `
  <!DOCTYPE html>
  <html>
  <body style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px;">
    <div style="max-width: 480px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.05); padding: 20px;">
      <div style="text-align: center;">
        <img src="https://www.flatworldsolutions.com/images/fws-logo.webp?17-01-2025" alt="Company Logo" width="120" style="margin-bottom: 20px;">
      </div>
      <h2 style="color: #111827;">Reset Your Password</h2>
      <p style="color: #4b5563;">Hi <strong>${firstName}</strong>,</p>
      <p style="color: #4b5563;">You recently requested to reset your password. Click the button below to create a new one. This link will expire in 15 minutes.</p>
      <div style="margin: 24px 0; text-align: center;">
        <a href="${resetLink}" style="background-color: #3b82f6; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; display: inline-block; font-weight: bold;">
          Reset Password
        </a>
      </div>
      <p style="color: #6b7280;">If you didn’t request this, you can ignore this email.</p>
      <p style="color: #6b7280;">— ${process.env.APP_NAME} Team</p>
    </div>
  </body>
  </html>
  `;
}