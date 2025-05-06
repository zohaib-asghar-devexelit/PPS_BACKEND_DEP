import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IndustryController } from './industry.controller';
import { IndustryService } from './industry.service';
import { Industry, IndustrySchema } from './schemas/industry.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Industry.name, schema: IndustrySchema }]),
  ],
  controllers: [IndustryController],
  providers: [IndustryService],
  exports: [IndustryService],
})
export class IndustryModule {}
