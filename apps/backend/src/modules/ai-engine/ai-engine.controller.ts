import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AiEngineService } from './ai-engine.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  EmbeddingRequestDto,
  ChatRequestDto,
  SummarizeRequestDto,
} from './dto';
import type {
  EmbeddingResponse,
  ChatResponse,
  SummarizeResponse,
} from './types/ai.types';
import { LoggerService } from '../../common/logger/logger.service';

@ApiTags('AI Engine')
@Controller('ai')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class AiEngineController {
  constructor(
    private readonly aiEngineService: AiEngineService,
    private readonly logger: LoggerService,
  ) {}

  @Post('embedding')
  @ApiOperation({
    summary: 'Generate embeddings',
    description: 'Generate vector embeddings for text',
  })
  @ApiResponse({
    status: 200,
    description: 'Embeddings generated successfully',
    type: Object,
  })
  async generateEmbedding(
    @Body() request: EmbeddingRequestDto,
  ): Promise<EmbeddingResponse> {
    return this.aiEngineService.generateEmbedding(request);
  }

  @Post('chat')
  @ApiOperation({
    summary: 'Chat completion',
    description: 'Generate chat completion using AI',
  })
  @ApiResponse({
    status: 200,
    description: 'Chat response generated',
    type: Object,
  })
  async chat(@Body() request: ChatRequestDto): Promise<ChatResponse> {
    return this.aiEngineService.chat(request);
  }

  @Post('summarize')
  @ApiOperation({
    summary: 'Summarize text',
    description: 'Generate summary and key points from text',
  })
  @ApiResponse({
    status: 200,
    description: 'Summary generated successfully',
    type: Object,
  })
  async summarize(
    @Body() request: SummarizeRequestDto,
  ): Promise<SummarizeResponse> {
    return this.aiEngineService.summarize(request);
  }
}
