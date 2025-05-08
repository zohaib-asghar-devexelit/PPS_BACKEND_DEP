// src/auth/dto/update-officer.dto.ts

<<<<<<< HEAD
import { IsString, IsEmail, IsOptional, IsPhoneNumber, IsDateString,IsBoolean,IsIn,IsArray } from 'class-validator';
=======
import { IsString, IsEmail, IsOptional, IsPhoneNumber, IsDateString,IsBoolean,IsIn } from 'class-validator';
>>>>>>> 87d3f3672105ce549ec57ec17f67166025fde68f
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

  @ApiProperty({
    description: 'Array of document URLs or identifiers',
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  documents?: string[];

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

  // @ApiProperty({ required: false })
  // @IsOptional()
  // @IsString()
  // otp?: string;
  
  // @ApiProperty({ required: false })
  // @IsOptional()
  // @IsBoolean()
  // isEmailVerified?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isAdmin: boolean;

  // @ApiProperty({ required: false })
  // @IsOptional()
  // @IsString()
  // emailVerificationToken?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  resetPasswordToken?: string;

<<<<<<< HEAD
  // @ApiProperty({ required: false })
  // @IsOptional()
  // @IsIn([0, 1])
  // status: number;
=======
  @ApiProperty({ required: false })
  @IsOptional()
  @IsIn([0, 1])
  status: number;
>>>>>>> 87d3f3672105ce549ec57ec17f67166025fde68f
}
