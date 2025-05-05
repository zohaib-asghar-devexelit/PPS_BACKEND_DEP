import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { Job, JobSchema } from './schemas/job.schema'; // Adjust path if needed
import { Company, CompanySchema } from '../company/schemas/company.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Job.name, schema: JobSchema },
        { name: Company.name, schema: CompanySchema },
    ]), // MongoDB model binding
  ],
  controllers: [JobController],
  providers: [JobService],
  exports: [JobService], // Export if other modules need to use JobService
})
export class JobModule {}
