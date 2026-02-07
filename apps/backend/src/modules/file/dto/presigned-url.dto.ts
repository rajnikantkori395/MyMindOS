import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import { FileType } from '../enums';

export class PresignedUrlDto {
  @ApiProperty({
    description: 'Original filename',
    example: 'document.pdf',
  })
  @IsString()
  filename: string;

  @ApiProperty({
    description: 'MIME type of the file',
    example: 'application/pdf',
  })
  @IsString()
  mimeType: string;

  @ApiProperty({
    description: 'File size in bytes',
    example: 1024000,
  })
  @IsString()
  size: string;

  @ApiProperty({
    description: 'File type',
    enum: FileType,
    example: FileType.DOCUMENT,
    required: false,
  })
  @IsOptional()
  @IsEnum(FileType)
  type?: FileType;

  @ApiProperty({
    description: 'URL expiration time in seconds (default: 3600)',
    example: 3600,
    required: false,
    minimum: 60,
    maximum: 86400,
  })
  @IsOptional()
  @IsNumber()
  @Min(60)
  @Max(86400)
  expiresIn?: number;
}
