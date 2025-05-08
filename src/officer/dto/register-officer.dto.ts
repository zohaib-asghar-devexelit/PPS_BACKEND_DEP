import { IsString, IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsDateString, IsBoolean, IsIn, IsArray, ValidateNested, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class BankDetailDto {
  @ApiProperty({ description: 'Account holder full name' })
  @IsString()
  @IsNotEmpty()
  accountHolderName: string;

  @ApiProperty({ description: 'Bank name' })
  @IsString()
  @IsNotEmpty()
  bankName: string;

  @ApiProperty({ description: 'Bank account number' })
  @IsString()
  @IsNotEmpty()
  accountNumber: string;

  @ApiProperty({ description: 'Account type', enum: ['saving', 'checking'] })
  @IsString()
  @IsIn(['saving', 'checking'])
  accountType: 'saving' | 'checking';

  @ApiProperty({ description: 'Routing number' })
  @IsString()
  @IsNotEmpty()
  routingNumber: string;
}

export class EmergencyContactDto {
  @ApiProperty({ description: 'Emergency contact person name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Emergency contact phone number (Arizona, USA)' })
  @Matches(/^(\+1[- ]?)?(\(?\b(480|520|602|623|928)\b\)?[- ]?)?[2-9]\d{2}[- ]?\d{4}$/, { message: 'Phone number must be a valid Arizona (USA) number with area code 480, 520, 602, 623, or 928' })
  @IsNotEmpty()
  phoneNumber: string;
}

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

  @ApiProperty({ description: 'Array of document URLs or identifiers', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  documents?: string[];

  @ApiProperty({ description: 'Bank account details', type: BankDetailDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => BankDetailDto)
  bankDetail?: BankDetailDto;

  @ApiProperty({ description: 'Emergency contact information', type: EmergencyContactDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => EmergencyContactDto)
  emergencyContact?: EmergencyContactDto;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isAdmin: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsIn([0, 1])
  status: number;
}
