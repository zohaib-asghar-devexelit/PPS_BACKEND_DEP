// src/modules/auth/forgot-password.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from '../../company/schemas/company.schema';
import { Officer } from '../../officer/schemas/officer.schema';
import { MailService } from '../../common/mailer/mailer.service';

@Injectable()
export class ForgotPasswordService {
  constructor(
    @InjectModel(Company.name) private readonly companyModel: Model<Company>,
    @InjectModel(Officer.name) private readonly officerModel: Model<Officer>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async sendResetPasswordLink(email: string, role: 'company' | 'officer') {
    let user: any;
    console.log("==>email",email)
    console.log("==>role",role)
    if (role === 'company') {
      user = await this.companyModel.findOne({ companyEmail: email });
    } else if (role === 'officer') {
      user = await this.officerModel.findOne({ emailAddress: email });
    }

    if (!user) {
      throw new NotFoundException(`No ${role} found with this email.`);
    }

    if (user.isEmailVerified) {
      const resetToken = this.jwtService.sign(
        { sub: user._id, role: role },
        { secret: process.env.JWT_SECRET, expiresIn: '15m' }
      );

      user.resetPasswordToken = resetToken;
      await user.save();

      const link = `https://yourdomain.com/change-password?token=${resetToken}`;
      await this.mailService.sendResetPasswordLink(email, link);

    } else {
      const verificationToken = this.jwtService.sign(
        { sub: user._id, role: role },
        { secret: process.env.JWT_SECRET, expiresIn: '15m' }
      );

      user.emailVerificationToken = verificationToken;
      await user.save();

      const link = `https://yourdomain.com/verify-email?token=${verificationToken}`;
      await this.mailService.sendEmailVerificationLink(email, link);
    }

    return { message: 'Link sent successfully' };
  }
}
