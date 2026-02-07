import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsObject,
  MinLength,
  MaxLength,
} from 'class-validator';
import { MemoryStatus } from '../enums';

export class UpdateMemoryDto {
  @ApiProperty({
    description: 'Memory title',
    example: 'Updated Meeting Notes',
    required: false,
    minLength: 1,
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  title?: string;

  @ApiProperty({
    description: 'Memory content',
    example: 'Updated content...',
    required: false,
    minLength: 1,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  content?: string;

  @ApiProperty({
    description: 'Memory status',
    enum: MemoryStatus,
    example: MemoryStatus.PROCESSED,
    required: false,
  })
  @IsOptional()
  @IsEnum(MemoryStatus)
  status?: MemoryStatus;

  @ApiProperty({
    description: 'Tags for categorization',
    example: ['work', 'meeting', 'updated'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({
    description: 'Additional metadata',
    required: false,
    type: Object,
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
