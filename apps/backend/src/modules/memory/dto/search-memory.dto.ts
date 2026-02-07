import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsArray,
  Min,
  Max,
} from 'class-validator';
import { MemoryType, MemoryStatus } from '../enums';
import { SEARCH_CONFIG } from '../constants/memory.constants';

export class SearchMemoryDto {
  @ApiProperty({
    description: 'Search query text',
    example: 'project timeline',
  })
  @IsString()
  query: string;

  @ApiProperty({
    description: 'Maximum number of results',
    example: 10,
    required: false,
    minimum: 1,
    maximum: SEARCH_CONFIG.MAX_LIMIT,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(SEARCH_CONFIG.MAX_LIMIT)
  limit?: number;

  @ApiProperty({
    description: 'Similarity threshold (0-1)',
    example: 0.7,
    required: false,
    minimum: 0,
    maximum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  similarityThreshold?: number;

  @ApiProperty({
    description: 'Filter by memory type',
    enum: MemoryType,
    required: false,
  })
  @IsOptional()
  @IsEnum(MemoryType)
  type?: MemoryType;

  @ApiProperty({
    description: 'Filter by memory status',
    enum: MemoryStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(MemoryStatus)
  status?: MemoryStatus;

  @ApiProperty({
    description: 'Filter by tags',
    example: ['work', 'important'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class HybridSearchMemoryDto extends SearchMemoryDto {
  @ApiProperty({
    description: 'Weight for keyword search (0-1)',
    example: 0.5,
    required: false,
    minimum: 0,
    maximum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  keywordWeight?: number;

  @ApiProperty({
    description: 'Weight for semantic search (0-1)',
    example: 0.5,
    required: false,
    minimum: 0,
    maximum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  semanticWeight?: number;
}
