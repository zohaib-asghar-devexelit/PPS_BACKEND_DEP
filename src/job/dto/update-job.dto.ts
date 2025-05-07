// src/jobs/dto/update-job.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateJobDto } from './create-job.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { JobStatus } from '../../common/enums/jobstatus.enum';
import { IsOptional, IsString, IsNumber,IsEnum } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateJobDto extends PartialType(CreateJobDto) {
  @ApiPropertyOptional({ example: 'Alpha Security Services' })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiPropertyOptional({ example: '60e8b3b1f39c1c3a4c8d3a0f' })
  @IsOptional()
  companyId?: Types.ObjectId;

  @ApiPropertyOptional({ example: 'Night Watch Duty' })
  @IsOptional()
  @IsString()
  jobTitle?: string;

  @ApiPropertyOptional({ example: 'Responsible for patrolling warehouse from 10PM to 6AM' })
  @IsOptional()
  @IsString()
  jobDescription?: string;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsNumber()
  officersRequired?: number;

  @ApiPropertyOptional({ example: '2025-05-20' })
  @IsOptional()
  @IsString()
  date?: string;

  @ApiPropertyOptional({ example: '08:00 AM' })
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiPropertyOptional({ example: '05:00 PM' })
  @IsOptional()
  @IsString()
  endTime?: string;

  @ApiPropertyOptional({ example: '1234 Industrial Blvd, LA' })
  @IsOptional()
  @IsString()
  jobLocation?: string;

  @ApiPropertyOptional({ example: 25 })
  @IsOptional()
  @IsNumber()
  hourlyRate?: number;

// @ApiPropertyOptional({ enum: JobStatus, example: JobStatus.PENDING_PRICING })
// @IsOptional()
// @IsEnum(JobStatus)
// status?: JobStatus;
}
