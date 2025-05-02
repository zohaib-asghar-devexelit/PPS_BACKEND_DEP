import { IsEmail, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'example@company.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'example@company.com' })
  @IsIn(['company', 'officer'], { message: 'userType must be either company or officer' })
  role: 'company' | 'officer';
}
