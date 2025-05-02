// src/auth/dto/register-officer.dto.ts

import { IsString, IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsDateString, IsBoolean,IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterOfficerDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  emailAddress: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  confirmPassword: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  dateOfBirth: string;

  @ApiProperty()
  @IsPhoneNumber()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

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
  @IsNotEmpty()
  socialSecurityNumber: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  document?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  preferredWorkingArea: string;

  @ApiProperty({
    example: 'Mon to Fri, 8 AM to 6 PM',
  })
  @IsString()
  @IsNotEmpty()
  availability: string;

  @ApiProperty()
  @IsPhoneNumber()
  @IsNotEmpty()
  emergencyContactInfo: string;

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
  @IsNumber()
  status: number;
}
