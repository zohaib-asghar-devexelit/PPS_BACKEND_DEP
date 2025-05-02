// src/common/utils/otp.ts
export function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  