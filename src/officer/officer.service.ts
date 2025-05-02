import { Injectable, NotFoundException  } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Officer } from './schemas/officer.schema';
// import { generateOTP } from '../../common/utils/otp.util';
// import { LoginOfficerDto } from '../dto/login.dto';
import { RegisterOfficerDto } from './dto/register-officer.dto';
// import { generateRandomPassword } from 'src/common/utils/password.util';
import { MailService } from '../common/mailer/mailer.service';
// import { Role } from 'src/common/enums/role.enums';

@Injectable()
export class OfficerService {
  constructor(
    @InjectModel(Officer.name) private officerModel: Model<Officer>,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailService,
  ) {}

  // Register a new officer and return JWT
  // async registerOfficer(registerOfficerDto: RegisterOfficerDto): Promise<{ token: string; officer: Officer }> {
  //   const { createPassword, confirmPassword, emailAddress } = registerOfficerDto;

  //   if (createPassword !== confirmPassword) {
  //     throw new Error('Passwords do not match');
  //   }

  //   const existingOfficer = await this.officerModel.findOne({ emailAddress });
  //   if (existingOfficer) {
  //     throw new Error('Officer with this email already exists');
  //   }

  //   const hashedPassword = await bcrypt.hash(createPassword, 10);

  //   const newOfficer = new this.officerModel({
  //     ...registerOfficerDto,
  //     createPassword: hashedPassword,
  //   });

  //   const savedOfficer = await newOfficer.save();

  //   const payload = {
  //     sub: savedOfficer._id,
  //     email: savedOfficer.emailAddress,
  //     role: 'officer',
  //   };

  //   const token = this.jwtService.sign(payload);

  //   return {
  //     token,
  //     officer: savedOfficer,
  //   };
  // }

  // async login(loginOfficerDto: LoginOfficerDto): Promise<{ token: string; officer: Officer }> {
  //   const { emailAddress, Password } = loginOfficerDto;

  //   const officer = await this.officerModel.findOne({ emailAddress });

  //   if (!officer) {
  //     throw new UnauthorizedException('Invalid credentials');
  //   }

  //   const isPasswordValid = await bcrypt.compare(Password, officer.createPassword);

  //   if (!isPasswordValid) {
  //     throw new UnauthorizedException('Invalid password');
  //   }

  //   if (!officer.isEmailVerified) {
  //     throw new UnauthorizedException('Email not verified');
  //   }

  //   const payload = { sub: officer._id, email: officer.emailAddress, role: 'officer' };

  //   const token = this.jwtService.sign(payload);

  //   return {
  //     token,
  //     officer,
  //   };
  // }

// async registerOfficer(registerOfficerDto: RegisterOfficerDto): Promise<{ token: string; officer: Officer }> {
//   const { isAdmin, emailAddress, password, confirmPassword } = registerOfficerDto;

//   // Check if password matches only when isAdmin is false
//   if (!isAdmin && password !== confirmPassword) {
//     throw new Error('Passwords do not match');
//   }

//   const existingOfficer = await this.officerModel.findOne({ emailAddress });
//   if (existingOfficer) {
//     throw new Error('Officer with this email already exists');
//   }

//   let finalPassword: string;

//   if (isAdmin) {
//     // Generate a random 8-character password for admin officers
//     finalPassword = generateRandomPassword(8);
//   } else {
//     finalPassword = password;
//   }

//   // Hash the final password
//   const hashedPassword = await bcrypt.hash(finalPassword, 10);
//   const otp = generateOTP();
//   // Create the new officer
//   const newOfficer = new this.officerModel({
//     ...registerOfficerDto,
//     createPassword: hashedPassword,
//     otp,
//     role: Role.Officer,
//     isEmailVerified: isAdmin?true:false,
//   });

//   const savedOfficer = await newOfficer.save();

//   // Send email to officer with generated password if admin
//   if (isAdmin) {
//     await this.mailerService.sendAdminCredentialsEmail(emailAddress, finalPassword);
//   }else{
//     await this.mailerService.sendOTPEmail(emailAddress, otp);
//   }

//   // Create a JWT payload and sign the token
//   const payload = {
//     sub: savedOfficer._id,
//     email: savedOfficer.emailAddress,
//     role: 'officer',
//   };

//   const token = this.jwtService.sign(payload);

//   return {
//     token,
//     officer: savedOfficer,
//   };
// }

// async verifyOtp(payload: { id: string; otp: string; email?: string }): Promise<{ message: string }> {
//   const { id, otp, email } = payload;

//   const officer = await this.officerModel.findById(id);

//   if (!officer) {
//     throw new Error('Company not found');
//   }

//   if (email && officer.emailAddress !== email) {
//     throw new Error('Email does not match our records');
//   }

//   if (officer.otp !== otp) {
//     throw new Error('Invalid OTP');
//   }

//   officer.isEmailVerified = true;
//   officer.otp = undefined; // or null
//   await officer.save();

//   return { message: 'Email verified successfully' };
// }

  // Get all officers
  async getAllOfficers(): Promise<Officer[]> {
    return this.officerModel.find().exec();
  }

  async getOfficerById(id: string): Promise<Officer> {
    const officer = await this.officerModel.findById(id).exec();
    if (!officer) {
      throw new NotFoundException('Officer not found');
    }
    return officer;
  }

  // Update officer by ID
  async updateOfficer(id: string, updateData: Partial<RegisterOfficerDto>): Promise<Officer> {
    if (updateData.password || updateData.confirmPassword) {
      if (updateData.password !== updateData.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedOfficer = await this.officerModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedOfficer) {
      throw new NotFoundException('Officer not found');
    }

    return updatedOfficer;
  }

  // Delete officer by ID
  async deleteOfficer(id: string): Promise<{ message: string }> {
    const result = await this.officerModel.findByIdAndDelete(id);

    if (!result) {
      throw new NotFoundException('Officer not found');
    }

    return { message: 'Officer deleted successfully' };
  }
}
