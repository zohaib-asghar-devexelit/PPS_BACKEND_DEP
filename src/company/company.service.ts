import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MailService } from '../common/mailer/mailer.service';
// import { generateOTP } from '../../common/utils/otp.util';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
// import { generateRandomPassword } from 'src/common/utils/password.util';
import { Company } from './schemas/company.schema';
import { RegisterCompanyDto } from './dto/register-company.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<Company>,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailService,
  ) {}


  // async register(createCompanyDto: RegisterCompanyDto): Promise<{ token: string; company: Company }> {
  //   const { isAdmin, emailAddress, companyName, password, confirmPassword } = createCompanyDto;
  
  //   const existingCompany = await this.companyModel.findOne({
  //     $or: [{ emailAddress }, { companyName }],
  //   });
  
  //   if (existingCompany) {
  //     throw new Error('Company email or name already exists');
  //   }
  
  //   let finalPassword: string;
  
  //   if (isAdmin) {
  //     // ✅ Generate 8-character password for admin
  //     finalPassword = generateRandomPassword(8);
  //   } else {
  //     // ✅ Ensure passwords match for normal user
  //     if (!password || !confirmPassword || password !== confirmPassword) {
  //       throw new Error('Passwords do not match');
  //     }
  //     finalPassword = password;
  //   }
  
  //   const hashedPassword = await bcrypt.hash(finalPassword, 10);
  
  //   const otp = generateOTP();
  
  //   const emailVerificationToken = this.jwtService.sign(
  //     {
  //       sub: emailAddress,
  //     },
  //     {
  //       secret: process.env.JWT_VERIFICATION_SECRET,
  //       expiresIn: '15m',
  //     }
  //   );

  //   const newCompany = new this.companyModel({
  //     ...createCompanyDto,
  //     password: hashedPassword,
  //     otp,
  //     isEmailVerified: isAdmin?true:false,
  //     emailVerificationToken: isAdmin ? null : emailVerificationToken,
  //   });
  
  //   const savedCompany = await newCompany.save();
  
  //   // ✅ Send OTP and password if admin
  //   if (isAdmin) {
  //     await this.mailerService.sendAdminCredentialsEmail(emailAddress, finalPassword);
  //   }else{
  //     await this.mailerService.sendOTPEmail(emailAddress, otp);
  //   }
  
  //   const payload = {
  //     sub: savedCompany._id,
  //     email: savedCompany.emailAddress,
  //     role: 'company',
  //   };
  
  //   const token = this.jwtService.sign(payload);
  
  //   return {
  //     token,
  //     company: savedCompany,
  //   };
  // }
  
  
  // async verifyOtp(payload: { id: string; otp: string; email?: string }): Promise<{ message: string }> {
  //   const { id, otp, email } = payload;
  
  //   const company = await this.companyModel.findById(id);
  
  //   if (!company) {
  //     throw new Error('Company not found');
  //   }
  
  //   if (email && company.emailAddress !== email) {
  //     throw new Error('Email does not match our records');
  //   }
  
  //   if (company.otp !== otp) {
  //     throw new Error('Invalid OTP');
  //   }
  
  //   company.isEmailVerified = true;
  //   company.otp = undefined; // or null
  //   await company.save();
  
  //   return { message: 'Email verified successfully' };
  // }
  

  // Get all companies
  async getAllCompanies(): Promise<Company[]> {
    return this.companyModel.find().exec();
  }

  // Get a company by ID
  async getCompanyById(id: string): Promise<Company> {
    const company = await this.companyModel.findById(id).exec();
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    return company;
  }

  // Update a company by ID
  async updateCompany(id: string, updateCompanyDto: RegisterCompanyDto): Promise<Company> {
    const company = await this.companyModel.findById(id).exec();

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    if (updateCompanyDto.password && updateCompanyDto.password !== company.password) {
      updateCompanyDto.password = await bcrypt.hash(updateCompanyDto.password, 10);
    }

    const updatedCompany = await this.companyModel
      .findByIdAndUpdate(id, updateCompanyDto, { new: true })
      .exec();

    if (!updatedCompany) {
      throw new NotFoundException('Company not found');
    }

    return updatedCompany;
  }

  // Delete a company by ID
  async deleteCompany(id: string): Promise<Company> {
    const company = await this.companyModel.findByIdAndDelete(id).exec();
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    return company;
  }

  

  async sendResetPasswordLink(email: string) {
    const company = await this.companyModel.findOne({ companyEmail: email });
    if (!company) {
      throw new NotFoundException('No company found with this email.');
    }
  
    if (company.isEmailVerified) {
      // 🔐 Generate reset token
      const resetToken = this.jwtService.sign(
        { sub: company._id },
        { secret: process.env.JWT_SECRET, expiresIn: '15m' }
      );
  
      company.resetPasswordToken = resetToken;
      await company.save();
  
      const link = `https://yourdomain.com/change-password?token=${resetToken}`;
      // const emailHtml = generateResetPasswordTemplate(link);
  
      await this.mailerService.sendResetPasswordLink(email, link);

      const payload = this.jwtService.verify(resetToken, {
        secret: process.env.JWT_SECRET,
      });
      console.log("==>userId",payload.sub)
    } else {
      // 🔐 Generate verification token
      const verificationToken = this.jwtService.sign(
        { sub: company._id },
        { secret: process.env.JWT_SECRET, expiresIn: '15m' }
      );
  
      company.emailVerificationToken = verificationToken;
      await company.save();
  
      const link = `https://yourdomain.com/verify-email?token=${verificationToken}`;
      // const emailHtml = generateEmailVerificationTemplate(link);
  
      await this.mailerService.sendEmailVerificationLink(email, link);

    }
    

    return { message: 'Link sent successfully' };
  }

}
