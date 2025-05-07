import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Officer } from '../../officer/schemas/officer.schema';
import { Company } from '../../company/schemas/company.schema';
import { Account } from '../schemas/account.schema';
import { LoginOfficerDto } from '../dto/login.dto';

@Injectable()
export class LoginService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel('Officer') private readonly officerModel: Model<Officer>,
    @InjectModel('Company') private readonly companyModel: Model<Company>,
    @InjectModel('Account') private readonly accountModel: Model<Account>,
  ) {}

  // async login(loginDto: LoginOfficerDto): Promise<{ token: string; user: Officer | Company }> {
  //   const { emailAddress, password } = loginDto;

  //   // Try company first
  //   let user = await this.companyModel.findOne({ emailAddress });
  //   if (!user) {
  //     // Try officer next
  //     user = await this.officerModel.findOne({ emailAddress });
  //   }

  //   if (!user) {
  //     throw new UnauthorizedException('Invalid credentials');
  //   }
  //   const hashedPassword = user.password || user.password;
  // if (!hashedPassword) {
  //   throw new UnauthorizedException('Password not set for this account');
  // }

  // const isPasswordValid = await bcrypt.compare(password, hashedPassword);
  // if (!isPasswordValid) {
  //   throw new UnauthorizedException('Invalid password');
  // }

  //   if (!user.isEmailVerified) {
  //     throw new UnauthorizedException('Email not verified');
  //   }

  //   const payload = {
  //     sub: user._id,
  //     email: user.emailAddress,
  //     // no role included here
  //   };

  //   const token = this.jwtService.sign(payload);

  //   return {
  //     token,
  //     user,
  //   };
  // }

  async login(loginDto: LoginOfficerDto): Promise<{ token: string; user: Officer | Company }> {
    const { emailAddress, password } = loginDto;
  
    // Find the account
    const account = await this.accountModel.findOne({ emailAddress });
    if (!account) {
      throw new UnauthorizedException('Invalid credentials');
    }
    console.log("==>",emailAddress,password)
    if (!account.password) {
      throw new UnauthorizedException('Password not set for this account');
    }
    const isPasswordValid = await bcrypt.compare(password, account.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }
  
    if (!account.isEmailVerified) {
      throw new UnauthorizedException('Email not verified');
    }
  
    // Fetch user based on account type
    let user: Officer | Company;
  
    if (account.accountType === 'company') {
      const company = await this.companyModel.findById(account.refId);
      if (!company) throw new UnauthorizedException('Company not found');
      user = company;
    } else if (account.accountType === 'officer') {
      const officer = await this.officerModel.findById(account.refId);
      if (!officer) throw new UnauthorizedException('Officer not found');
      user = officer;
    } else {
      throw new UnauthorizedException('Unknown account type');
    }
  
    if (!user) {
      throw new UnauthorizedException('Associated user not found');
    }
  
    const token = this.jwtService.sign({
      sub: user._id,
      email: account.emailAddress,
      role: account.accountType,
    });
  
    return { token, user };
  }
  
  
}
