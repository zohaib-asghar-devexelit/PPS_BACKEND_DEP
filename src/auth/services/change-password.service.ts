import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { OfficerService } from 'src/officer/officer.service';
import { CompanyService } from 'src/company/company.service';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Officer } from '../../officer/schemas/officer.schema';
import { Company } from '../../company/schemas/company.schema';  // The DTO created above

@Injectable()
export class ChangePasswordService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly officerService: OfficerService,
    private readonly companyService: CompanyService,
    @InjectModel('Officer') private readonly officerModel: Model<Officer>,
    @InjectModel('Company') private readonly companyModel: Model<Company>,
  ) {}

  // async changePassword(changePasswordDto: ChangePasswordDto): Promise<string> {
  //   const { token, password, confirmPassword } = changePasswordDto;
  //   const payload = this.jwtService.verify(token, {
  //       secret: process.env.JWT_SECRET,
  //     });
  //   console.log("==>userId", payload.role);
    
  //   const userId = payload.sub;
  //   if(!userId){
  //       throw new BadRequestException('userId required');
  //   }
    
  //   // Step 1: Check if passwords match
  //   if (password !== confirmPassword) {
  //     throw new BadRequestException('Passwords do not match');
  //   }

  //   // Hash the new password
  //   const hashedPassword = await bcrypt.hash(password, 10);
    
  //   let user: any = null;
    
  //   // Update password based on the user type
  //   if (payload.role === 'officer') {
  //       user = await this.officerService.getOfficerById(userId);
  //       if (!user) {
  //         throw new NotFoundException('Officer not found');
  //       }
  //       user.password = hashedPassword;
  //       user.confirmPassword = password;
  //     } else if (payload.role === 'company') {
  //       user = await this.companyService.getCompanyById(userId);
  //       if (!user) {
  //         throw new NotFoundException('Company not found');
  //       }
  //       user.password = hashedPassword;
  //       user.confirmPassword = password;
  //     } else {
  //       throw new BadRequestException('Invalid user role');
  //     }

  //   if (user.resetPasswordToken) {
  //     user.resetPasswordToken = null;  // Clear the reset password token
  //   }

  //   await user.save();

  //   return 'Password successfully changed';
  // }

  async changePassword(changePasswordDto: ChangePasswordDto): Promise<string> {
    const { token, email, oldPassword, newPassword, confirmPassword } = changePasswordDto;
  
    let user: any = null;
    let role: 'officer' | 'company' | null = null;
  
    // Step 1: Validate password match
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
  
    // ==== CASE 1: Reset password via token ====
    if (token) {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
  
      const userId = payload.sub;
      role = payload.role;
  
      if (!userId || !role) {
        throw new BadRequestException('Invalid or expired token');
      }
  
      if (role === 'officer') {
        user = await this.officerService.getOfficerById(userId);
      } else if (role === 'company') {
        user = await this.companyService.getCompanyById(userId);
      }
  
      if (!user) {
        throw new NotFoundException(`${role} not found`);
      }
  
      // Clear token
      user.resetPasswordToken = null;
    } 
    // ==== CASE 2: Change password from profile (email + oldPassword required) ====
    else {
      if (!email || !oldPassword) {
        throw new BadRequestException('Email and old password are required');
      }
  
      const normalizedEmail = email.trim().toLowerCase();
  
      // Search for user in both models
      user = await this.officerModel.findOne({ emailAddress: normalizedEmail });
      role = 'officer';
  
      if (!user) {
        user = await this.companyModel.findOne({ emailAddress: normalizedEmail });
        role = 'company';
      }
  
      if (!user) {
        throw new NotFoundException('User not found with this email');
      }
  
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        throw new BadRequestException('Old password is incorrect');
      }
    }
  
    // Step 2: Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.confirmPassword = newPassword; // Store plain confirmPassword only if needed
    await user.save();
  
    return 'Password successfully changed';
  }
  
}