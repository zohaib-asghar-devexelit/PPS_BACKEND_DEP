import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { Company, CompanySchema } from './schemas/company.schema';
import { JwtModule } from '@nestjs/jwt';
import { MailService } from '../common/mailer/mailer.service';
import * as dotenv from 'dotenv';
import { Account, AccountSchema } from '../auth/schemas/account.schema';

dotenv.config();

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Company.name, schema: CompanySchema },
      { name: Account.name, schema: AccountSchema }
    ]),
    JwtModule.register({
      secret: 'your_jwt_secret', // Or use process.env.JWT_SECRET
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [CompanyController],
  providers: [CompanyService, MailService],
  exports: [CompanyService, MongooseModule],
})
export class CompanyModule {}