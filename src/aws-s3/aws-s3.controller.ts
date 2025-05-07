import {
    Controller,
    Post,
    UploadedFiles,
    UseInterceptors,
    BadRequestException,
  } from '@nestjs/common';
  import {
    FilesInterceptor,
  } from '@nestjs/platform-express';
  import { AwsS3Service } from './aws-s3.service';
  import { ApiOperation, ApiConsumes, ApiBody, ApiProperty } from '@nestjs/swagger';
  import { diskStorage } from 'multer';
  import { IsOptional, IsString } from 'class-validator';
  import { memoryStorage } from 'multer';
  
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
    @ApiProperty({ type: 'string', format: 'binary' })
    file: any;
  }
  
  @Controller('upload')
  export class AwsS3Controller {
    constructor(private readonly awsS3Service: AwsS3Service) {}
  
    @Post('uploadFile')
    @ApiOperation({ summary: 'Upload up to two files (JPG, JPEG, PNG, PDF). Max file size: 5MB' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'array',
            items: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      },
    })
    @UseInterceptors(
      FilesInterceptor('file', 5, {
        storage: memoryStorage(),
        limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
      }),
    )
    async uploadFile(@UploadedFiles() files: MulterFile[]) {
      if (!files || files.length === 0) {
        throw new BadRequestException('At least one file is required');
      }
  
      if (files.length > 5) {
        throw new BadRequestException('Maximum two files are allowed');
      }
  
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
  
      for (const file of files) {
        if (!allowedMimeTypes.includes(file.mimetype)) {
          throw new BadRequestException('Only JPG, JPEG, PNG and PDF files are allowed');
        }
        if (file.size > 5 * 1024 * 1024) {
          throw new BadRequestException('Each file must be 5MB or smaller');
        }
      }
  
      const uploadedUrls = await Promise.all(
        files.map(file => this.awsS3Service.uploadFile(file)),
      );
  
      return { urls: uploadedUrls };
    }
  }
  