import { IsString, IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsBoolean,IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterCompanyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  emailAddress: string;

  @ApiProperty()  
  @IsString()
  @IsOptional()
  password: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  confirmPassword: string;

  @ApiProperty()
  @IsPhoneNumber()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  companyAddress: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  zipCode: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  registrationNumber: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  taxId: string;
  
  @ApiProperty()
  @IsString()
  @IsOptional()
  industry: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  fullName: string;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  contactEmail: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  role: string;

  @ApiProperty()
  @IsOptional()
  document?: string;

  // ✅ New properties
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  otp?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isEmailVerified?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isAdmin: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  emailVerificationToken?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  resetPasswordToken?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  status: number;
}
