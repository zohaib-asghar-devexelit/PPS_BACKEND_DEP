// src/auth/dto/contact-person.dto.ts
import { IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ContactPersonDto {
  @ApiProperty()
  @IsString()
  fullName: string;

  @ApiProperty()
  @IsEmail()
  contactEmail: string;

  @ApiProperty()
  @IsString()
  role: string;
}
