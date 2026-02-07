import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '../../common/logger/logger.service';
import {
  EmbeddingRequest,
  EmbeddingResponse,
  ChatRequest,
  ChatResponse,
  SummarizeRequest,
  SummarizeResponse,
} from './types/ai.types';
import { AIProvider } from './enums';

@Injectable()
export class AiEngineService {
  private defaultProvider: AIProvider;
  private openaiApiKey?: string;
  private anthropicApiKey?: string;
  private ollamaBaseUrl?: string;

  constructor(
    private configService: ConfigService,
    private logger: LoggerService,
  ) {
    this.defaultProvider =
      (this.configService.get<string>('ai.defaultProvider') as AIProvider) ||
      AIProvider.OPENAI;
    this.openaiApiKey = this.configService.get<string>('ai.openai.apiKey');
    this.anthropicApiKey = this.configService.get<string>('ai.anthropic.apiKey');
    this.ollamaBaseUrl =
      this.configService.get<string>('ai.ollama.baseUrl') ||
      'http://localhost:11434';
  }

  /**
   * Generate embeddings for text
   */
  async generateEmbedding(
    request: EmbeddingRequest,
  ): Promise<EmbeddingResponse> {
    this.logger.log('Generating embedding', 'AiEngineService', {
      provider: this.defaultProvider,
      textLength: Array.isArray(request.text)
        ? request.text.length
        : request.text.length,
    });

    // TODO: Implement actual embedding generation
    // For now, return placeholder
    const text = Array.isArray(request.text) ? request.text[0] : request.text;
    const dimensions = 1536; // OpenAI ada-002 dimensions

    // Placeholder: Generate random embeddings (in production, call OpenAI/Anthropic API)
    const embeddings = Array.isArray(request.text)
      ? request.text.map(() => this.generatePlaceholderEmbedding(dimensions))
      : [this.generatePlaceholderEmbedding(dimensions)];

    this.logger.warn(
      'Using placeholder embeddings - AI provider not configured',
      'AiEngineService',
    );

    return {
      embeddings,
      model: request.model || 'text-embedding-ada-002',
      dimensions,
    };
  }

  /**
   * Chat completion
   */
  async chat(request: ChatRequest): Promise<ChatResponse> {
    this.logger.log('Chat completion request', 'AiEngineService', {
      provider: this.defaultProvider,
      messageCount: request.messages.length,
    });

    // TODO: Implement actual chat completion
    // For now, return placeholder response
    this.logger.warn(
      'Using placeholder chat response - AI provider not configured',
      'AiEngineService',
    );

    return {
      content:
        'AI chat functionality requires API key configuration. Please configure OPENAI_API_KEY or ANTHROPIC_API_KEY in your environment variables.',
      model: request.model || 'gpt-4',
      usage: {
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
      },
    };
  }

  /**
   * Summarize text
   */
  async summarize(request: SummarizeRequest): Promise<SummarizeResponse> {
    this.logger.log('Summarization request', 'AiEngineService', {
      textLength: request.text.length,
    });

    // TODO: Implement actual summarization
    // For now, return placeholder
    this.logger.warn(
      'Using placeholder summarization - AI provider not configured',
      'AiEngineService',
    );

    // Simple placeholder: take first 200 chars as summary
    const summary = request.text.substring(0, request.maxLength || 200);
    const sentences = request.text.split(/[.!?]+/).filter((s) => s.trim());
    const keyPoints = sentences.slice(0, 3).map((s) => s.trim());

    return {
      summary,
      keyPoints,
    };
  }

  /**
   * Generate placeholder embedding (for testing)
   */
  private generatePlaceholderEmbedding(dimensions: number): number[] {
    return Array.from({ length: dimensions }, () => Math.random() * 2 - 1);
  }
}
