import { Controller, Post, Body, Param,UnauthorizedException, } from '@nestjs/common';
import { ApiOperation, ApiResponse as SwaggerApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { RegisterService } from '../services/register.service';
import { RegisterOfficerDto } from '../../officer/dto/register-officer.dto';
import { RegisterCompanyDto } from '../../company/dto/register-company.dto';
import { LoginOfficerDto } from '../dto/login.dto';
import { ApiResponse } from '@nestjs/swagger';
import { LoginService } from '../services/login.service';
import { ChangePasswordService } from '../services/change-password.service';
import { VerifyOtpDto } from '../dto/verify-otp.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';

@ApiTags('Auth')
@Controller('auth')
export class RegisterController {
    constructor(
        private readonly registerService: RegisterService,
        private readonly loginService: LoginService,
        private readonly changePasswordService: ChangePasswordService,
      ) {}

  @Post('login')
  @ApiOperation({ summary: 'Login user (officer or company)' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Login successful',
    type: ApiResponse,
  })
  @SwaggerApiResponse({
    status: 401,
    description: 'Invalid credentials or unverified email',
    type: ApiResponse,
  })
  async login(@Body() loginDto: LoginOfficerDto) {
    try {
      const result = await this.loginService.login(loginDto);
      return {
        statusCode: 200,
        success: true,
        description: 'Login successful',
        content: result,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        return {
          statusCode: 401,
          success: false,
          description: error.message,
        };
      }
      throw error;
    }
  }
  
  @Post('officer-register')
  @ApiOperation({ summary: 'Register a new officer' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Officer registered successfully',
  })
  @SwaggerApiResponse({
    status: 400,
    description: 'Validation failed',
  })
  @SwaggerApiResponse({
    status: 409,
    description: 'Officer email already exists',
  })
  async registerOfficer(@Body() dto: RegisterOfficerDto) {
    const { officer, token } = await this.registerService.registerOfficer(dto);
    return {
      statusCode: 200,
      success: true,
      description: 'Officer registered successfully',
      content: {
        officer,
        token,
      },
    };
  }
  

  @Post('company-register')
  @ApiOperation({ summary: 'Register a new company' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Company registered successfully',
  })
  @SwaggerApiResponse({
    status: 409,
    description: 'Company email or name already exists',
  })
  async registerCompany(@Body() dto: RegisterCompanyDto) {
    const { company, token } = await this.registerService.registerCompany(dto);
    return {
      statusCode: 200,
      success: true,
      description: 'Company registered successfully',
      content: {
        company,
        token,
      },
    };
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify user OTP' })
  @ApiResponse({
    status: 200,
    description: 'Email verified successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid OTP or user not found',
  })
  @ApiBody({
    type: VerifyOtpDto, // Explicitly use the DTO to describe the request body
  })
  async verifyOtp(@Body() payload: VerifyOtpDto) {
    const result = await this.registerService.verifyOtp(payload);
    return {
      statusCode: 200,
      success: true,
      description: result.message,
    };
  }


  @Post('resend-otp/:id')
  @ApiOperation({ summary: 'Resend OTP to user' })
  @SwaggerApiResponse({
    status: 200,
    description: 'OTP resent successfully',
  })
  @SwaggerApiResponse({
    status: 404,
    description: 'User not found',
  })
  async resendOtp(@Param('id') id: string) {
    const result = await this.registerService.resendOtp(id);
    return {
      statusCode: 200,
      success: true,
      description: result.message,
    };
  }
  
  @Post('change-password')
  @ApiOperation({ summary: 'Change the user password using the reset token' })
  @ApiResponse({
    status: 200,
    description: 'Password successfully changed',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid token or passwords do not match',
  })
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    const result = await this.changePasswordService.changePassword(changePasswordDto);
    return {
      statusCode: 200,
      success: true,
      description: result,
    };
  }
}
