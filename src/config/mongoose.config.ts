import { MongooseModuleOptions } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

export const mongooseConfig: MongooseModuleOptions = {
  uri: process.env.MONGO_URI || 'mongodb+srv://mzohaib0677:KcPAAXmFtfJqEAUA@cluster0.0hgzd.mongodb.net/PPS?retryWrites=true&w=majority&appName=Cluster0', // Temporary MongoDB connection string
};
