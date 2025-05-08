// src/jobs/schemas/job.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { JobStatus } from '../../common/enums/jobstatus.enum';

@Schema({ timestamps: true })
export class Job extends Document {
  @Prop({ required: true })
  companyName: string;

  @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
  companyId: Types.ObjectId;
  
  @Prop({ type: [Types.ObjectId], ref: 'Officer', default: [] })
  assignedOfficers: Types.ObjectId[];


  @Prop({ required: true })
  jobTitle: string;

  @Prop({ required: true })
  jobDescription: string;

  @Prop({ required: true })
  officersRequired: number;

  @Prop({ required: true })
  date: string; // e.g. '2025-05-20'

  @Prop({ required: true })
  startTime: string; // e.g. '08:00 AM'

  @Prop({ required: true })
  endTime: string; // e.g. '05:00 PM'

  @Prop({ required: true })
  jobLocation: string;

  @Prop({ required: false })
  hourlyRate?: number;

  @Prop({ required: false })
  status?: JobStatus;

  @Prop({ required: true })
dutyHours: number;
}

export const JobSchema = SchemaFactory.createForClass(Job);
