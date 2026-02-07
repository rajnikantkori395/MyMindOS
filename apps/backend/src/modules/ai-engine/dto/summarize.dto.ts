import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class SummarizeRequestDto {
  @ApiProperty({
    description: 'Text to summarize',
    example: 'Long text content that needs to be summarized...',
  })
  @IsString()
  text: string;

  @ApiProperty({
    description: 'Maximum length of summary',
    example: 200,
    required: false,
    minimum: 50,
  })
  @IsOptional()
  @IsNumber()
  @Min(50)
  maxLength?: number;
}
