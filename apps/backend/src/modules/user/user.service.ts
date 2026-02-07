import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { User } from './schemas/user.schema';
import { UserStatus, isAdminRole } from './enums';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { LoggerService } from '../../common/logger/logger.service';
import {
  UserQueryFilters,
  PaginationOptions,
  UserListResponse,
  UpdateUserInput,
} from './types/user.types';
import { PAGINATION_DEFAULTS } from './constants/user.constants';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly logger: LoggerService,
  ) {}

  /**
   * Get user profile by ID
   */
  async findById(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
  }

  /**
   * Get user profile by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  /**
   * Get current user profile
   */
  async getProfile(userId: string): Promise<User> {
    this.logger.log('Getting user profile', 'UserService', { userId });
    const user = await this.findById(userId);
    return user;
  }

  /**
   * Update current user profile
   */
  async updateProfile(
    userId: string,
    updateDto: UpdateProfileDto,
  ): Promise<User> {
    this.logger.log('Updating user profile', 'UserService', {
      userId,
      fields: Object.keys(updateDto),
    });

    await this.findById(userId); // Verify user exists

    // Prepare update object
    const updateData: UpdateUserInput = {};
    if (updateDto.name !== undefined) {
      updateData.name = updateDto.name;
    }
    if (updateDto.avatar !== undefined) {
      updateData.avatar = updateDto.avatar;
    }
    if (updateDto.locale !== undefined) {
      updateData.locale = updateDto.locale;
    }
    if (updateDto.timezone !== undefined) {
      updateData.timezone = updateDto.timezone;
    }

    // Update preferences separately to merge with existing
    if (updateDto.preferences !== undefined) {
      await this.userRepository.updatePreferences(
        userId,
        updateDto.preferences,
      );
    }

    // Update other fields
    const updatedUser = await this.userRepository.updateById(
      userId,
      updateData,
    );
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    this.logger.business('profile_updated', {
      userId,
      fields: Object.keys(updateDto),
    });

    return updatedUser;
  }

  /**
   * Update user status (admin only)
   */
  async updateStatus(
    userId: string,
    updateDto: UpdateStatusDto,
    requesterId: string,
  ): Promise<User> {
    this.logger.log('Updating user status', 'UserService', {
      userId,
      status: updateDto.status,
      requesterId,
    });

    // Verify requester is admin (this will be enforced by guard, but double-check)
    const requester = await this.findById(requesterId);
    if (!isAdminRole(requester.role)) {
      throw new ForbiddenException('Only admins can update user status');
    }

    await this.findById(userId); // Verify user exists

    // Prevent self-suspension
    if (userId === requesterId && updateDto.status === UserStatus.SUSPENDED) {
      throw new BadRequestException('Cannot suspend your own account');
    }

    const updatedUser = await this.userRepository.updateById(userId, {
      status: updateDto.status,
    } as UpdateUserInput);

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    this.logger.business('user_status_updated', {
      userId,
      status: updateDto.status,
      updatedBy: requesterId,
    });

    return updatedUser;
  }

  /**
   * Get all users (admin only)
   */
  async findAll(
    page: number = PAGINATION_DEFAULTS.PAGE,
    limit: number = PAGINATION_DEFAULTS.LIMIT,
    filters: UserQueryFilters = {},
  ): Promise<UserListResponse> {
    const pagination: PaginationOptions = { page, limit };
    const result = await this.userRepository.findMany(filters, pagination);

    return {
      data: result.data,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
      hasNext: result.hasNext,
      hasPrev: result.hasPrev,
    };
  }

  /**
   * Update last login timestamp
   */
  async updateLastLogin(userId: string): Promise<void> {
    await this.userRepository.updateLastLogin(userId);
  }
}
