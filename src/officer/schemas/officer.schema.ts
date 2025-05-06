// src/auth/schemas/officer.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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

  @Prop({ required: false })
  document?: string;

  @Prop({ required: false })
  availability: string; // e.g. "Mon to Fri, 8 AM to 6 PM"

  @Prop({ required: false })
  emergencyContactInfo: string;

    // ✅ New fields
  @Prop({ required: false })
  otp?: string;
  
  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ default: 0 }) // 0 for inactive, 1 for active, or as per your use case
  status: number;
}

export const OfficerSchema = SchemaFactory.createForClass(Officer);


