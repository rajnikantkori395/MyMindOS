import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional } from 'class-validator';

export class EmbeddingRequestDto {
  @ApiProperty({
    description: 'Text to generate embeddings for (string or array of strings)',
    oneOf: [
      { type: 'string' },
      { type: 'array', items: { type: 'string' } },
    ],
    example: 'This is a sample text for embedding',
  })
  @IsString()
  text: string | string[];

  @ApiProperty({
    description: 'Model to use for embedding',
    example: 'text-embedding-ada-002',
    required: false,
  })
  @IsOptional()
  @IsString()
  model?: string;
}
