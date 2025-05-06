import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Industry } from './schemas/industry.schema';

@Injectable()
export class IndustryService {
  constructor(
    @InjectModel(Industry.name) private industryModel: Model<Industry>,
  ) {}

  private industryList: string[] = [
    'Information Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing',
    'Construction', 'Retail', 'Transportation & Logistics', 'Real Estate', 'Energy',
    'Telecommunications', 'Agriculture', 'Legal Services', 'Hospitality',
    'Entertainment & Media', 'Aerospace & Defense', 'Pharmaceuticals', 'Automotive',
    'Food & Beverage', 'Environmental Services', 'Nonprofit', 'Insurance',
    'Professional Services', 'Beauty & Personal Care', 'E-commerce'
  ];

  async seedIndustries(): Promise<{ message: string }> {
    const inserted: string[]  = [];

    for (const name of this.industryList) {
      const exists = await this.industryModel.findOne({ name });
      if (!exists) {
        await this.industryModel.create({ name });
        inserted.push(name);
      }
    }

    return {
      message: `${inserted.length} industries inserted.`,
    };
  }

  async getIndustries(): Promise<Industry[]> {
    return this.industryModel.find().sort({ name: 1 }).exec();
  }
}
