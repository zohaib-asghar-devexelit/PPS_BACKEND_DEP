import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MailService } from '../common/mailer/mailer.service';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Company } from './schemas/company.schema';
import { RegisterCompanyDto } from './dto/register-company.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<Company>,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailService,
  ) {}


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
