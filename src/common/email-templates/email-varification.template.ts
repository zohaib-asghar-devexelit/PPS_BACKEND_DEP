// src/common/email-templates/email-verification.template.ts

export function generateEmailVerificationTemplate(verifyLink: string): string {
    return `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
      <div style="max-width: 600px; margin: auto; background-color: white; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); padding: 30px;">
        <h2 style="color: #2c3e50;">Verify Your Email</h2>
        <p style="font-size: 16px; color: #333;">
          Please click the button below to verify your email address and activate your account:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyLink}" style="display: inline-block; padding: 15px 25px; font-size: 16px; background-color: #27ae60; color: white; text-decoration: none; border-radius: 6px;">
            Verify Email
          </a>
        </div>
        <p style="font-size: 14px; color: #555;">
          This link is valid for 10 minutes. If you did not register for PPS, you can ignore this email.
        </p>
        <p style="margin-top: 30px; font-size: 14px; color: #999;">&copy; ${new Date().getFullYear()} Police Professional Service</p>
      </div>
    </div>
    `;
  }
  