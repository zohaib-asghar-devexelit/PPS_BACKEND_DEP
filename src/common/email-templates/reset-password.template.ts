// src/common/email-templates/reset-password.template.ts

export function generateResetPasswordTemplate(resetLink: string): string {
    return `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
      <div style="max-width: 600px; margin: auto; background-color: white; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); padding: 30px;">
        <h2 style="color: #2c3e50;">Password Reset Request</h2>
        <p style="font-size: 16px; color: #333;">
          We received a request to reset your password. Please click the button below to proceed:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="display: inline-block; padding: 15px 25px; font-size: 16px; background-color: #2980b9; color: white; text-decoration: none; border-radius: 6px;">
            Reset Password
          </a>
        </div>
         <p style="font-size: 14px; color: #555;">
          ${resetLink}
        </p>
        <p style="font-size: 14px; color: #555;">
          This link will expire in 10 minutes. If you didn’t request a password reset, please ignore this email.
        </p>
        <p style="margin-top: 30px; font-size: 14px; color: #999;">&copy; ${new Date().getFullYear()} Police Professional Service</p>
      </div>
    </div>
    `;
  }
  