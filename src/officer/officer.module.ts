import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Officer, OfficerSchema } from './schemas/officer.schema';
import { OfficerController } from './officer.controller';
import { OfficerService } from './officer.service';
import { JwtModule } from '@nestjs/jwt';
import { MailService } from '../common/mailer/mailer.service';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Officer.name, schema: OfficerSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Use the secret from .env
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [OfficerController],
  providers: [OfficerService, MailService],
  exports: [OfficerService, MongooseModule],
})
export class OfficerModule {}
