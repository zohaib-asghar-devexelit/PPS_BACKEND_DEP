import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { IsNotEmpty, IsOptional, IsString, IsNumber, IsBoolean, IsMongoId } from 'class-validator';

export class CreateJobDto {
  @ApiProperty({ example: 'Alpha Security Services' })
  @IsNotEmpty()
  @IsString()
  companyName: string;

  @ApiProperty({ example: '60e8b3b1f39c1c3a4c8d3a0f', description: 'MongoDB ObjectId of the company' })
  @IsNotEmpty()
  @IsMongoId()
  companyId: string;

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

  @ApiProperty({ example: '2025-05-20', description: 'Job date in ISO format' })
  @IsNotEmpty()
  @IsString()
  jobDate: string;

  @ApiProperty({ example: '08:00 AM', description: 'Start time in HH:mm AM/PM format' })
  @IsNotEmpty()
  @IsString()
  startTime: string;

  @ApiProperty({ example: '05:00 PM', description: 'End time in HH:mm AM/PM format' })
  @IsNotEmpty()
  @IsString()
  endTime: string;

  @ApiProperty({ example: '1234 Industrial Blvd, LA' })
  @IsNotEmpty()
  @IsString()
  jobLocation: string;

  @ApiPropertyOptional({ example: 25 })
  @IsOptional()
  @IsNumber()
  hourlyRate?: number;

  @ApiPropertyOptional({ description: 'Flag to indicate admin context' })
  @IsOptional()
  @IsBoolean()
  isAdmin?: boolean;
}
