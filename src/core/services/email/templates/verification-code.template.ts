export function generateVerificationCodeEmail(firstName: string, code: string) {
  return `
  <!DOCTYPE html>
  <html>
  <body style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px;">
    <div style="max-width: 480px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.05); padding: 20px;">
      <div style="text-align: center;">
        <img src="https://www.flatworldsolutions.com/images/fws-logo.webp?17-01-2025" alt="Company Logo" width="120" style="margin-bottom: 20px;">
      </div>
      <h2 style="color: #111827;">Your Verification Code</h2>
      <p style="color: #4b5563;">Hi <strong>${firstName}</strong>,</p>
      <p style="color: #4b5563;">Please use the verification code below to proceed. This code is valid for the next 15 minutes.</p>
      <div style="margin: 20px 0; text-align: center;">
        <div style="display: inline-block; border: 2px dashed #3b82f6; border-radius: 6px; padding: 10px 20px; font-size: 24px; font-weight: bold; color: #1f2937;">
          ${code}
        </div>
      </div>
      <p style="color: #6b7280;">If you didn’t request this, please ignore this email.</p>
      <p style="color: #6b7280;">— ${process.env.APP_NAME} Team</p>
    </div>
  </body>
  </html>
  `;
}