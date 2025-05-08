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
import { Officer } from '../officer/schemas/officer.schema';

@Injectable()
export class JobService {
  constructor(
    @InjectModel(Job.name) private jobModel: Model<Job>,
    @InjectModel(Company.name) private companyModel: Model<Company>,
    @InjectModel(Officer.name) private officerModel: Model<Officer>,
  ) {}

  // async createJob(dto: CreateJobDto): Promise<Job> {
  //   // Check if companyId is present
  //   if (!dto.companyId) {
  //     throw new BadRequestException('companyId is required');
  //   }

  //   // Fetch company details using companyId
  //   const company = await this.companyModel.findById(dto.companyId).exec();
  //   if (!company) {
  //     throw new NotFoundException('Company not found');
  //   }

  //   // Determine job status
  //   const status = dto.isAdmin ? JobStatus.OPEN : JobStatus.PENDING_PRICING;
  //   const hourlyRate = dto.isAdmin ? dto.hourlyRate : 0; // Set default value if hourlyRate is not provided
  //   // Use provided companyName or fallback to company's name from DB
  //   const companyName = dto.companyName || company.companyName;

  //   const job = new this.jobModel({
  //     ...dto,
  //     companyName,
  //     status,
  //     hourlyRate,
  //   });

  //   return job.save();
  // }

  // async createJob(dto: CreateJobDto): Promise<Job> {
  //   // 1) Ensure company exists
  //   const company = await this.companyModel.findById(dto.companyId).exec();
  //   if (!company) {
  //     throw new NotFoundException(`Company with ID ${dto.companyId} not found`);
  //   }

  //   // 2) Runtime‐safe check: jobDate not before today
  //   const today = new Date();
  //   today.setHours(0, 0, 0, 0);
  //   const jobDate = new Date(dto.jobDate);
  //   jobDate.setHours(0, 0, 0, 0);
  //   if (jobDate < today) {
  //     throw new BadRequestException('jobDate must not be in the past');
  //   }

  //   // 3) Runtime‐safe time checks
  //   const [sh, sm] = dto.startTime.split(':').map((v) => parseInt(v, 10));
  //   const [eh, em] = dto.endTime.split(':').map((v) => parseInt(v, 10));
  //   const startMinutes = sh * 60 + sm;
  //   const endMinutes = eh * 60 + em;
  //   if (endMinutes <= startMinutes) {
  //     throw new BadRequestException('endTime must be later than startTime');
  //   }

  //   // 4) Determine status and hourlyRate
  //   const status = dto.isAdmin ? JobStatus.OPEN : JobStatus.PENDING_PRICING;
  //   const hourlyRate = dto.isAdmin && dto.hourlyRate ? dto.hourlyRate : 0;
  //   const companyName = dto.companyName || company.companyName;

  //   // 5) Build & save
  //   const job = new this.jobModel({
  //     companyId: dto.companyId,
  //     companyName,
  //     jobTitle: dto.jobTitle,
  //     jobDescription: dto.jobDescription,
  //     officersRequired: dto.officersRequired,
  //     date: dto.jobDate,
  //     startTime: dto.startTime,
  //     endTime: dto.endTime,
  //     jobLocation: dto.jobLocation,
  //     hourlyRate,
  //     status,
  //   });

  //   return job.save();
  // }

  private timeToMinutes = (t: string) => {
    const [time, modifier] = t.split(' ');
    let h;
    const m = time.split(':').map(v => parseInt(v, 10))[1];
    h = time.split(':').map(v => parseInt(v, 10))[0];
    if (modifier === 'PM' && h < 12) h += 12;
    if (modifier === 'AM' && h === 12) h = 0;
    return h * 60 + m;
  };
  // src/jobs/jobs.service.ts
  async createJob(dto: CreateJobDto): Promise<Job> {
    // 1) Ensure company exists
    const company = await this.companyModel.findById(dto.companyId).exec();
    if (!company) {
      throw new NotFoundException(`Company with ID ${dto.companyId.toString()} not found`);
    }

    // 2) Date check (no past dates)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const jobDate = new Date(dto.jobDate);
    jobDate.setHours(0, 0, 0, 0);
    if (jobDate < today) {
      throw new BadRequestException('jobDate must not be in the past');
    }

    // 3) Time parsing & validation
    const startMin = this.timeToMinutes(dto.startTime);
    const endMin   = this.timeToMinutes(dto.endTime);
    if (endMin <= startMin) {
      throw new BadRequestException('endTime must be later than startTime');
    }

    // 4) Duty‐hours calculation (decimal rounded to 2 digits)
    const diff = endMin - startMin;
    const decimalHours = Math.round((diff / 60) * 100) / 100; 
    // e.g. 240min→4.00, 255→4.25, 270→4.5, 285→4.75

    // 5) Status & rate logic
    const status     = dto.isAdmin ? JobStatus.OPEN : JobStatus.PENDING_PRICING;
    const hourlyRate = dto.isAdmin && dto.hourlyRate ? dto.hourlyRate : 0;
    const companyName = dto.companyName || company.companyName;

    // 6) Build & persist
    const job = new this.jobModel({
      companyId: dto.companyId,
      companyName,
      jobTitle: dto.jobTitle,
      jobDescription: dto.jobDescription,
      officersRequired: dto.officersRequired,
      date: dto.jobDate,
      startTime: dto.startTime,
      endTime: dto.endTime,
      jobLocation: dto.jobLocation,
      hourlyRate,
      status,
      dutyHours: decimalHours,
    });

    return job.save();
  }


  // async updateJob(id: string, dto: UpdateJobDto): Promise<Job> {
  //   const job = await this.jobModel.findByIdAndUpdate(id, dto, { new: true });
  //   if (!job) throw new NotFoundException('Job not found');
  //   return job;
  // }

async updateJob(id: string, dto: UpdateJobDto): Promise<Job> {
  // 1) Fetch existing job
  const job = await this.jobModel.findById(id).exec();
  if (!job) {
    throw new NotFoundException(`Job with ID ${id} not found`);
  }

  // 2) If jobDate provided, ensure not in past
  if (dto.jobDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const updatedDate = new Date(dto.jobDate);
    updatedDate.setHours(0, 0, 0, 0);
    if (updatedDate < today) {
      throw new BadRequestException('jobDate must not be in the past');
    }
    job.date = dto.jobDate;
  }

  // 3) If startTime or endTime provided, validate and recalc dutyHours
  const timeToMinutes = (t: string) => {
    const [time, modifier] = t.split(' ');
    let h;
    const m = time.split(':').map(v => parseInt(v, 10))[1];
    h = time.split(':').map(v => parseInt(v, 10))[0];
    if (modifier === 'PM' && h < 12) h += 12;
    if (modifier === 'AM' && h === 12) h = 0;
    return h * 60 + m;
  };

  let startMin = timeToMinutes(job.startTime);
  let endMin = timeToMinutes(job.endTime);

  if (dto.startTime) {
    job.startTime = dto.startTime;
    startMin = timeToMinutes(dto.startTime);
  }
  if (dto.endTime) {
    job.endTime = dto.endTime;
    endMin = timeToMinutes(dto.endTime);
  }

  if (dto.startTime || dto.endTime) {
    if (endMin <= startMin) {
      throw new BadRequestException('endTime must be later than startTime');
    }
    const diff = endMin - startMin;
    job.dutyHours = Math.round((diff / 60) * 100) / 100;
  }

  // 4) Update other fields if provided
  if (dto.companyName)      job.companyName      = dto.companyName;
  if (dto.jobTitle)         job.jobTitle         = dto.jobTitle;
  if (dto.jobDescription)   job.jobDescription   = dto.jobDescription;
  if (dto.officersRequired) job.officersRequired = dto.officersRequired;
  if (dto.jobLocation)      job.jobLocation      = dto.jobLocation;
  if (dto.hourlyRate !== undefined) job.hourlyRate = dto.hourlyRate;
  if (dto.isAdmin !== undefined) {
    job.status = dto.isAdmin ? JobStatus.OPEN : JobStatus.PENDING_PRICING;
  }

  // 5) Persist changes
  return job.save();
}

  // async getAllJobs(
  //   page: number,
  //   limit: number,
  //   search: string,
  //   status?: string,
  //   startDate?: string,
  //   endDate?: string,
  // ): Promise<{
  //   data: Job[];
  //   totalData: number;
  //   totalPages: number;
  //   currentPage: number;
  //   limit: number;
  // }> {
  //   const skip = (page - 1) * limit;

  //   const filter: any = {};

  //   if (search) {
  //     filter.$or = [
  //       { companyName: { $regex: search, $options: 'i' } },
  //       { jobTitle: { $regex: search, $options: 'i' } },
  //       { jobDescription: { $regex: search, $options: 'i' } },
  //     ];
  //   }

  //   if (status) {
  //     filter.status = status;
  //   }

  //   if (startDate && endDate) {
  //     filter.date = {
  //       $gte: new Date(startDate),
  //       $lte: new Date(endDate),
  //     };
  //   }

  //   const totalData = await this.jobModel.countDocuments(filter);
  //   const jobs = await this.jobModel
  //     .find(filter)
  //     .sort({ createdAt: -1 })
  //     .skip(skip)
  //     .limit(limit)
  //     .exec();

  //   const totalPages = Math.ceil(totalData / limit);

  //   return {
  //     data: jobs,
  //     totalData,
  //     totalPages,
  //     currentPage: page,
  //     limit,
  //   };
  // }

  async getAllJobs(
    page: number,
    limit: number,
    search: string,
    status?: string,
    startDate?: string,
    endDate?: string,
    dutyHours?: number,
    minHourlyRate?: number,
    maxHourlyRate?: number,
  ): Promise<{
    data: Job[];
    totalData: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  }> {
    const skip = (page - 1) * limit;
  
    const filter: any = {};
    console.log("==>",startDate,endDate)
    // Text search
    if (search) {
      filter.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { jobTitle: { $regex: search, $options: 'i' } },
        { jobDescription: { $regex: search, $options: 'i' } },
      ];
    }
  
    // Status filter
    if (status) {
      filter.status = status;
    }
  
    // Date range filter (date stored as ISO string like '2025-05-08')
    if (startDate && endDate) {
      filter.date = {
        $gte: startDate,
        $lte: endDate,
      };
    }
    console.log("==>",filter.date)
    // Duty hours: less than provided number
    if (dutyHours !== undefined) {
      filter.dutyHours = { $lt: dutyHours };
    }
  
    // Hourly rate filter
    if (minHourlyRate !== undefined || maxHourlyRate !== undefined) {
      filter.hourlyRate = {};
      if (minHourlyRate !== undefined) filter.hourlyRate.$gte = minHourlyRate;
      if (maxHourlyRate !== undefined) filter.hourlyRate.$lte = maxHourlyRate;
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
    if (!job) throw new BadRequestException('Job not found');
  
    const officerObjectId = new Types.ObjectId(officerId);
  
    const officer = await this.officerModel.findById(officerId);
    if (!officer) {
      throw new BadRequestException('Officer not found');
    }
  
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
