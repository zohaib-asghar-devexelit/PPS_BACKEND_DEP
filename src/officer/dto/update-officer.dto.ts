// src/auth/dto/update-officer.dto.ts

import { IsString, IsEmail, IsOptional, IsPhoneNumber, IsDateString,IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOfficerDto {
  @ApiProperty()
  @IsOptional()  // Makes it optional for updates
  @IsString()
  fullName?: string;  // Name is optional, only updated if provided

  @ApiProperty()
  @IsOptional()  // Makes it optional for updates
  @IsEmail()
  emailAddress?: string;  // Email is optional, only updated if provided

  @ApiProperty()
  @IsString()
  @IsOptional()
  password: string;

  @ApiProperty()
  @IsOptional()  // Makes it optional for updates
  @IsDateString()
  dateOfBirth?: string;  // Date of birth is optional, only updated if provided

  @ApiProperty()
  @IsOptional()  // Makes it optional for updates
  @IsPhoneNumber()
  phoneNumber?: string;

  @ApiProperty()
  @IsOptional()  // Makes it optional for updates
  @IsString()
  address?: string;

  @ApiProperty()
  @IsOptional()  // Makes it optional for updates
  @IsString()
  street?: string;

  @ApiProperty()
  @IsOptional()  // Makes it optional for updates
  @IsString()
  city?: string;

  @ApiProperty()
  @IsOptional()  // Makes it optional for updates
  @IsString()
  state?: string;

  @ApiProperty()
  @IsOptional()  // Makes it optional for updates
  @IsString()
  zipCode?: string;

  @ApiProperty()
  @IsOptional()  // Makes it optional for updates
  @IsString()
  socialSecurityNumber?: string;

  @ApiProperty()
  @IsOptional()  // Makes it optional for updates
  @IsString()
  document?: string;

  @ApiProperty()
  @IsOptional()  // Makes it optional for updates
  @IsString()
  preferredWorkingArea?: string;

  @ApiProperty({
    example: 'Mon to Fri, 8 AM to 6 PM',
  })
  @IsOptional()  // Makes it optional for updates
  @IsString()
  availability?: string;

  @ApiProperty()
  @IsOptional()  // Makes it optional for updates
  @IsPhoneNumber()
  emergencyContactInfo?: string;

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
}
