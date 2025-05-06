import { Injectable,ConflictException,BadRequestException } from '@nestjs/common';
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
  // async registerOfficer(registerOfficerDto: RegisterOfficerDto): Promise<{ token: string; officer: Officer }> {
  //   const { isAdmin, emailAddress, password, confirmPassword } = registerOfficerDto;

  //   const normalizedEmail = emailAddress.trim().toLowerCase();
  //   if (!isAdmin && password !== confirmPassword) {
  //     throw new ConflictException('Passwords do not match');
  //   }

  //   const existingOfficer = await this.officerModel.findOne({ normalizedEmail });
  //   if (existingOfficer) {
  //     throw new ConflictException('Officer with this email already exists');
  //   }

  //   const finalPassword = isAdmin ? generateRandomPassword(8) : password;
  //   const hashedPassword = await bcrypt.hash(finalPassword, 10);
  //   const otp = generateOTP();

  //   const newOfficer = new this.officerModel({
  //     ...registerOfficerDto,
  //     password: hashedPassword,
  //     confirmPassword: finalPassword,
  //     otp,
  //     role: 'Officer',
  //     isEmailVerified: isAdmin,
  //     status: 1,
  //   });

  //   const savedOfficer = await newOfficer.save();

  //   if (isAdmin) {
  //     await this.mailerService.sendAdminCredentialsEmail(emailAddress, finalPassword);
  //   } else {
  //     await this.sendOtpToUser(emailAddress, otp);
  //   }

  //   const token = this.jwtService.sign({
  //     sub: savedOfficer._id,
  //     email: savedOfficer.emailAddress,
  //     role: 'officer',
  //   });

  //   return { token, officer: savedOfficer };
  // }

  async registerOfficer(registerOfficerDto: RegisterOfficerDto): Promise<{ token: string; officer: Officer }> {
    const {
      isAdmin,
      emailAddress,
      password,
      confirmPassword,
      fullName,
      dateOfBirth,
      phoneNumber,
      address,
      street,
      city,
      state,
      zipCode,
      socialSecurityNumber,
      availability,
      emergencyContactInfo,
    } = registerOfficerDto;
  

    // ❌ isAdmin is missing
    if (typeof isAdmin === 'undefined' || isAdmin === null) {
      throw new BadRequestException('isAdmin field is required');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailAddress)) {
      throw new BadRequestException('Invalid email address format');
    }
  
    // Normalize email
    const normalizedEmail = emailAddress?.trim().toLowerCase();
    if (!normalizedEmail) {
      throw new BadRequestException('Email address is required');
    }
  
    // ✅ If isAdmin is false, validate required fields

    if (!isAdmin) {
      const missingFields: string[] = [];
    
      if (!fullName) missingFields.push('fullName');
      if (!password) missingFields.push('password');
      if (!confirmPassword) missingFields.push('confirmPassword');
      if (!dateOfBirth) missingFields.push('dateOfBirth');
      if (!phoneNumber) missingFields.push('phoneNumber');
      if (!address) missingFields.push('address');
      if (!street) missingFields.push('street');
      if (!city) missingFields.push('city');
      if (!state) missingFields.push('state');
      if (!zipCode) missingFields.push('zipCode');
      if (!socialSecurityNumber) missingFields.push('socialSecurityNumber');
      // if (!availability) missingFields.push('availability');
      // if (!emergencyContactInfo) missingFields.push('emergencyContactInfo');
    
      if (missingFields.length > 0) {
        throw new BadRequestException(`Missing required fields: ${missingFields.join(', ')}`);
      }
    
      if (password !== confirmPassword) {
        throw new ConflictException('Passwords do not match');
      }
    }else {
      const adminMissingFields: string[] = [];
    
      if (!fullName) adminMissingFields.push('fullName');
      if (!normalizedEmail) adminMissingFields.push('emailAddress');
      if (!phoneNumber) adminMissingFields.push('phoneNumber');
      if (!address) adminMissingFields.push('address');
      if (!street) adminMissingFields.push('street');
      if (!city) adminMissingFields.push('city');
      if (!state) adminMissingFields.push('state');
      if (!zipCode) adminMissingFields.push('zipCode');
    
      if (adminMissingFields.length > 0) {
        throw new BadRequestException(`Missing required fields for admin: ${adminMissingFields.join(', ')}`);
      }
    }
  
    // Check for existing email
    const [existingOfficer, existingCompany] = await Promise.all([
      this.officerModel.findOne({ emailAddress: normalizedEmail }),
      this.companyModel.findOne({ companyEmail: normalizedEmail }),
    ]);
    if (existingOfficer || existingCompany) {
      throw new ConflictException('An account with this email already exists');
    }
    
  
    // Hash password
    const finalPassword = isAdmin ? generateRandomPassword(8) : password;
    const hashedPassword = await bcrypt.hash(finalPassword, 10);
    const otp = generateOTP();
  
    // Create officer
    const newOfficer = new this.officerModel({
      ...registerOfficerDto,
      emailAddress: normalizedEmail,
      password: hashedPassword,
      confirmPassword: finalPassword,
      otp,
      accountType: 'Officer',
      isEmailVerified: isAdmin,
      status: 1,
    });
  
    // Save officer
    const savedOfficer = await newOfficer.save();
  
    // Send email/OTP
    if (isAdmin) {
      await this.mailerService.sendAdminCredentialsEmail(normalizedEmail, finalPassword);
    } else {
      await this.sendOtpToUser(normalizedEmail, otp);
    }
  
    // Generate JWT token
    const token = this.jwtService.sign({
      sub: savedOfficer._id,
      email: savedOfficer.emailAddress,
      role: 'officer',
    });
  
    return { token, officer: savedOfficer };
  }
  

  // Company Registration
  // async registerCompany(createCompanyDto: RegisterCompanyDto): Promise<{ token: string; company: Company }> {
  //   const { isAdmin, emailAddress, companyName, password, confirmPassword } = createCompanyDto;

  //   const existingCompany = await this.companyModel.findOne({
  //     $or: [{ emailAddress }, { companyName }],
  //   });

  //   if (existingCompany) {
  //     throw new Error('Company email or name already exists');
  //   }

  //   const finalPassword = isAdmin ? generateRandomPassword(8) : password;
  //   if (!isAdmin && (!password || !confirmPassword || password !== confirmPassword)) {
  //     throw new Error('Passwords do not match');
  //   }

  //   const hashedPassword = await bcrypt.hash(finalPassword, 10);
  //   const otp = generateOTP();

  //   const emailVerificationToken = this.jwtService.sign(
  //     { sub: emailAddress },
  //     {
  //       secret: process.env.JWT_SECRET,
  //       expiresIn: '15m',
  //     }
  //   );

  //   const newCompany = new this.companyModel({
  //     ...createCompanyDto,
  //     password: hashedPassword,
  //     otp,
  //     isEmailVerified: isAdmin,
  //     emailVerificationToken: isAdmin ? null : emailVerificationToken,
  //     status: 1,
  //   });

  //   const savedCompany = await newCompany.save();

  //   if (isAdmin) {
  //     await this.mailerService.sendAdminCredentialsEmail(emailAddress, finalPassword);
  //   } else {
  //     await this.sendOtpToUser(emailAddress, otp);
  //   }

  //   const token = this.jwtService.sign({
  //     sub: savedCompany._id,
  //     email: savedCompany.emailAddress,
  //     role: 'company',
  //   });

  //   return { token, company: savedCompany };
  // }

  async registerCompany(createCompanyDto: RegisterCompanyDto): Promise<{ token: string; company: Company }> {
    const { isAdmin, emailAddress, companyName, password, confirmPassword, phoneNumber, companyAddress, street, city, state, zipCode, registrationNumber, taxId, industry, fullName, contactEmail, role } = createCompanyDto;
    const requiredFields: string[] = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof isAdmin === 'undefined' || isAdmin === null) {
      throw new BadRequestException('isAdmin field is required');
    }
    if (!emailRegex.test(emailAddress)) {
      throw new BadRequestException('Invalid email address format');
    }
    if (!emailRegex.test(contactEmail)) {
      throw new BadRequestException('Invalid email address format of contactEmail');
    }
    if (!isAdmin) {
      if (!companyName) requiredFields.push('companyName');
      if (!emailAddress) requiredFields.push('emailAddress');
      if (!phoneNumber) requiredFields.push('phoneNumber');
      if (!password) requiredFields.push('password');
      if (!confirmPassword) requiredFields.push('confirmPassword');
      if (!companyAddress) requiredFields.push('companyAddress');
      if (!street) requiredFields.push('street');
      if (!city) requiredFields.push('city');
      if (!state) requiredFields.push('state');
      if (!zipCode) requiredFields.push('zipCode');
      if (!registrationNumber) requiredFields.push('registrationNumber');
      // if (!taxId) requiredFields.push('taxId');
      if (!industry) requiredFields.push('industry');
      if (!fullName) requiredFields.push('fullName');
      if (!contactEmail) requiredFields.push('contactEmail');
      if (!role) requiredFields.push('role');
  
      if (requiredFields.length > 0) {
        throw new BadRequestException(`Missing required fields: ${requiredFields.join(', ')}`);
      }
      if (password !== confirmPassword) {
        throw new BadRequestException('Passwords do not match');
      }
    }
    const [existingOfficer, existingCompany] = await Promise.all([
      this.officerModel.findOne({ emailAddress }),
      this.companyModel.findOne({ emailAddress }),
    ]);
    if (existingOfficer || existingCompany) {
      throw new ConflictException('An account with this email address already exists');
    }
    const companyNameExists = await this.companyModel.findOne({ companyName });
    if (companyNameExists) {
      throw new ConflictException('Company name already exists');
    }
    const finalPassword = isAdmin ? generateRandomPassword(8) : password;
    const hashedPassword = await bcrypt.hash(finalPassword, 10);
    const otp = generateOTP();
    const emailVerificationToken = isAdmin
      ? null
      : this.jwtService.sign({ sub: emailAddress }, { secret: process.env.JWT_SECRET, expiresIn: '15m' });
  
    const newCompany = new this.companyModel({
      ...createCompanyDto,
      password: hashedPassword,
      otp,
      isEmailVerified: isAdmin,
      emailVerificationToken,
      status: 1, 
      accountType: 'Company',
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