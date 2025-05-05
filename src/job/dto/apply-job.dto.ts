// src/jobs/dto/apply-job.dto.ts
import { IsNotEmpty, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ApplyJobDto {
  @ApiProperty({
    description: 'ID of the job the officer is applying to',
    example: '663774fa14e0c7e25d36d6b1',
  })
  @IsNotEmpty()
  @IsMongoId()
  jobId: string;

  @ApiProperty({
    description: 'ID of the officer who is applying',
    example: '663774fa14e0c7e25d36d6f9',
  })
  @IsNotEmpty()
  @IsMongoId()
  officerId: string;
}
