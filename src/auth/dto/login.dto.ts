// src/auth/dto/login-officer.dto.ts

import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginOfficerDto {
  @ApiProperty({ required: true })
  @IsEmail()
  @IsNotEmpty()
  emailAddress: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  Password: string;

}
