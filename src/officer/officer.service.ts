import { Injectable, NotFoundException  } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Officer } from './schemas/officer.schema';
import { RegisterOfficerDto } from './dto/register-officer.dto';
import { MailService } from '../common/mailer/mailer.service';

@Injectable()
export class OfficerService {
  constructor(
    @InjectModel(Officer.name) private officerModel: Model<Officer>,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailService,
  ) {}

  // Get all officers
  async getAllOfficers(): Promise<Officer[]> {
    return this.officerModel.find().exec();
  }

  async getOfficerById(id: string): Promise<Officer> {
    const officer = await this.officerModel.findById(id).exec();
    if (!officer) {
      throw new NotFoundException('Officer not found');
    }
    return officer;
  }

  // Update officer by ID
  async updateOfficer(id: string, updateData: Partial<RegisterOfficerDto>): Promise<Officer> {
    if (updateData.password || updateData.confirmPassword) {
      if (updateData.password !== updateData.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedOfficer = await this.officerModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedOfficer) {
      throw new NotFoundException('Officer not found');
    }

    return updatedOfficer;
  }

  // Delete officer by ID
  async deleteOfficer(id: string): Promise<{ message: string }> {
    const result = await this.officerModel.findByIdAndDelete(id);

    if (!result) {
      throw new NotFoundException('Officer not found');
    }

    return { message: 'Officer deleted successfully' };
  }
}
