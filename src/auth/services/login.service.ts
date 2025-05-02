import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Officer } from '../../officer/schemas/officer.schema';
import { Company } from '../../company/schemas/company.schema';
import { LoginOfficerDto } from '../dto/login.dto';

@Injectable()
export class LoginService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel('Officer') private readonly officerModel: Model<Officer>,
    @InjectModel('Company') private readonly companyModel: Model<Company>,
  ) {}

  async login(loginDto: LoginOfficerDto): Promise<{ token: string; user: Officer | Company }> {
    const { emailAddress, Password } = loginDto;

    // Try company first
    let user = await this.companyModel.findOne({ emailAddress });
    if (!user) {
      // Try officer next
      user = await this.officerModel.findOne({ emailAddress });
    }

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    console.log("===>User",user,user.password)
    const hashedPassword = user.password || user.password;
  if (!hashedPassword) {
    throw new UnauthorizedException('Password not set for this account');
  }

  const isPasswordValid = await bcrypt.compare(Password, hashedPassword);
  if (!isPasswordValid) {
    throw new UnauthorizedException('Invalid password');
  }

    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Email not verified');
    }

    const payload = {
      sub: user._id,
      email: user.emailAddress,
      // no role included here
    };

    const token = this.jwtService.sign(payload);

    return {
      token,
      user,
    };
  }
}
