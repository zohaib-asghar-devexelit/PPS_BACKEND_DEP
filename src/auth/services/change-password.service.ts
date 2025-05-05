import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { OfficerService } from 'src/officer/officer.service';
import { CompanyService } from 'src/company/company.service';
import { ChangePasswordDto } from '../dto/change-password.dto';  // The DTO created above

@Injectable()
export class ChangePasswordService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly officerService: OfficerService,  // Officer service
    private readonly companyService: CompanyService,  // Company service
  ) {}

  async changePassword(changePasswordDto: ChangePasswordDto): Promise<string> {
    const { token, password, confirmPassword } = changePasswordDto;
    const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
    console.log("==>userId", payload.role);
    
    const userId = payload.sub;
    if(!userId){
        throw new BadRequestException('userId required');
    }
    
    // Step 1: Check if passwords match
    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    let user: any = null;
    
    // Update password based on the user type
    if (payload.role === 'officer') {
        user = await this.officerService.getOfficerById(userId);
        if (!user) {
          throw new NotFoundException('Officer not found');
        }
        user.password = hashedPassword;
        user.confirmPassword = password;
      } else if (payload.role === 'company') {
        user = await this.companyService.getCompanyById(userId);
        if (!user) {
          throw new NotFoundException('Company not found');
        }
        user.password = hashedPassword;
        user.confirmPassword = password;
      } else {
        throw new BadRequestException('Invalid user role');
      }

    if (user.resetPasswordToken) {
      user.resetPasswordToken = null;  // Clear the reset password token
    }

    await user.save();

    return 'Password successfully changed';
  }
}