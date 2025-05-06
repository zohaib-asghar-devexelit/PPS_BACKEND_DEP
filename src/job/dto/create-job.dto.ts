// src/jobs/dto/create-job.dto.ts
import { ApiProperty ,ApiPropertyOptional} from '@nestjs/swagger';
import { JobStatus } from '../../common/enums/jobstatus.enum';
import { IsNotEmpty, IsOptional, IsString, IsNumber,IsEnum ,IsBoolean, IsMongoId,IsArray } from 'class-validator';
import { Types } from 'mongoose';

export class CreateJobDto {
  @ApiProperty({ example: 'Alpha Security Services' })
  @IsNotEmpty()
  @IsString()
  companyName: string;

  @ApiProperty({ example: '60e8b3b1f39c1c3a4c8d3a0f', description: 'MongoDB ObjectId of the company' })
  @IsNotEmpty()
  companyId: Types.ObjectId;

  // @ApiPropertyOptional({
  //   example: ['60e8b3b1f39c1c3a4c8d3a0f', '60e8b3b1f39c1c3a4c8d3a10'],
  //   description: 'Optional list of officer ObjectIds already assigned to the job',
  //   isArray: true,
  //   type: String,
  // })
  // @IsOptional()
  // @IsArray()
  // @IsMongoId({ each: true })
  // assignedOfficers?: string[];

  @ApiProperty({ example: 'Night Watch Duty' })
  @IsNotEmpty()
  @IsString()
  jobTitle: string;

  @ApiProperty({ example: 'Responsible for patrolling warehouse from 10PM to 6AM' })
  @IsNotEmpty()
  @IsString()
  jobDescription: string;

  @ApiProperty({ example: 3 })
  @IsNotEmpty()
  @IsNumber()
  officersRequired: number;

  @ApiProperty({ example: '2025-05-20' })
  @IsNotEmpty()
  @IsString()
  date: string;

  @ApiProperty({ example: '08:00 AM' })
  @IsNotEmpty()
  @IsString()
  startTime: string;

  @ApiProperty({ example: '05:00 PM' })
  @IsNotEmpty()
  @IsString()
  endTime: string;

  @ApiProperty({ example: '1234 Industrial Blvd, LA' })
  @IsNotEmpty()
  @IsString()
  jobLocation: string;

  @ApiProperty({ example: 25, required: false })
  @IsOptional()
  @IsNumber()
  hourlyRate?: number;

@ApiProperty({ enum: JobStatus, example: JobStatus.PENDING_PRICING })
@IsOptional()
@IsEnum(JobStatus)
status?: JobStatus;

@ApiProperty({ example: 'true' })
@IsOptional()
@IsBoolean()
isAdmin: boolean;
}
