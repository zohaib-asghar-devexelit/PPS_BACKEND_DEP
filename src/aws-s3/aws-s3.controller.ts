import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    BadRequestException,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { AwsS3Service } from './aws-s3.service';
  import { ApiOperation, ApiConsumes, ApiBody,ApiProperty } from '@nestjs/swagger';
  import { IsString, IsOptional } from 'class-validator';
  
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
  
  class FileUploadDto {
    @IsString()
    @IsOptional()
    @ApiProperty()
    file?: string; // You can add extra fields for more details, if required
  }

  @Controller('upload')
  export class AwsS3Controller {
    constructor(private readonly awsS3Service: AwsS3Service) {}
  
    @Post('uploadFile')
    @ApiOperation({ summary: 'Upload a file to AWS S3' })
    @ApiConsumes('multipart/form-data') // Describes that this endpoint expects form-data
    @ApiBody({
      description: 'The file to upload. Only JPG, PNG, JPEG, and PDF files are allowed.',
      type: FileUploadDto,
    })
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