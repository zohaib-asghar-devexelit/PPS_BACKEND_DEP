// src/jobs/dto/get-officer-jobs.dto.ts
import { IsMongoId, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetOfficerJobsDto {
  @ApiProperty({ example: '66375ccbd1f0e5a5c4e12345' })
  @IsNotEmpty()
  @IsMongoId()
  officerId: string;
}
