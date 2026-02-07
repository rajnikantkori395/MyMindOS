import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import appConfig from './app.config';
import databaseConfig from './database.config';
import securityConfig from './security.config';
import loggingConfig from './logging.config';
import storageConfig from './storage.config';
import aiConfig from './ai.config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        databaseConfig,
        securityConfig,
        loggingConfig,
        storageConfig,
        aiConfig,
      ],
      envFilePath: '.env',
    }),
  ],
  exports: [NestConfigModule],
})
export class ConfigModule {}
