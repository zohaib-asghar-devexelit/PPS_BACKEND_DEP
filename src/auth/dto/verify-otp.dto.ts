import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty({ description: 'Unique identifier for the user' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Email address of the user', required: false })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({ description: 'One-time password (OTP) sent to the user' })
  @IsString()
  @IsNotEmpty()
  otp: string;
}
