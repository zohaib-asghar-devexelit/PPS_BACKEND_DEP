// forgot-password.controller.ts

import { Controller, Post, Body, NotFoundException } from '@nestjs/common';
import { ApiResponse  } from '@nestjs/swagger';
import { ForgotPasswordService } from '../services/forgot-password.service';
import { ForgotPasswordDto } from '../dto/forgot-password.dto'; 
import {
  ApiOperation,
  ApiResponse as SwaggerApiResponse,
} from '@nestjs/swagger';
@Controller('auth')
export class ForgotPasswordController {
  constructor(private readonly forgotPasswordService: ForgotPasswordService) {}

  @Post('forgot-password')
  @ApiOperation({ summary: 'Send password reset or verification link' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Reset or verification link sent successfully',
    type: ApiResponse,
  })
  @SwaggerApiResponse({
    status: 404,
    description: 'Company not found',
    type: ApiResponse,
  })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    try {
      const result = await this.forgotPasswordService.sendResetPasswordLink(forgotPasswordDto.email, forgotPasswordDto.role);
      return {
        statusCode: 200,
        success: true,
        description: 'Reset or verification link sent successfully',
        content: result,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return {
          statusCode: 404,
          success: false,
          description: error.message,
        };
      }
      throw error;
    }
  }
}
