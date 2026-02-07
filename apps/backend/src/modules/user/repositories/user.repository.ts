import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { User } from '../schemas/user.schema';
import {
  CreateUserInput,
  UpdateUserInput,
  UserQueryFilters,
  PaginationOptions,
  PaginatedResponse,
} from '../types/user.types';
import { PAGINATION_DEFAULTS } from '../constants/user.constants';

/**
 * User Repository
 * Handles all database operations for User entity
 * Provides abstraction layer between service and database
 */
@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  /**
   * Create a new user
   */
  async create(createInput: CreateUserInput): Promise<User> {
    const user = new this.userModel(createInput);
    return user.save();
  }

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email: email.toLowerCase().trim() }).exec();
  }

  /**
   * Update user by ID
   */
  async updateById(
    id: string,
    updateInput: UpdateUserInput,
  ): Promise<User | null> {
    return this.userModel
      .findByIdAndUpdate(id, updateInput, { new: true })
      .exec();
  }

  /**
   * Update user by email
   */
  async updateByEmail(
    email: string,
    updateInput: UpdateUserInput,
  ): Promise<User | null> {
    return this.userModel
      .findOneAndUpdate({ email: email.toLowerCase().trim() }, updateInput, {
        new: true,
      })
      .exec();
  }

  /**
   * Delete user by ID (soft delete - sets status to inactive)
   */
  async deleteById(id: string): Promise<User | null> {
    return this.userModel
      .findByIdAndUpdate(id, { status: 'inactive' }, { new: true })
      .exec();
  }

  /**
   * Find users with filters and pagination
   */
  async findMany(
    filters: UserQueryFilters = {},
    pagination: PaginationOptions = {
      page: PAGINATION_DEFAULTS.PAGE,
      limit: PAGINATION_DEFAULTS.LIMIT,
    },
  ): Promise<PaginatedResponse<User>> {
    const query: FilterQuery<User> = {};

    if (filters.status) {
      query.status = filters.status;
    }
    if (filters.role) {
      query.role = filters.role;
    }
    if (filters.email) {
      query.email = { $regex: filters.email, $options: 'i' };
    }
    if (filters.emailVerified !== undefined) {
      query.emailVerified = filters.emailVerified;
    }

    const skip = (pagination.page - 1) * pagination.limit;
    const limit = Math.min(pagination.limit, PAGINATION_DEFAULTS.MAX_LIMIT);

    const [data, total] = await Promise.all([
      this.userModel.find(query).skip(skip).limit(limit).exec(),
      this.userModel.countDocuments(query).exec(),
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
   * Count users by filters
   */
  async count(filters: UserQueryFilters = {}): Promise<number> {
    const query: FilterQuery<User> = {};

    if (filters.status) {
      query.status = filters.status;
    }
    if (filters.role) {
      query.role = filters.role;
    }
    if (filters.emailVerified !== undefined) {
      query.emailVerified = filters.emailVerified;
    }

    return this.userModel.countDocuments(query).exec();
  }

  /**
   * Check if user exists by email
   */
  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.userModel
      .countDocuments({ email: email.toLowerCase().trim() })
      .exec();
    return count > 0;
  }

  /**
   * Update last login timestamp
   */
  async updateLastLogin(id: string): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(id, { lastLoginAt: new Date() })
      .exec();
  }

  /**
   * Update user preferences (merge with existing)
   */
  async updatePreferences(
    id: string,
    preferences: Partial<Record<string, any>>,
  ): Promise<User | null> {
    const user = await this.findById(id);
    if (!user) {
      return null;
    }

    user.preferences = { ...user.preferences, ...preferences };
    return user.save();
  }
}
