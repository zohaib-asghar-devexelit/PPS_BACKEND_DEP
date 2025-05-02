import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Officer } from '../../officer/schemas/officer.schema';
import { Company } from '../../company/schemas/company.schema';
import { RegisterOfficerDto } from '../../officer/dto/register-officer.dto';
import { RegisterCompanyDto } from '../../company/dto/register-company.dto';
import { generateRandomPassword  } from '../../common/utils/password.util'; // Assuming you have utility functions for OTP generation
import { generateOTP } from '../../common/utils/otp.util'; // Assuming you have utility functions for OTP generation
import { MailService } from '../../common/mailer/mailer.service'; // Assuming you have a mailer service

@Injectable()
export class RegisterService {
  constructor(
    @InjectModel('Officer') private readonly officerModel: Model<Officer>,
    @InjectModel('Company') private readonly companyModel: Model<Company>,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailService,
  ) {}

  // Officer Registration
  async registerOfficer(registerOfficerDto: RegisterOfficerDto): Promise<{ token: string; officer: Officer }> {
    const { isAdmin, emailAddress, password, confirmPassword } = registerOfficerDto;

    if (!isAdmin && password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    const existingOfficer = await this.officerModel.findOne({ emailAddress });
    if (existingOfficer) {
      throw new Error('Officer with this email already exists');
    }

    const finalPassword = isAdmin ? generateRandomPassword(8) : password;
    const hashedPassword = await bcrypt.hash(finalPassword, 10);
    const otp = generateOTP();

    const newOfficer = new this.officerModel({
      ...registerOfficerDto,
      password: hashedPassword,
      confirmPassword: finalPassword,
      otp,
      role: 'Officer',
      isEmailVerified: isAdmin,
      status: 1,
    });

    const savedOfficer = await newOfficer.save();

    if (isAdmin) {
      await this.mailerService.sendAdminCredentialsEmail(emailAddress, finalPassword);
    } else {
      await this.sendOtpToUser(emailAddress, otp);
    }

    const token = this.jwtService.sign({
      sub: savedOfficer._id,
      email: savedOfficer.emailAddress,
      role: 'officer',
    });

    return { token, officer: savedOfficer };
  }

  // Company Registration
  async registerCompany(createCompanyDto: RegisterCompanyDto): Promise<{ token: string; company: Company }> {
    const { isAdmin, emailAddress, companyName, password, confirmPassword } = createCompanyDto;

    const existingCompany = await this.companyModel.findOne({
      $or: [{ emailAddress }, { companyName }],
    });

    if (existingCompany) {
      throw new Error('Company email or name already exists');
    }

    const finalPassword = isAdmin ? generateRandomPassword(8) : password;
    if (!isAdmin && (!password || !confirmPassword || password !== confirmPassword)) {
      throw new Error('Passwords do not match');
    }

    const hashedPassword = await bcrypt.hash(finalPassword, 10);
    const otp = generateOTP();

    const emailVerificationToken = this.jwtService.sign(
      { sub: emailAddress },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: '15m',
      }
    );

    const newCompany = new this.companyModel({
      ...createCompanyDto,
      password: hashedPassword,
      otp,
      isEmailVerified: isAdmin,
      emailVerificationToken: isAdmin ? null : emailVerificationToken,
      status: 1,
    });

    const savedCompany = await newCompany.save();

    if (isAdmin) {
      await this.mailerService.sendAdminCredentialsEmail(emailAddress, finalPassword);
    } else {
      await this.sendOtpToUser(emailAddress, otp);
    }

    const token = this.jwtService.sign({
      sub: savedCompany._id,
      email: savedCompany.emailAddress,
      role: 'company',
    });

    return { token, company: savedCompany };
  }

  // OTP Verification
  async verifyOtp(payload: { id: string; otp: string; email?: string }): Promise<{ message: string }> {
    const { id, otp, email } = payload;

    let user = await this.companyModel.findById(id);
    let userType = 'company';

    if (!user) {
      user = await this.officerModel.findById(id);
      userType = 'officer';
    }

    if (!user) {
      throw new Error('User not found');
    }

    if (email && user.emailAddress !== email) {
      user.emailAddress = email;
      user.otp = generateOTP();
      await user.save();
      await this.sendOtpToUser(email, user.otp);
      return { message: 'Email updated and OTP sent to new email address' };
    }

    if (user.otp !== otp) {
      throw new Error('Invalid OTP');
    }

    user.isEmailVerified = true;
    user.otp = undefined;
    await user.save();

    return { message: `${userType} email verified successfully` };
  }

  // ✅ Shared method for sending OTP
  private async sendOtpToUser(email: string, otp: string): Promise<void> {
    await this.mailerService.sendOTPEmail(email, otp);
  }

  async resendOtp(id: string): Promise<{ message: string }> {
    const user = await this.companyModel.findById(id) || await this.officerModel.findById(id);
    if (!user) throw new Error('User not found');
  
    user.otp = generateOTP();
    await user.save();
    await this.sendOtpToUser(user.emailAddress, user.otp);
  
    return { message: 'OTP resent successfully' };
  }
  
}