import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MailService } from '../common/mailer/mailer.service';
import { JwtStrategy } from './jwt.strategy';
import { ForgotPasswordService } from './services/forgot-password.service';
import { LoginService } from './services/login.service';
import { RegisterService } from './services/register.service';
import { ForgotPasswordController } from './controllers/forgot-password.controller';
import { RegisterController } from './controllers/auth.controller';
import { CompanyModule } from '../company/company.module';
import { OfficerModule } from '../officer/officer.module';
import { ChangePasswordService } from './services/change-password.service';
import { Account, AccountSchema } from './schemas/account.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';


@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Use process.env.JWT_SECRET in production
      signOptions: { expiresIn: '1d' },
    }),
    CompanyModule,
    OfficerModule,
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
  ],
  providers: [JwtStrategy, MailService, ForgotPasswordService, LoginService, RegisterService,ChangePasswordService],
  controllers: [ForgotPasswordController, RegisterController],
  exports: [MailService, ForgotPasswordService, LoginService],
})
export class AuthModule {}
