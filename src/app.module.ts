import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // <-- import this
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { mongooseConfig } from './config/mongoose.config';
import { CompanyModule } from './company/company.module';
import { OfficerModule } from './officer/officer.module';
import { JobModule } from './job/job.module';

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
  ],
})
export class AppModule {}
