import {
  Controller,
  // Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { RegisterCompanyDto } from './dto/register-company.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse as SwaggerApiResponse,
} from '@nestjs/swagger';
import { ApiResponse } from '../auth/dto/api-response.dto';
import { NotFoundException } from '@nestjs/common';

@ApiTags('Company')
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  // Get all companies
  @Get('getAllCompanies')
  @ApiOperation({ summary: 'Get all companies' })
  @SwaggerApiResponse({
    status: 200,
    description: 'List of all companies',
    type: [ApiResponse],
  })
  async getAll() {
    const result = await this.companyService.getAllCompanies();
    return {
      statusCode: 200,
      success: true,
      description: 'Companies retrieved successfully',
      content: result,
    };
  }

  // Get a company by ID
  @Get('getCompanyById/:id')
  @ApiOperation({ summary: 'Get company by ID' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Company retrieved successfully',
    type: ApiResponse,
  })
  @SwaggerApiResponse({
    status: 404,
    description: 'Company not found',
    type: ApiResponse,
  })
  async getById(@Param('id') id: string) {
    try {
      const result = await this.companyService.getCompanyById(id);
      return {
        statusCode: 200,
        success: true,
        description: 'Company retrieved successfully',
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

  // Update a company by ID
  @Put('updateCompany/:id')
  @ApiOperation({ summary: 'Update company details' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Company updated successfully',
    type: ApiResponse,
  })
  @SwaggerApiResponse({
    status: 404,
    description: 'Company not found',
    type: ApiResponse,
  })
  async update(@Param('id') id: string, @Body() dto: RegisterCompanyDto) {
    try {
      const result = await this.companyService.updateCompany(id, dto);
      return {
        statusCode: 200,
        success: true,
        description: 'Company updated successfully',
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

  // Delete a company by ID
  @Delete('deleteCompany/:id')
  @ApiOperation({ summary: 'Delete company by ID' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Company deleted successfully',
    type: ApiResponse,
  })
  @SwaggerApiResponse({
    status: 404,
    description: 'Company not found',
    type: ApiResponse,
  })
  async delete(@Param('id') id: string) {
    try {
      const result = await this.companyService.deleteCompany(id);
      return {
        statusCode: 200,
        success: true,
        description: 'Company deleted successfully',
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
