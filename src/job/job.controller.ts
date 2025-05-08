// src/jobs/job.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Put,
  Delete,
  Patch,
  UseGuards
} from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { ApplyJobDto } from './dto/apply-job.dto';
import { SetPricingDto } from './dto/set-pricing.dto';
// import { GetOfficerJobsDto } from './dto/get-officer-jobs.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse as SwaggerApiResponse,
  ApiQuery,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { JobStatus } from 'src/common/enums/jobstatus.enum';
import { ApiBearerAuth } from '@nestjs/swagger';import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiBearerAuth('JWT-auth')// use same key as above
@UseGuards(JwtAuthGuard)
@ApiTags('Job')
@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post('createJob')
  @ApiOperation({ summary: 'Create a new job' })
  @ApiBody({ type: CreateJobDto })
  @SwaggerApiResponse({ status: 200, description: 'Job created successfully' })
  async createJob(@Body() dto: CreateJobDto) {
    const result = await this.jobService.createJob(dto);
    return {
      statusCode: 200,
      success: true,
      description: 'Job created successfully',
      content: result,
    };
  }
  @Get('getAllJobs')
  @ApiOperation({ summary: 'Get all jobs with pagination and filters' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'Start date for filtering (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'End date for filtering (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'dutyHours',
    required: false,
    type: Number,
    description: 'Return jobs with duty hours less than this value',
  })
  @ApiQuery({
    name: 'minHourlyRate',
    required: false,
    type: Number,
    description: 'Minimum hourly rate',
  })
  @ApiQuery({
    name: 'maxHourlyRate',
    required: false,
    type: Number,
    description: 'Maximum hourly rate',
  })
  @SwaggerApiResponse({
    status: 200,
    description: 'Jobs retrieved successfully',
  })
  async getAllJobs(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search = '',
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('dutyHours') dutyHours?: number,
    @Query('minHourlyRate') minHourlyRate?: number,
    @Query('maxHourlyRate') maxHourlyRate?: number,
  ) {
    const result = await this.jobService.getAllJobs(
      page,
      limit,
      search,
      status,
      startDate,
      endDate,
      dutyHours,
      minHourlyRate,
      maxHourlyRate,
    );
  
    return {
      statusCode: 200,
      success: true,
      description: 'Jobs retrieved successfully',
      content: result.data,
      meta: {
        totalData: result.totalData,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
        limit: result.limit,
      },
    };
  }
  

  @Get('getJobById/:id')
  @ApiOperation({ summary: 'Get job by ID' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Job retrieved successfully',
  })
  @SwaggerApiResponse({ status: 404, description: 'Job not found' })
  async getJobById(@Param('id') id: string) {
    const result = await this.jobService.getJobById(id);
    return {
      statusCode: 200,
      success: true,
      description: 'Job retrieved successfully',
      content: result,
    };
  }

  // job.controller.ts
  @Get('jobsBySpecificCompany/:companyId')
  @ApiOperation({ summary: 'Get all jobs for a specific company by companyId' })
  @ApiParam({ name: 'companyId', type: String, required: true })
  @SwaggerApiResponse({ status: 200, description: 'Jobs fetched successfully' })
  async getJobsByCompanyId(@Param('companyId') companyId: string) {
    const jobs = await this.jobService.getJobsByCompanyId(companyId);
    return {
      statusCode: 200,
      success: true,
      description: 'Jobs fetched successfully',
      content: jobs,
    };
  }

  @Patch('setPricing/:id')
  @ApiOperation({ summary: 'Set pricing for a job' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Pricing updated successfully',
  })
  @SwaggerApiResponse({ status: 404, description: 'Job not found' })
  async setPricing(
    @Param('id') id: string,
    @Body() setPricingDto: SetPricingDto,
  ) {
    const updatedJob = await this.jobService.setPricing(id, setPricingDto);
    return {
      statusCode: 200,
      success: true,
      description: 'Pricing updated successfully',
      content: updatedJob,
    };
  }

  @Patch('changeStatus/:id')
  @ApiOperation({
    summary: 'Change job status (open ↔ closed ↔ pending pricing)',
  })
  @SwaggerApiResponse({
    status: 200,
    description: 'Job status updated successfully',
  })
  async changeStatus(
    @Param('id') id: string,
    @Body('status') status: JobStatus,
  ) {
    const result = await this.jobService.changeStatus(id, status);
    return {
      statusCode: 200,
      success: true,
      description: 'Job status updated successfully',
      content: result,
    };
  }

  @Patch('apply')
  @ApiOperation({ summary: 'Officer applies for a job' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Officer applied successfully',
  })
  async applyForJob(@Body() dto: ApplyJobDto) {
    const job = await this.jobService.applyForJob(dto.jobId, dto.officerId);
    return {
      statusCode: 200,
      success: true,
      description: 'Officer applied successfully',
      content: job,
    };
  }
  @Get('officer-jobs')
@ApiOperation({ summary: 'Get jobs applied by an officer with pagination and filtering' })
@ApiQuery({ name: 'officerId', required: true })
@ApiQuery({ name: 'page', required: false, type: Number })
@ApiQuery({ name: 'limit', required: false, type: Number })
@ApiQuery({ name: 'search', required: false, type: String })
@SwaggerApiResponse({ status: 200, description: 'List of jobs for officer with pagination' })
async getOfficerJobs(
  @Query('officerId') officerId: string,
  @Query('page') page: number = 1,
  @Query('limit') limit: number = 10,
  @Query('search') search?: string,
) {
  return this.jobService.getJobsByOfficerId(officerId, page, limit, search);
}

  
  @Put('updateJob/:id')
  @ApiOperation({ summary: 'Update job by ID' })
  @SwaggerApiResponse({ status: 200, description: 'Job updated successfully' })
  async updateJob(@Param('id') id: string, @Body() dto: UpdateJobDto) {
    const result = await this.jobService.updateJob(id, dto);
    return {
      statusCode: 200,
      success: true,
      description: 'Job updated successfully',
      content: result,
    };
  }

  @Delete('deleteJob/:id')
  @ApiOperation({ summary: 'Delete job by ID' })
  @SwaggerApiResponse({ status: 200, description: 'Job deleted successfully' })
  async deleteJob(@Param('id') id: string) {
    const result = await this.jobService.deleteJob(id);
    return {
      statusCode: 200,
      success: true,
      description: 'Job deleted successfully',
      content: result,
    };
  }

}
