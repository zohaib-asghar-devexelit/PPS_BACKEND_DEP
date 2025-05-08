import { Injectable,ConflictException,BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Officer } from '../../officer/schemas/officer.schema';
import { Company } from '../../company/schemas/company.schema';
import { Account } from '../schemas/account.schema';
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
    @InjectModel('Account') private readonly accountModel: Model<Account>,
    
    private readonly jwtService: JwtService,
    private readonly mailerService: MailService,
  ) {}

  // Officer Registration

  async registerOfficer(
    registerOfficerDto: RegisterOfficerDto,
  ): Promise<{ token: string; officer: Officer }> {
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
      documents,
      bankDetail,
      emergencyContact,
    } = registerOfficerDto;
  
    // Validate isAdmin presence
    if (typeof isAdmin === 'undefined' || isAdmin === null) {
      throw new BadRequestException('isAdmin field is required');
    }
  
    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailAddress)) {
      throw new BadRequestException('Invalid email address format');
    }
  
    // Normalize email
    const normalizedEmail = emailAddress.trim().toLowerCase();
  
    // Common required fields
    const missingFields: string[] = [];
    if (!fullName) missingFields.push('fullName');
    if (!phoneNumber) missingFields.push('phoneNumber');
    if (!address) missingFields.push('address');
    if (!street) missingFields.push('street');
    if (!city) missingFields.push('city');
    if (!state) missingFields.push('state');
    if (!zipCode) missingFields.push('zipCode');
  
    // Additional for non-admin officers
    if (!isAdmin) {
      if (!password) missingFields.push('password');
      if (!confirmPassword) missingFields.push('confirmPassword');
      if (!dateOfBirth) missingFields.push('dateOfBirth');
      if (!socialSecurityNumber) missingFields.push('socialSecurityNumber');
      if (!emergencyContact) missingFields.push('emergencyContact');
  
      if (missingFields.length > 0) {
        throw new BadRequestException(`Missing required fields: ${missingFields.join(', ')}`);
      }
  
      if (password !== confirmPassword) {
        throw new ConflictException('Passwords do not match');
      }
    } else {
      // Admin-specific required checks
      if (missingFields.length > 0) {
        throw new BadRequestException(`Missing required fields for admin: ${missingFields.join(', ')}`);
      }
    }
  
    // Check for existing email in Officer and Company collections
    const [existingOfficer, existingCompany] = await Promise.all([
      this.officerModel.findOne({ emailAddress: normalizedEmail }),
      this.companyModel.findOne({ companyEmail: normalizedEmail }),
    ]);
    if (existingOfficer || existingCompany) {
      throw new ConflictException('An account with this email already exists');
    }
  
    // Hash password or generate for admin
    const finalPassword = isAdmin ? generateRandomPassword(8) : password;
    const hashedPassword = await bcrypt.hash(finalPassword, 10);
    const otp = generateOTP();
  
    // Create Officer document
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
  
    // Save Officer
    const savedOfficer = await newOfficer.save();
  
    // Create corresponding Account
    await this.accountModel.create({
      emailAddress: normalizedEmail,
      password: hashedPassword,
      confirmPassword: finalPassword,
      accountType: 'officer',
      refId: savedOfficer._id,
      isEmailVerified: isAdmin,
      status: 1,
    });
  
    // Send credentials or OTP
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
  
  async registerCompany(createCompanyDto: RegisterCompanyDto): Promise<{ token: string; company: Company; accountId: string }> {
    const {
      isAdmin,
      emailAddress,
      companyName,
      password,
      confirmPassword,
      phoneNumber,
      companyAddress,
      street,
      city,
      state,
      zipCode,
      taxId,
      contactPersons,
    } = createCompanyDto;
  
    const requiredFields: string[] = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (typeof isAdmin === 'undefined' || isAdmin === null) {
      throw new BadRequestException('isAdmin field is required');
    }
  
    if (!emailRegex.test(emailAddress)) {
      throw new BadRequestException('Invalid email address format');
    }
  
    // Validate contactPersons (if not admin)
    if (!isAdmin) {
      if (!Array.isArray(contactPersons) || contactPersons.length === 0) {
        throw new BadRequestException('At least one contact person is required');
      }
  
      contactPersons.forEach((person, index) => {
        if (!person.fullName) requiredFields.push(`contactPersons[${index}].fullName`);
        if (!person.contactEmail) requiredFields.push(`contactPersons[${index}].contactEmail`);
        if (!emailRegex.test(person.contactEmail)) {
          throw new BadRequestException(`Invalid email address format for contactPersons[${index}].contactEmail`);
        }
        if (!person.role) requiredFields.push(`contactPersons[${index}].role`);
      });
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
      contactPersons: contactPersons || [], // fallback in case it's undefined
      password: hashedPassword,
      otp,
      isEmailVerified: isAdmin,
      emailVerificationToken,
      status: 1,
      accountType: 'company',
      confirmPassword: finalPassword,
    });
  
    const savedCompany = await newCompany.save();
  
    // Generate an access token during registration and save it in the company document
    const accessToken = this.jwtService.sign({
      sub: savedCompany._id,
      email: savedCompany.emailAddress,
      role: 'company',
    });
  
    savedCompany.accessToken = accessToken;
    await savedCompany.save(); // Save the access token in the database
  
    const savedAccount = await this.accountModel.create({
      emailAddress: createCompanyDto.emailAddress,
      password: hashedPassword,
      confirmPassword: finalPassword,
      accountType: 'company',
      refId: savedCompany._id,
      isEmailVerified: isAdmin,
      status: 1,
    });
    
    let accountId = savedAccount ? (savedAccount._id as any).toString() : null;
    
    if (isAdmin) {
      await this.mailerService.sendAdminCredentialsEmail(emailAddress, finalPassword);
    } else {
      await this.sendOtpToUser(emailAddress, otp);
    }
  
    return { token: accessToken, company: savedCompany, accountId: accountId };
  }
  
  
  
  // async verifyOtp(payload: { id: string; otp: string; email?: string }): Promise<{ message: string }> {
  //   const { id, otp, email } = payload;
  //   let user = await this.companyModel.findById(id);
  //   let userType = 'company';
  //   if (!user) {
  //     user = await this.officerModel.findById(id);
  //     userType = 'officer';
  //   }
  //   if (!user) {
  //     throw new Error('User not found');
  //   }
  //   if (email && user.emailAddress !== email) {
  //     user.emailAddress = email;
  //     user.otp = generateOTP();
  //     await user.save();
  //     await this.sendOtpToUser(email, user.otp);
  //     return { message: 'Email updated and OTP sent to new email address' };
  //   }
  //   if (user.otp !== otp) {
  //     throw new Error('Invalid OTP');
  //   }
  //   user.isEmailVerified = true;
  //   user.otp = undefined;
  //   await user.save();
  //   return { message: `${userType} email verified successfully` };
  // }

  async verifyOtp(payload: { id: string; otp: string; email?: string }): Promise<{ message: string }> {
    const { id, otp, email } = payload;
  
    // Check for the user in the company model first
    let user = await this.companyModel.findById(id);
    let userType = 'company';
    
    if (!user) {
      // If not found in company, check officer model
      user = await this.officerModel.findById(id);
      userType = 'officer';
    }
    
    if (!user) {
      throw new Error('User not found');
    }
  
    // If email is provided, update it and send new OTP
    if (email && user.emailAddress !== email) {
      user.emailAddress = email;
      user.otp = generateOTP();
      await user.save();
      await this.sendOtpToUser(email, user.otp);
  
      // Update the account model with the new email and OTP
      await this.accountModel.updateOne(
        { refId: user._id },
        { emailAddress: email, otp: user.otp, isEmailVerified: false }
      );
  
      return { message: 'Email updated and OTP sent to new email address' };
    }
  
    // If OTP does not match, throw error
    if (user.otp !== otp) {
      throw new Error('Invalid OTP');
    }
  
    // Mark user email as verified
    user.isEmailVerified = true;
    user.otp = undefined; // Clear OTP
    await user.save();
  
    // Update the account model with isEmailVerified = true
    await this.accountModel.updateOne(
      { refId: user._id },
      { isEmailVerified: true }
    );
  
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