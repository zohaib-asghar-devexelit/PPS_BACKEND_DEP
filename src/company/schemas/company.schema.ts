import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ContactPerson {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  contactEmail: string;

  @Prop({ required: true })
  role: string;
}

const ContactPersonSchema = SchemaFactory.createForClass(ContactPerson);

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

  // @Prop({ required: false })
  // registrationNumber: string;

  @Prop({ required: false })
  taxId: string;

  // @Prop({ required: false })
  // industry: string;

  @Prop({ type: [String], required: false })
  documents?: string[];

  @Prop({ required: false })
  otp?: string;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ required: false })
  emailVerificationToken?: string;

  @Prop({ required: false })
  resetPasswordToken?: string;

  @Prop({ default: 0 })
  status: number;

  @Prop({ required: true })
  accountType: string;

  // ✅ New field for multiple contact persons
  @Prop({ type: [ContactPersonSchema], required: false })
  contactPersons?: ContactPerson[];
}

export const CompanySchema = SchemaFactory.createForClass(Company);
