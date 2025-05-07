import { Controller, Body, Put, Param, Delete, Get, Query,Patch } from '@nestjs/common';
import { OfficerService } from './officer.service';
import { UpdateOfficerDto } from '../officer/dto/update-officer.dto'; // Assuming you have an update DTO
import { ApiTags, ApiOperation, ApiResponse as SwaggerApiResponse, ApiQuery } from '@nestjs/swagger';
import { ApiResponse } from '../auth/dto/api-response.dto';


@ApiTags('Officer')
@Controller('officer')
export class OfficerController {
  constructor(private readonly officerService: OfficerService) {}

  // Get a list of all officers
  
@Get('getAllOfficer')
@ApiOperation({ summary: 'Get all officers with pagination and search' })
@ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination (default: 1)' })
@ApiQuery({ name: 'limit', required: false, type: Number, description: 'Limit the number of companies per page (default: 10)' })
@ApiQuery({ name: 'search', required: false, type: String, description: 'Search term for filtering companies by name' })
@SwaggerApiResponse({
  status: 200,
  description: 'List of officers retrieved successfully',
})
async getAll(
  @Query('page') page: number = 1,
  @Query('limit') limit: number = 10,
  @Query('search') search: string = '',
) {
  const result = await this.officerService.getAllOfficers({
    page: Number(page),
    limit: Number(limit),
    search,
  });

  return {
    statusCode: 200,
    success: true,
    description: 'List of officers retrieved successfully',
    content: result.data,
    meta: {
      totalData: result.totalData,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      limit: result.limit,
    },
  };
}

@Patch('toggleOfficerStatus/:id')
@ApiOperation({ summary: 'Toggle Officer Status (active ↔ banned)' })
@SwaggerApiResponse({ status: 200, description: 'Officer status toggled successfully' })
async toggleOfficerStatus(@Param('id') id: string) {
  const updatedOfficer = await this.officerService.toggleStatus(id);

  const message =
    updatedOfficer.status === 1
      ? 'Officer activated successfully'
      : 'Officer banned successfully';

  return {
    statusCode: 200,
    success: true,
    description: message,
    content: updatedOfficer,
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
