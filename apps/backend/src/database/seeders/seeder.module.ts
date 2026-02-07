/**
 * Seeder Module
 * Provides seeders for database initialization
 */

import { Module } from '@nestjs/common';
import { UserModule } from '../../modules/user/user.module';
import { UserSeeder } from './user.seeder';

@Module({
  imports: [UserModule],
  providers: [UserSeeder],
  exports: [UserSeeder],
})
export class SeederModule {}
