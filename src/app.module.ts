import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // <-- import this
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { mongooseConfig } from './config/mongoose.config';
import { CompanyModule } from './company/company.module';
import { OfficerModule } from './officer/officer.module';
import { JobModule } from './job/job.module';
import { IndustryModule } from './industry/industry.module';
import { AwsS3Module } from './aws-s3/aws-s3.module'; // <-- import your AwsS3Module here

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // <-- makes config available app-wide via process.env or ConfigService
    }),
    MongooseModule.forRootAsync({
      useFactory: async () => mongooseConfig,
    }),
    AuthModule,
    CompanyModule,
    OfficerModule,
    JobModule,
    IndustryModule,
    AwsS3Module, // <-- add AwsS3Module to the imports array
  ],
})
export class AppModule {}
