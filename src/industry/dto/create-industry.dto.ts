// src/industry/dto/create-industry.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateIndustryDto {
  @ApiProperty({
    description: 'Name of the industry',
    example: 'Information Technology',
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}
