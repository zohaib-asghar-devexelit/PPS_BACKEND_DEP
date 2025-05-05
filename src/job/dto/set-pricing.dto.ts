import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class SetPricingDto {
  @ApiProperty({
    description: 'Hourly rate for the job',
    example: 25,
  })
  @IsNumber()
  hourlyRate: number;
}
