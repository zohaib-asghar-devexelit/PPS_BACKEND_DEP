// src/auth/dto/update-company.dto.ts
import { IsString, IsEmail, IsOptional, IsPhoneNumber,IsBoolean,IsIn, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCompanyDto {
  @ApiProperty()
  @IsOptional()  // Makes it optional for updates
  @IsString()
  companyName?: string;

  @ApiProperty()
  @IsOptional()  // Makes it optional for updates
  @IsEmail({}, { message: 'Invalid email format' })
  emailAddress?: string;

  @ApiProperty()
  @IsOptional()  // Makes it optional for updates
  @IsString()
  password?: string;

  @ApiProperty()
  @IsOptional()  // Makes it optional for updates
  @IsString()
  confirmPassword?: string;

  @ApiProperty()
  @IsOptional()  // Makes it optional for updates
  @IsPhoneNumber()
  phoneNumber?: string;

  @ApiProperty()
  @IsOptional()  // Makes it optional for updates
  @IsString()
  companyAddress?: string;

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
  registrationNumber?: string;

  @ApiProperty()
  @IsOptional()  // Makes it optional for updates
  @IsString()
  taxId?: string;

  @ApiProperty()
  @IsOptional()  // Makes it optional for updates
  @IsString()
  industry?: string;

  @ApiProperty()
  @IsOptional()  // Makes it optional for updates
  @IsString()
  fullName?: string;

  @ApiProperty()
  @IsOptional()  // Makes it optional for updates
  @IsEmail()
  contactEmail?: string;

  @ApiProperty()
  @IsOptional()  // Makes it optional for updates
  @IsString()
  role?: string;

  @ApiProperty({
    description: 'Array of document URLs or identifiers',
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  documents?: string[];

  // @ApiProperty({ required: false })
  // @IsOptional()
  // @IsString()
  // otp?: string;

  // @ApiProperty({ required: false })
  // @IsOptional()
  // @IsBoolean()
  // isEmailVerified?: boolean;

  // @ApiProperty({ required: false })
  // @IsOptional()
  // @IsIn([0, 1])
  // status: number;
}
