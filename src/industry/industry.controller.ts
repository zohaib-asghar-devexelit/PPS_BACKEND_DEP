import { Controller, Get } from '@nestjs/common';
import { IndustryService } from './industry.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Industries')
@Controller('industries')
export class IndustryController {
  constructor(private readonly industryService: IndustryService) {}

  @Get('seed')
  @ApiOperation({ summary: 'Seed industries (run once only)' })
  @ApiResponse({ status: 201, description: 'Industries seeded successfully' })
  async seedIndustries() {
    const result = await this.industryService.seedIndustries();
    return {
      statusCode: 201,
      success: true,
      description: 'Industries seeded successfully',
      content: result,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all industries' })
  @ApiResponse({ status: 200, description: 'List of industries retrieved successfully' })
  async getIndustries() {
    const result = await this.industryService.getIndustries();
    return {
      statusCode: 200,
      success: true,
      description: 'List of industries retrieved successfully',
      content: result,
    };
  }
}
