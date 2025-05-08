import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class BankDetail {
  @Prop({ required: true })
  accountHolderName: string;

  @Prop({ required: true })
  bankName: string;

  @Prop({ required: true })
  accountNumber: string;

  @Prop({ required: true, enum: ['saving', 'checking'] })
  accountType: string;

  @Prop({ required: true })
  routingNumber: string;
}
export const BankDetailSchema = SchemaFactory.createForClass(BankDetail);

@Schema()
export class EmergencyContact {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  phoneNumber: string;
}
export const EmergencyContactSchema = SchemaFactory.createForClass(EmergencyContact);

@Schema({ timestamps: true })
export class Officer extends Document {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  emailAddress: string;

  @Prop({ required: false })
  password: string;

  @Prop({ required: false })
  confirmPassword: string;

  @Prop({ required: false })
  dateOfBirth: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  street: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  zipCode: string;

  @Prop({ required: false })
  socialSecurityNumber: string;

  @Prop({ type: [String], required: false })
  documents?: string[];

  // Bank detail sub-document
  @Prop({ type: BankDetailSchema, required: false })
  bankDetail?: BankDetail;

  // Emergency contact sub-document
  @Prop({ type: EmergencyContactSchema, required: false })
  emergencyContact?: EmergencyContact;

  @Prop({ required: false })
  otp?: string;
  
  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ default: 0 })
  status: number;

  @Prop({ required: true })
  accountType: string;
}

export const OfficerSchema = SchemaFactory.createForClass(Officer);
