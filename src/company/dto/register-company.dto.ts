// src/auth/dto/register-company.dto.ts
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsBoolean,
  IsArray,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ContactPersonDto } from './contact-person.dto'; // Adjust path as needed

export class RegisterCompanyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty()
  @IsEmail({}, { message: 'Invalid email format' })
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

  // @ApiProperty()
  // @IsString()
  // @IsOptional()
  // registrationNumber: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  taxId: string;

  // @ApiProperty()
  // @IsString()
  // @IsOptional()
  // industry: string;

  @ApiProperty({
    description: 'Array of contact persons',
    type: [ContactPersonDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContactPersonDto)
  contactPersons?: ContactPersonDto[];

  @ApiProperty({
    description: 'Array of document URLs or identifiers',
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  documents?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isAdmin: boolean;
}
