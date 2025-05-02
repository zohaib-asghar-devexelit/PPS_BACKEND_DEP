import { Controller, Body, Put, Param, Delete, Get } from '@nestjs/common';
import { OfficerService } from './officer.service';
// import { RegisterOfficerDto } from '../dto/register-officer.dto';
import { UpdateOfficerDto } from '../officer/dto/update-officer.dto'; // Assuming you have an update DTO
import { ApiTags, ApiOperation, ApiResponse as SwaggerApiResponse } from '@nestjs/swagger';
import { ApiResponse } from '../auth/dto/api-response.dto';
// import { VerifyOtpDto } from '../dto/verify-otp.dto';
// import { LoginOfficerDto } from '../dto/login.dto';

@ApiTags('Officer')
@Controller('officer')
export class OfficerController {
  constructor(private readonly officerService: OfficerService) {}

  // @Post('login')
  // @ApiOperation({ summary: 'Login an officer' })
  // @SwaggerApiResponse({
  //   status: 200,
  //   description: 'Login successful and JWT token returned',
  //   type: ApiResponse,
  // })
  // @SwaggerApiResponse({
  //   status: 401,
  //   description: 'Invalid credentials or email not verified',
  //   type: SwaggerApiResponse,
  // })
  // async login(@Body() loginOfficerDto: LoginOfficerDto) {
  //   const { token, officer } = await this.officerService.login(loginOfficerDto);
  //   return {
  //     statusCode: 200,
  //     success: true,
  //     description: 'Login successful',
  //     content: {
  //       officer,
  //       token,
  //     },
  //   };
  // }

  // Register a new officer
//   @Post('register')
// @ApiOperation({ summary: 'Register a new officer' })
// @SwaggerApiResponse({
//   status: 200,
//   description: 'Officer registered successfully',
//   type: ApiResponse,
// })
// @SwaggerApiResponse({
//   status: 409,
//   description: 'Officer email already exists',
//   type: ApiResponse,
// })
// async register(@Body() dto: RegisterOfficerDto) {
//   const { officer, token } = await this.officerService.registerOfficer(dto);
//   return {
//     statusCode: 200,
//     success: true,
//     description: 'Officer registered successfully',
//     content: {
//       officer,
//       token,
//     },
//   };
// }
// @Post('verify-otp')
// async verifyOtp(@Body() dto: VerifyOtpDto) {
//   return this.officerService.verifyOtp(dto);
// }

  // Get a list of all officers
  @Get('getAllOfficer')
  @ApiOperation({ summary: 'Get all officers' })
  @SwaggerApiResponse({
    status: 200,
    description: 'List of officers retrieved successfully',
    type: [ApiResponse],
  })
  async getAll() {
    const result = await this.officerService.getAllOfficers();
    return {
      statusCode: 200,
      success: true,
      description: 'List of officers retrieved successfully',
      content: result,
    };
  }

  // Get an officer by ID
  @Get('getOfficerbyId/:id')
  @ApiOperation({ summary: 'Get officer by ID' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Officer retrieved successfully',
    type: ApiResponse,
  })
  @SwaggerApiResponse({
    status: 404,
    description: 'Officer not found',
    type: ApiResponse,
  })
  async getById(@Param('id') id: string) {
    const result = await this.officerService.getOfficerById(id);
    return {
      statusCode: 200,
      success: true,
      description: 'Officer retrieved successfully',
      content: result,
    };
  }

  // Update an officer's details
  @Put('updateOfficer/:id')
  @ApiOperation({ summary: 'Update officer details' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Officer updated successfully',
    type: ApiResponse,
  })
  @SwaggerApiResponse({
    status: 404,
    description: 'Officer not found',
    type: ApiResponse,
  })
  async update(@Param('id') id: string, @Body() dto: UpdateOfficerDto) {
    const result = await this.officerService.updateOfficer(id, dto);
    return {
      statusCode: 200,
      success: true,
      description: 'Officer updated successfully',
      content: result,
    };
  }

  // Delete an officer
  @Delete('deleteOfficer/:id')
  @ApiOperation({ summary: 'Delete an officer' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Officer deleted successfully',
    type: ApiResponse,
  })
  @SwaggerApiResponse({
    status: 404,
    description: 'Officer not found',
    type: ApiResponse,
  })
  async delete(@Param('id') id: string) {
    const result = await this.officerService.deleteOfficer(id);
    return {
      statusCode: 200,
      success: true,
      description: 'Officer deleted successfully',
      content: result,
    };
  }
}
