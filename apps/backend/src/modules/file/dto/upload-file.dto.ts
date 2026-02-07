import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { FileType } from '../enums';

export class UploadFileDto {
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
}
