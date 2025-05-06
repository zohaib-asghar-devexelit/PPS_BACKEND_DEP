import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    BadRequestException,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { AwsS3Service } from './aws-s3.service';
  
  // Define a custom interface for the file
  interface MulterFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    buffer: Buffer;
    destination?: string;
    filename?: string;
    path?: string;
  }
  
  @Controller('upload')
  export class AwsS3Controller {
    constructor(private readonly awsS3Service: AwsS3Service) {}
  
    @Post('uploadFile')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: MulterFile) {
      // Check if file exists
      if (!file) {
        throw new BadRequestException('File is required');
      }
      
      // Validate file type
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException('Only JPG, JPEG, PNG and PDF files are allowed');
      }
      
      const url = await this.awsS3Service.uploadFile(file);
      return { url };
    }
  }