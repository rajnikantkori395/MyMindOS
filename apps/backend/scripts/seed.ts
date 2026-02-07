/**
 * Database Seeder Script
 * Run this script to seed the database with initial data
 *
 * Usage:
 *   pnpm --filter backend seed
 *   or
 *   ts-node -r tsconfig-paths/register scripts/seed.ts
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { UserSeeder } from '../src/database/seeders/user.seeder';
import { LoggerService } from '../src/common/logger/logger.service';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  const logger = app.get(LoggerService);
  const userSeeder = app.get(UserSeeder);

  try {
    logger.log('🌱 Starting database seeding...', 'SeedScript');

    // Seed users
    logger.log('Seeding users...', 'SeedScript');
    await userSeeder.seed();

    logger.log('✅ Database seeding completed successfully!', 'SeedScript');
    logger.log('', 'SeedScript');
    logger.log('📋 Seeded Users:', 'SeedScript');
    logger.log('   - superadmin@mymindos.com (Password123!)', 'SeedScript');
    logger.log('   - admin@mymindos.com (Password123!)', 'SeedScript');
    logger.log('   - admin2@mymindos.com (Password123!)', 'SeedScript');
    logger.log('   - test@mymindos.com (Password123!)', 'SeedScript');
    logger.log('   - demo@mymindos.com (Password123!)', 'SeedScript');
    logger.log('', 'SeedScript');
    logger.log('⚠️  Please change default passwords in production!', 'SeedScript');

    await app.close();
    process.exit(0);
  } catch (error) {
    logger.error(
      '❌ Database seeding failed',
      error instanceof Error ? error.stack : String(error),
      'SeedScript',
    );
    await app.close();
    process.exit(1);
  }
}

seed();
