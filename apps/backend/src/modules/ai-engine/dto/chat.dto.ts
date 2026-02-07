import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ChatMessageDto {
  @ApiProperty({
    enum: ['system', 'user', 'assistant'],
    example: 'user',
  })
  @IsEnum(['system', 'user', 'assistant'])
  role: 'system' | 'user' | 'assistant';

  @ApiProperty({
    example: 'Hello, how are you?',
  })
  @IsString()
  content: string;
}

export class ChatRequestDto {
  @ApiProperty({
    description: 'Array of chat messages',
    type: [ChatMessageDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChatMessageDto)
  messages: ChatMessageDto[];

  @ApiProperty({
    description: 'Model to use',
    example: 'gpt-4',
    required: false,
  })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiProperty({
    description: 'Temperature (0-2)',
    example: 0.7,
    required: false,
    minimum: 0,
    maximum: 2,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(2)
  temperature?: number;

  @ApiProperty({
    description: 'Maximum tokens',
    example: 1000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxTokens?: number;
}
