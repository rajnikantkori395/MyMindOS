import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { File } from '../schemas/file.schema';
import {
  CreateFileInput,
  UpdateFileInput,
  FileQueryFilters,
  PaginationOptions,
  PaginatedResponse,
} from '../types/file.types';
import { PAGINATION_DEFAULTS } from '../constants/file.constants';

/**
 * File Repository
 * Handles all database operations for File entity
 */
@Injectable()
export class FileRepository {
  constructor(
    @InjectModel(File.name) private readonly fileModel: Model<File>,
  ) {}

  /**
   * Create a new file record
   */
  async create(createInput: CreateFileInput): Promise<File> {
    const file = new this.fileModel(createInput);
    return file.save();
  }

  /**
   * Find file by ID
   */
  async findById(id: string): Promise<File | null> {
    return this.fileModel.findById(id).exec();
  }

  /**
   * Find file by storage key
   */
  async findByStorageKey(storageKey: string): Promise<File | null> {
    return this.fileModel.findOne({ storageKey }).exec();
  }

  /**
   * Update file by ID
   */
  async updateById(
    id: string,
    updateInput: UpdateFileInput,
  ): Promise<File | null> {
    return this.fileModel
      .findByIdAndUpdate(id, updateInput, { new: true })
      .exec();
  }

  /**
   * Delete file by ID (soft delete)
   */
  async deleteById(id: string): Promise<File | null> {
    return this.fileModel
      .findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true })
      .exec();
  }

  /**
   * Find files with filters and pagination
   */
  async findMany(
    filters: FileQueryFilters = {},
    pagination: PaginationOptions = {
      page: PAGINATION_DEFAULTS.PAGE,
      limit: PAGINATION_DEFAULTS.LIMIT,
    },
  ): Promise<PaginatedResponse<File>> {
    const query: FilterQuery<File> = {
      deletedAt: null, // Exclude soft-deleted files
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
    if (filters.mimeType) {
      query.mimeType = filters.mimeType;
    }
    if (filters.search) {
      query.filename = { $regex: filters.search, $options: 'i' };
    }

    const skip = (pagination.page - 1) * pagination.limit;
    const limit = Math.min(pagination.limit, PAGINATION_DEFAULTS.MAX_LIMIT);

    const [data, total] = await Promise.all([
      this.fileModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }).exec(),
      this.fileModel.countDocuments(query).exec(),
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
   * Count files by filters
   */
  async count(filters: FileQueryFilters = {}): Promise<number> {
    const query: FilterQuery<File> = {
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

    return this.fileModel.countDocuments(query).exec();
  }

  /**
   * Get total storage used by user
   */
  async getTotalStorageUsed(userId: string): Promise<number> {
    const result = await this.fileModel
      .aggregate([
        { $match: { userId, deletedAt: null } },
        { $group: { _id: null, total: { $sum: '$size' } } },
      ])
      .exec();

    return result[0]?.total || 0;
  }

  /**
   * Find files by user ID
   */
  async findByUserId(userId: string): Promise<File[]> {
    return this.fileModel
      .find({ userId, deletedAt: null })
      .sort({ createdAt: -1 })
      .exec();
  }
}
