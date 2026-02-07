import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '../common/logger/logger.service';
import mongoose from 'mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('mongo.uri');
        return {
          uri,
          retryWrites: true,
          w: 'majority',
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule implements OnModuleInit {
  constructor(
    private configService: ConfigService,
    private logger: LoggerService,
  ) {}

  onModuleInit() {
    const uri = this.configService.get<string>('mongo.uri');
    this.logger.log(
      `Connecting to MongoDB: ${uri?.replace(/\/\/.*@/, '//***@')}`,
      'DatabaseModule',
    );

    // Connection event listeners
    mongoose.connection.on('connected', () => {
      this.logger.log('MongoDB connected successfully', 'DatabaseModule', {
        database: mongoose.connection.name,
        host: mongoose.connection.host,
        port: mongoose.connection.port,
      });
    });

    mongoose.connection.on('error', (error) => {
      this.logger.error(
        'MongoDB connection error',
        error.stack,
        'DatabaseModule',
        {
          error: error.message,
          uri: uri?.replace(/\/\/.*@/, '//***@'),
        },
      );
    });

    mongoose.connection.on('disconnected', () => {
      this.logger.warn('MongoDB disconnected', 'DatabaseModule');
    });

    mongoose.connection.on('reconnected', () => {
      this.logger.log('MongoDB reconnected', 'DatabaseModule');
    });
  }
}
