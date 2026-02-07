import { ApiProperty } from '@nestjs/swagger';
import { MemoryType, MemoryStatus } from '../enums';

export class MemorySourceResponseDto {
  @ApiProperty()
  type: string;

  @ApiProperty()
  id: string;

  @ApiProperty({ required: false })
  url?: string;
}

export class MemoryEmbeddingResponseDto {
  @ApiProperty({ required: false })
  vectorId?: string;

  @ApiProperty({ required: false })
  model?: string;

  @ApiProperty({ required: false })
  dimensions?: number;

  @ApiProperty({ required: false })
  generatedAt?: Date;
}

export class MemoryInsightResponseDto {
  @ApiProperty({ required: false })
  summary?: string;

  @ApiProperty({ required: false, type: [String] })
  keyPoints?: string[];

  @ApiProperty({ required: false, type: [String] })
  tags?: string[];

  @ApiProperty({ required: false })
  category?: string;

  @ApiProperty({ required: false, type: [String] })
  relatedConcepts?: string[];

  @ApiProperty({ required: false })
  generatedAt?: Date;
}

export class MemoryLinkResponseDto {
  @ApiProperty()
  targetMemoryId: string;

  @ApiProperty({
    enum: ['related', 'parent', 'child', 'reference', 'similar'],
  })
  relationship: string;

  @ApiProperty({ required: false })
  strength?: number;

  @ApiProperty({ required: false })
  createdAt?: Date;
}

export class MemoryResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty({ enum: MemoryType })
  type: MemoryType;

  @ApiProperty({ enum: MemoryStatus })
  status: MemoryStatus;

  @ApiProperty({ type: MemorySourceResponseDto, required: false })
  source?: MemorySourceResponseDto;

  @ApiProperty({ type: [String] })
  tags: string[];

  @ApiProperty({ type: Object })
  metadata: Record<string, any>;

  @ApiProperty({ type: MemoryEmbeddingResponseDto, required: false })
  embedding?: MemoryEmbeddingResponseDto;

  @ApiProperty({ type: MemoryInsightResponseDto, required: false })
  insight?: MemoryInsightResponseDto;

  @ApiProperty({ type: [MemoryLinkResponseDto] })
  links: MemoryLinkResponseDto[];

  @ApiProperty({ required: false })
  processedAt?: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
