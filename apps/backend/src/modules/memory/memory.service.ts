import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { MemoryRepository } from './repositories/memory.repository';
import { LoggerService } from '../../common/logger/logger.service';
import {
  CreateMemoryInput,
  UpdateMemoryInput,
  MemoryQueryFilters,
  PaginationOptions,
  PaginatedResponse,
  SemanticSearchOptions,
  HybridSearchOptions,
} from './types/memory.types';
import { Memory } from './schemas/memory.schema';
import { MemoryStatus } from './enums';
import { SEARCH_CONFIG, PAGINATION_DEFAULTS } from './constants/memory.constants';

@Injectable()
export class MemoryService {
  constructor(
    private readonly memoryRepository: MemoryRepository,
    private readonly logger: LoggerService,
  ) {}

  /**
   * Create a new memory
   */
  async create(
    userId: string,
    createInput: Omit<CreateMemoryInput, 'userId'>,
  ): Promise<Memory> {
    this.logger.log('Creating memory', 'MemoryService', {
      userId,
      type: createInput.type,
      title: createInput.title,
    });

    const memory = await this.memoryRepository.create({
      ...createInput,
      userId,
      status: createInput.status || MemoryStatus.DRAFT,
    });

    this.logger.business('memory_created', {
      memoryId: memory.id,
      userId,
      type: memory.type,
    });

    return memory;
  }

  /**
   * Get memory by ID
   */
  async findById(id: string, userId: string): Promise<Memory> {
    const memory = await this.memoryRepository.findById(id);
    if (!memory) {
      throw new NotFoundException('Memory not found');
    }

    if (memory.userId !== userId) {
      throw new ForbiddenException('Not authorized to access this memory');
    }

    return memory;
  }

  /**
   * Update memory
   */
  async update(
    id: string,
    userId: string,
    updateInput: UpdateMemoryInput,
  ): Promise<Memory> {
    const memory = await this.findById(id, userId);

    const updated = await this.memoryRepository.updateById(id, updateInput);
    if (!updated) {
      throw new NotFoundException('Memory not found');
    }

    this.logger.log('Memory updated', 'MemoryService', {
      memoryId: id,
      userId,
    });

    return updated;
  }

  /**
   * Delete memory (soft delete)
   */
  async delete(id: string, userId: string): Promise<void> {
    await this.findById(id, userId); // Verify ownership
    await this.memoryRepository.deleteById(id);

    this.logger.log('Memory deleted', 'MemoryService', {
      memoryId: id,
      userId,
    });
  }

  /**
   * Get all memories with pagination
   */
  async findAll(
    userId: string,
    filters: MemoryQueryFilters = {},
    pagination: PaginationOptions = {
      page: PAGINATION_DEFAULTS.PAGE,
      limit: PAGINATION_DEFAULTS.LIMIT,
    },
  ): Promise<PaginatedResponse<Memory>> {
    return this.memoryRepository.findMany(
      { ...filters, userId },
      pagination,
    );
  }

  /**
   * Text search in memories
   */
  async textSearch(
    userId: string,
    query: string,
    limit: number = SEARCH_CONFIG.DEFAULT_LIMIT,
    filters: MemoryQueryFilters = {},
  ): Promise<Memory[]> {
    if (!query || query.trim().length === 0) {
      throw new BadRequestException('Search query is required');
    }

    return this.memoryRepository.textSearch(query, {
      ...filters,
      userId,
    }, limit);
  }

  /**
   * Semantic search (vector similarity)
   * Note: This is a placeholder. Actual implementation requires AI Engine integration
   */
  async semanticSearch(
    userId: string,
    options: SemanticSearchOptions,
  ): Promise<Memory[]> {
    this.logger.log('Semantic search requested', 'MemoryService', {
      userId,
      query: options.query,
    });

    // TODO: Integrate with AI Engine module for vector search
    // For now, fallback to text search
    this.logger.warn(
      'Semantic search not yet implemented, falling back to text search',
      'MemoryService',
    );

    return this.textSearch(
      userId,
      options.query,
      options.limit || SEARCH_CONFIG.DEFAULT_LIMIT,
      options.filters,
    );
  }

  /**
   * Hybrid search (keyword + semantic)
   * Note: This is a placeholder. Actual implementation requires AI Engine integration
   */
  async hybridSearch(
    userId: string,
    options: HybridSearchOptions,
  ): Promise<Memory[]> {
    this.logger.log('Hybrid search requested', 'MemoryService', {
      userId,
      query: options.query,
    });

    // TODO: Integrate with AI Engine module for hybrid search
    // For now, fallback to text search
    this.logger.warn(
      'Hybrid search not yet implemented, falling back to text search',
      'MemoryService',
    );

    return this.textSearch(
      userId,
      options.query,
      options.limit || SEARCH_CONFIG.DEFAULT_LIMIT,
      options.filters,
    );
  }

  /**
   * Get related memories
   */
  async getRelated(
    id: string,
    userId: string,
    limit: number = 10,
  ): Promise<Memory[]> {
    await this.findById(id, userId); // Verify ownership
    return this.memoryRepository.findRelated(id, limit);
  }

  /**
   * Get memories by tags
   */
  async findByTags(
    userId: string,
    tags: string[],
    limit: number = 10,
  ): Promise<Memory[]> {
    return this.memoryRepository.findByTags(userId, tags, limit);
  }

  /**
   * Get memories by source
   */
  async findBySource(
    userId: string,
    sourceType: string,
    sourceId: string,
  ): Promise<Memory[]> {
    return this.memoryRepository.findBySource(userId, sourceType, sourceId);
  }

  /**
   * Link two memories
   */
  async linkMemories(
    sourceId: string,
    targetId: string,
    userId: string,
    relationship: 'related' | 'parent' | 'child' | 'reference' | 'similar' = 'related',
    strength?: number,
  ): Promise<Memory> {
    const sourceMemory = await this.findById(sourceId, userId);
    const targetMemory = await this.findById(targetId, userId);

    // Check if link already exists
    const existingLink = sourceMemory.links?.find(
      (link) => link.targetMemoryId === targetId,
    );

    if (existingLink) {
      throw new BadRequestException('Memory link already exists');
    }

    // Add link to source memory
    const links = sourceMemory.links || [];
    links.push({
      targetMemoryId: targetId,
      relationship,
      strength,
      createdAt: new Date(),
    });

    const updated = await this.memoryRepository.updateById(sourceId, {
      links,
    });

    if (!updated) {
      throw new NotFoundException('Memory not found');
    }

    this.logger.log('Memories linked', 'MemoryService', {
      sourceId,
      targetId,
      relationship,
      userId,
    });

    return updated;
  }
}
