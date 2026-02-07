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
import { MemoryType, MemoryStatus } from '../enums';

export class MemorySourceDto {
  @ApiProperty({ enum: ['file', 'note', 'chat', 'task', 'event', 'contact', 'bookmark'] })
  @IsString()
  type: 'file' | 'note' | 'chat' | 'task' | 'event' | 'contact' | 'bookmark';

  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  url?: string;
}

export class CreateMemoryDto {
  @ApiProperty({
    description: 'Memory title',
    example: 'Important Meeting Notes',
    minLength: 1,
    maxLength: 500,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  title: string;

  @ApiProperty({
    description: 'Memory content',
    example: 'Discussed project timeline and deliverables...',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  content: string;

  @ApiProperty({
    description: 'Memory type',
    enum: MemoryType,
    example: MemoryType.NOTE,
  })
  @IsEnum(MemoryType)
  type: MemoryType;

  @ApiProperty({
    description: 'Memory status',
    enum: MemoryStatus,
    example: MemoryStatus.DRAFT,
    required: false,
  })
  @IsOptional()
  @IsEnum(MemoryStatus)
  status?: MemoryStatus;

  @ApiProperty({
    description: 'Source reference',
    type: MemorySourceDto,
    required: false,
  })
  @IsOptional()
  @IsObject()
  source?: MemorySourceDto;

  @ApiProperty({
    description: 'Tags for categorization',
    example: ['work', 'meeting', 'important'],
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
