import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { Job, JobSchema } from './schemas/job.schema'; // Adjust path if needed
import { Company, CompanySchema } from '../company/schemas/company.schema';
import { Officer, OfficerSchema } from '../officer/schemas/officer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Job.name, schema: JobSchema },
        { name: Company.name, schema: CompanySchema },
        { name: Officer.name, schema: OfficerSchema },
    ]), // MongoDB model binding
  ],
  controllers: [JobController],
  providers: [JobService],
  exports: [JobService], // Export if other modules need to use JobService
})
export class JobModule {}
