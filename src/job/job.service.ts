// src/jobs/job.service.ts

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Job } from './schemas/job.schema';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobStatus } from '../common/enums/jobstatus.enum';
import { Company } from '../company/schemas/company.schema';
import { SetPricingDto } from './dto/set-pricing.dto';

@Injectable()
export class JobService {
  constructor(
    @InjectModel(Job.name) private jobModel: Model<Job>,
    @InjectModel(Company.name) private companyModel: Model<Company>,
  ) {}

  async createJob(dto: CreateJobDto): Promise<Job> {
    // Check if companyId is present
    if (!dto.companyId) {
      throw new BadRequestException('companyId is required');
    }

    // Fetch company details using companyId
    const company = await this.companyModel.findById(dto.companyId).exec();
    if (!company) {
      throw new NotFoundException('Company not found');
    }

    // Determine job status
    const status = dto.isAdmin ? JobStatus.OPEN : JobStatus.PENDING_PRICING;
    const hourlyRate = dto.isAdmin ? dto.hourlyRate : 0; // Set default value if hourlyRate is not provided
    // Use provided companyName or fallback to company's name from DB
    const companyName = dto.companyName || company.companyName;

    const job = new this.jobModel({
      ...dto,
      companyName,
      status,
      hourlyRate,
    });

    return job.save();
  }

  async updateJob(id: string, dto: UpdateJobDto): Promise<Job> {
    const job = await this.jobModel.findByIdAndUpdate(id, dto, { new: true });
    if (!job) throw new NotFoundException('Job not found');
    return job;
  }

  async getAllJobs(
    page: number,
    limit: number,
    search: string,
    status?: string,
    startDate?: string,
    endDate?: string,
  ): Promise<{
    data: Job[];
    totalData: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  }> {
    const skip = (page - 1) * limit;

    const filter: any = {};

    if (search) {
      filter.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { jobTitle: { $regex: search, $options: 'i' } },
        { jobDescription: { $regex: search, $options: 'i' } },
      ];
    }

    if (status) {
      filter.status = status;
    }

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const totalData = await this.jobModel.countDocuments(filter);
    const jobs = await this.jobModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const totalPages = Math.ceil(totalData / limit);

    return {
      data: jobs,
      totalData,
      totalPages,
      currentPage: page,
      limit,
    };
  }

  async getJobById(id: string): Promise<Job> {
    const job = await this.jobModel.findById(id);
    if (!job) throw new NotFoundException('Job not found');
    return job;
  }
  // job.service.ts
  async getJobsByCompanyId(companyId: string): Promise<Job[]> {
    if (!companyId) {
      throw new BadRequestException('Company ID is required');
    }

    const jobs = await this.jobModel
      .find({ companyId })
      .sort({ createdAt: -1 })
      .exec();

    if (!jobs || jobs.length === 0) {
      throw new NotFoundException('No jobs found for this company');
    }

    return jobs;
  }

  async deleteJob(id: string): Promise<void> {
    const result = await this.jobModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Job not found');
  }

  async setPricing(id: string, setPricingDto: SetPricingDto): Promise<Job> {
    const job = await this.jobModel.findById(id);
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    job.hourlyRate = setPricingDto.hourlyRate;
    job.status = JobStatus.OPEN; // Set status to OPEN when pricing is set
    return job.save();
  }

  async changeStatus(id: string, status: JobStatus): Promise<Job> {
    const job = await this.jobModel.findById(id);
    if (!job) throw new NotFoundException('Job not found');
    job.status = status;
    return job.save();
  }

  async applyForJob(jobId: string, officerId: string): Promise<Job> {
    const job = await this.jobModel.findById(jobId);
    if (!job) throw new NotFoundException('Job not found');
  
    const officerObjectId = new Types.ObjectId(officerId);
  
    // Check if already assigned - using toString() for comparison
    if (job.assignedOfficers.some((id) => id.toString() === officerObjectId.toString())) {
      throw new BadRequestException('Officer already applied for this job');
    }
  
    // Check if positions are already full
    if (job.assignedOfficers.length >= job.officersRequired) {
      throw new BadRequestException(
        'All positions for this job are already filled',
      );
    }
  
    job.assignedOfficers.push(officerObjectId);
  
    // If filled after this assignment, update status to CLOSED
    if (job.assignedOfficers.length === job.officersRequired) {
      job.status = JobStatus.CLOSED;
    }
  
    return job.save();
  }

  async getJobsByOfficerId(
    officerId: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Promise<{ data: Job[]; total: number; totalPages: number; currentPage: number }> {
    const objectId = new Types.ObjectId(officerId);
    const skip = (page - 1) * limit;

    const filter: any = {
      assignedOfficers: objectId,
    };

    if (search) {
      filter.jobTitle = { $regex: search, $options: 'i' };
    }

    const [data, total] = await Promise.all([
      this.jobModel.find(filter).skip(skip).limit(limit).exec(),
      this.jobModel.countDocuments(filter),
    ]);
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      totalPages,
      currentPage: page,
    };
  }
}
