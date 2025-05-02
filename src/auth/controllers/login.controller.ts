// import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
// import {
//   ApiOperation,
//   ApiResponse as SwaggerApiResponse,
// } from '@nestjs/swagger';
// import { LoginOfficerDto } from '../dto/login.dto';
// import { ApiResponse } from '@nestjs/swagger';
// import { LoginService } from '../services/login.service';

// @Controller('auth')
// export class LoginController {
//   constructor(private readonly loginService: LoginService) {}

//   @Post('login')
//   @ApiOperation({ summary: 'Login user (officer or company)' })
//   @SwaggerApiResponse({
//     status: 200,
//     description: 'Login successful',
//     type: ApiResponse,
//   })
//   @SwaggerApiResponse({
//     status: 401,
//     description: 'Invalid credentials or unverified email',
//     type: ApiResponse,
//   })
//   async login(@Body() loginDto: LoginOfficerDto) {
//     try {
//       const result = await this.loginService.login(loginDto);
//       return {
//         statusCode: 200,
//         success: true,
//         description: 'Login successful',
//         content: result,
//       };
//     } catch (error) {
//       if (error instanceof UnauthorizedException) {
//         return {
//           statusCode: 401,
//           success: false,
//           description: error.message,
//         };
//       }
//       throw error;
//     }
//   }
// }
