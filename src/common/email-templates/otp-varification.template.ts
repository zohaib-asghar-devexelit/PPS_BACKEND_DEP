// src/common/email-templates/otp-verification.template.ts

export function generateOtpEmailTemplate(otp: string): string {
    return `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
      <div style="max-width: 600px; margin: auto; background-color: white; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); padding: 30px;">
        <h2 style="color: #2c3e50;">Welcome to Police Professional Service (PPS)</h2>
        <p style="font-size: 16px; color: #333;">
          Thank you for registering with PPS. To complete your email verification, please use the One-Time Password (OTP) provided below:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="display: inline-block; padding: 15px 25px; font-size: 24px; background-color: #2c3e50; color: #fff; border-radius: 8px;">
            ${otp}
          </span>
        </div>
        <p style="font-size: 14px; color: #555;">
          This OTP is valid for the next 10 minutes. If you did not initiate this request, please ignore this email.
        </p>
        <p style="margin-top: 30px; font-size: 14px; color: #999;">&copy; ${new Date().getFullYear()} Police Professional Service</p>
      </div>
    </div>
    `;
  }
  