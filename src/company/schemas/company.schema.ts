// src/auth/schemas/company.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Company extends Document {
  @Prop({ required: true })
  companyName: string;

  @Prop({ required: true, unique: true })
  emailAddress: string;

  @Prop({ required: false })
  password: string;

  @Prop({ required: false })
  confirmPassword: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  companyAddress: string;

  @Prop({ required: true })
  street: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  zipCode: string;

  @Prop({ required: false })
  registrationNumber: string;

  @Prop({ required: false })
  taxId: string;

  @Prop({ required: false })
  industry: string;

  @Prop({ required: false })
  fullName: string;

  @Prop({ required: false })
  contactEmail: string;

  @Prop({ required: false })
  role: string;

  @Prop({ type: [String], required: false })
  documents?: string[];

  // ✅ New fields
  @Prop({ required: false })
  otp?: string;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ required: false })
  emailVerificationToken?: string;

  @Prop({ required: false })
  resetPasswordToken?: string;

  @Prop({ default: 0 }) // 0 for inactive, 1 for active, or as per your use case
  status: number;
  
  @Prop({ required: true })
  accountType: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
