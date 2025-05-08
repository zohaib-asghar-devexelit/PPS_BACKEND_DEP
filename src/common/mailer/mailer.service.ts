// src/common/mail.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { generateOtpEmailTemplate } from '../email-templates/otp-varification.template';
import { generateEmailVerificationTemplate } from '../email-templates/email-varification.template';
import { generateResetPasswordTemplate } from '../email-templates/reset-password.template';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,     // your Gmail address
      pass: process.env.EMAIL_PASS,     // your Gmail app password
    },
  });

  async sendOTPEmail(to: string, otp: string) {
    const mailOptions = {
      from: `"PPS" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'PPS Email Verification - Your OTP Code',
      html: generateOtpEmailTemplate(otp),
    };

    await this.transporter.sendMail(mailOptions);
  }
  async sendAdminCredentialsEmail(to: string, password: string) {
    const mailOptions = {
      from: `"PPS" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Your PPS Admin Account Credentials',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Welcome to Police Professional Service</h2>
          <p>Your account has been created successfully. Use the credentials below to log in:</p>
          <p><strong>Email:</strong> ${to}</p>
          <p><strong>Password:</strong> ${password}</p>
          <p>Please change your password after logging in for the first time.</p>
        </div>
      `,
    };
  
    await this.transporter.sendMail(mailOptions);
  }
  async sendResetPasswordLink(to: string, link: string) {
    const html = generateResetPasswordTemplate(link);
    const mailOptions = {
      from: `"PPS" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Reset Your PPS Password',
      html,
    };
    await this.transporter.sendMail(mailOptions);
  }

  async sendEmailVerificationLink(to: string, link: string) {
    const html = generateEmailVerificationTemplate(link);
    const mailOptions = {
      from: `"PPS" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Verify Your PPS Email Address',
      html,
    };
    await this.transporter.sendMail(mailOptions);
  }
  
}
