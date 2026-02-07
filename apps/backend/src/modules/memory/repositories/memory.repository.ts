import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { Memory } from '../schemas/memory.schema';
import {
  CreateMemoryInput,
  UpdateMemoryInput,
  MemoryQueryFilters,
  PaginationOptions,
  PaginatedResponse,
} from '../types/memory.types';
import { PAGINATION_DEFAULTS } from '../constants/memory.constants';

/**
 * Memory Repository
 * Handles all database operations for Memory entity
 */
@Injectable()
export class MemoryRepository {
  constructor(
    @InjectModel(Memory.name) private readonly memoryModel: Model<Memory>,
  ) {}

  /**
   * Create a new memory
   */
  async create(createInput: CreateMemoryInput): Promise<Memory> {
    const memory = new this.memoryModel(createInput);
    return memory.save();
  }

  /**
   * Find memory by ID
   */
  async findById(id: string): Promise<Memory | null> {
    return this.memoryModel.findById(id).exec();
  }

  /**
   * Update memory by ID
   */
  async updateById(
    id: string,
    updateInput: UpdateMemoryInput,
  ): Promise<Memory | null> {
    return this.memoryModel
      .findByIdAndUpdate(id, updateInput, { new: true })
      .exec();
  }

  /**
   * Delete memory by ID (soft delete)
   */
  async deleteById(id: string): Promise<Memory | null> {
    return this.memoryModel
      .findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true })
      .exec();
  }

  /**
   * Find memories with filters and pagination
   */
  async findMany(
    filters: MemoryQueryFilters = {},
    pagination: PaginationOptions = {
      page: PAGINATION_DEFAULTS.PAGE,
      limit: PAGINATION_DEFAULTS.LIMIT,
    },
  ): Promise<PaginatedResponse<Memory>> {
    const query: FilterQuery<Memory> = {
      deletedAt: null, // Exclude soft-deleted memories
    };

    if (filters.userId) {
      query.userId = filters.userId;
    }
    if (filters.type) {
      query.type = filters.type;
    }
    if (filters.status) {
      query.status = filters.status;
    }
    if (filters.tags && filters.tags.length > 0) {
      query.tags = { $in: filters.tags };
    }
    if (filters.sourceType) {
      query['source.type'] = filters.sourceType;
    }
    if (filters.sourceId) {
      query['source.id'] = filters.sourceId;
    }
    if (filters.dateFrom || filters.dateTo) {
      query.createdAt = {};
      if (filters.dateFrom) {
        query.createdAt.$gte = filters.dateFrom;
      }
      if (filters.dateTo) {
        query.createdAt.$lte = filters.dateTo;
      }
    }
    if (filters.search) {
      query.$text = { $search: filters.search };
    }

    const skip = (pagination.page - 1) * pagination.limit;
    const limit = Math.min(pagination.limit, PAGINATION_DEFAULTS.MAX_LIMIT);

    const sort: any = filters.search
      ? { score: { $meta: 'textScore' } }
      : { createdAt: -1 };

    const [data, total] = await Promise.all([
      this.memoryModel
        .find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.memoryModel.countDocuments(query).exec(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page: pagination.page,
      limit,
      totalPages,
      hasNext: pagination.page < totalPages,
      hasPrev: pagination.page > 1,
    };
  }

  /**
   * Text search in memories
   */
  async textSearch(
    searchQuery: string,
    filters: MemoryQueryFilters = {},
    limit: number = 10,
  ): Promise<Memory[]> {
    const query: FilterQuery<Memory> = {
      deletedAt: null,
      $text: { $search: searchQuery },
    };

    if (filters.userId) {
      query.userId = filters.userId;
    }
    if (filters.type) {
      query.type = filters.type;
    }
    if (filters.status) {
      query.status = filters.status;
    }

    return this.memoryModel
      .find(query)
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit)
      .exec();
  }

  /**
   * Find memories by tags
   */
  async findByTags(
    userId: string,
    tags: string[],
    limit: number = 10,
  ): Promise<Memory[]> {
    return this.memoryModel
      .find({
        userId,
        tags: { $in: tags },
        deletedAt: null,
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  /**
   * Find related memories
   */
  async findRelated(
    memoryId: string,
    limit: number = 10,
  ): Promise<Memory[]> {
    const memory = await this.findById(memoryId);
    if (!memory || !memory.links || memory.links.length === 0) {
      return [];
    }

    const relatedIds = memory.links.map((link) => link.targetMemoryId);

    return this.memoryModel
      .find({
        _id: { $in: relatedIds },
        deletedAt: null,
      })
      .limit(limit)
      .exec();
  }

  /**
   * Count memories by filters
   */
  async count(filters: MemoryQueryFilters = {}): Promise<number> {
    const query: FilterQuery<Memory> = {
      deletedAt: null,
    };

    if (filters.userId) {
      query.userId = filters.userId;
    }
    if (filters.type) {
      query.type = filters.type;
    }
    if (filters.status) {
      query.status = filters.status;
    }

    return this.memoryModel.countDocuments(query).exec();
  }

  /**
   * Find memories by source
   */
  async findBySource(
    userId: string,
    sourceType: string,
    sourceId: string,
  ): Promise<Memory[]> {
    return this.memoryModel
      .find({
        userId,
        'source.type': sourceType,
        'source.id': sourceId,
        deletedAt: null,
      })
      .sort({ createdAt: -1 })
      .exec();
  }
}
