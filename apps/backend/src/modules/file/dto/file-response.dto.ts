import { ApiProperty } from '@nestjs/swagger';
import { FileStatus, FileType } from '../enums';

export class ExtractionResultDto {
  @ApiProperty({ required: false })
  text?: string;

  @ApiProperty({ required: false, type: Object })
  metadata?: Record<string, any>;

  @ApiProperty({
    enum: ['pending', 'processing', 'completed', 'failed'],
  })
  status: 'pending' | 'processing' | 'completed' | 'failed';

  @ApiProperty({ required: false })
  error?: string;

  @ApiProperty({ required: false })
  processedAt?: Date;
}

export class FileResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  filename: string;

  @ApiProperty()
  mimeType: string;

  @ApiProperty()
  size: number;

  @ApiProperty({ required: false })
  checksum?: string;

  @ApiProperty()
  storageKey: string;

  @ApiProperty({ enum: ['s3', 'minio', 'local'] })
  storageProvider: 's3' | 'minio' | 'local';

  @ApiProperty({ required: false })
  url?: string;

  @ApiProperty({ required: false })
  thumbnailUrl?: string;

  @ApiProperty({ enum: FileType })
  type: FileType;

  @ApiProperty({ enum: FileStatus })
  status: FileStatus;

  @ApiProperty({ type: Object, required: false })
  metadata: Record<string, any>;

  @ApiProperty({ type: ExtractionResultDto, required: false })
  extractionResult?: ExtractionResultDto;

  @ApiProperty({ required: false })
  processedAt?: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
