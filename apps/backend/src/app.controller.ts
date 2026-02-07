import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import mongoose from 'mongoose';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Root endpoint',
    description: 'Returns a welcome message',
  })
  @ApiResponse({ status: 200, description: 'Welcome message' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({
    summary: 'Health check',
    description: 'Returns the health status of the API and database connection',
  })
  @ApiResponse({
    status: 200,
    description: 'Health status',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        service: { type: 'string', example: 'MyMindOS Backend' },
        database: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'connected' },
            name: { type: 'string', example: 'mymindos' },
            host: { type: 'string', example: 'localhost' },
            port: { type: 'number', example: 27017 },
          },
        },
        uptime: { type: 'number', example: 12345 },
        environment: { type: 'string', example: 'development' },
      },
    },
  })
  getHealth() {
    const dbState = mongoose.connection.readyState;
    const dbStatus =
      dbState === 1
        ? 'connected'
        : dbState === 2
          ? 'connecting'
          : dbState === 0
            ? 'disconnected'
            : 'error';

    return {
      status: dbState === 1 ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      service: 'MyMindOS Backend',
      database: {
        status: dbStatus,
        name: mongoose.connection.name || 'unknown',
        host: mongoose.connection.host || 'unknown',
        port: mongoose.connection.port || 'unknown',
        readyState: dbState,
      },
      uptime: process.uptime(),
      environment: this.configService.get<string>('nodeEnv') || 'development',
      port: this.configService.get<number>('port') || 3000,
    };
  }
}
