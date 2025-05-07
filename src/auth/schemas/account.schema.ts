import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Account extends Document {
  @Prop({ required: true, unique: true })
  emailAddress: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  confirmPassword: string;

  @Prop({ required: true })
  accountType: 'company' | 'officer';

  @Prop({ required: true, type: Types.ObjectId })
  refId: Types.ObjectId; // ID pointing to Company or Officer

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ default: 0 }) // 0 = inactive, 1 = active
  status: number;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
