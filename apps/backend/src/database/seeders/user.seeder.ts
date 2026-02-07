/**
 * User Seeder
 * Seeds initial user data for development and production
 */

import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserRepository } from '../../modules/user/repositories/user.repository';
import { UserRole, UserStatus } from '../../modules/user/enums';
import { LoggerService } from '../../common/logger/logger.service';

export interface SeedUser {
  email: string;
  name: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  emailVerified?: boolean;
  preferences?: Record<string, any>;
}

@Injectable()
export class UserSeeder {
  private readonly defaultPassword = 'Password123!';

  constructor(
    private readonly userRepository: UserRepository,
    private readonly logger: LoggerService,
  ) {}

  /**
   * Seed all users
   */
  async seed(): Promise<void> {
    this.logger.log('Starting user seeding...', 'UserSeeder');

    const users = this.getSeedUsers();

    for (const userData of users) {
      await this.seedUser(userData);
    }

    this.logger.log('User seeding completed', 'UserSeeder', {
      totalUsers: users.length,
    });
  }

  /**
   * Seed a single user
   */
  private async seedUser(userData: SeedUser): Promise<void> {
    try {
      // Check if user already exists
      const existingUser = await this.userRepository.findByEmail(
        userData.email,
      );
      if (existingUser) {
        this.logger.log(
          `User already exists: ${userData.email}`,
          'UserSeeder',
          { email: userData.email, role: userData.role },
        );
        return;
      }

      // Hash password
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(userData.password, saltRounds);

      // Create user
      const user = await this.userRepository.create({
        email: userData.email,
        name: userData.name,
        passwordHash,
        role: userData.role,
        status: userData.status,
        emailVerified: userData.emailVerified ?? true,
        preferences: userData.preferences ?? {},
      });

      this.logger.log(`User seeded: ${userData.email}`, 'UserSeeder', {
        userId: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
      });
    } catch (error) {
      this.logger.error(
        `Failed to seed user: ${userData.email}`,
        error instanceof Error ? error.stack : String(error),
        'UserSeeder',
        {
          email: userData.email,
          error: error instanceof Error ? error.message : String(error),
        },
      );
      throw error;
    }
  }

  /**
   * Get seed users configuration
   */
  private getSeedUsers(): SeedUser[] {
    return [
      // Superadmins
      {
        email: 'superadmin@mymindos.com',
        name: 'Super Administrator',
        password: this.defaultPassword,
        role: UserRole.SUPERADMIN,
        status: UserStatus.ACTIVE,
        emailVerified: true,
        preferences: {
          theme: 'dark',
          notifications: true,
        },
      },
      {
        email: 'admin@mymindos.com',
        name: 'System Administrator',
        password: this.defaultPassword,
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
        emailVerified: true,
        preferences: {
          theme: 'light',
          notifications: true,
        },
      },
      // Test users
      {
        email: 'test@mymindos.com',
        name: 'Test User',
        password: this.defaultPassword,
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
        emailVerified: true,
        preferences: {
          theme: 'auto',
          notifications: false,
        },
      },
      {
        email: 'demo@mymindos.com',
        name: 'Demo User',
        password: this.defaultPassword,
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
        emailVerified: true,
      },
      // Additional admin for testing
      {
        email: 'admin2@mymindos.com',
        name: 'Admin User 2',
        password: this.defaultPassword,
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
        emailVerified: true,
      },
    ];
  }

  /**
   * Clear all seeded users (for testing)
   */
  async clear(): Promise<void> {
    this.logger.log('Clearing seeded users...', 'UserSeeder');

    const seedEmails = this.getSeedUsers().map((u) => u.email);
    // Note: This would require a bulk delete method in the repository
    // For now, we'll just log the action
    this.logger.log(
      'Clear operation requires repository method',
      'UserSeeder',
      {
        emails: seedEmails,
      },
    );
  }
}
