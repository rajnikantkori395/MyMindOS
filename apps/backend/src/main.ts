/* eslint-disable @typescript-eslint/no-require-imports */
// Initialize New Relic APM before anything else
// New Relic must be loaded before any other imports (per their documentation)
if (process.env.NEW_RELIC_ENABLED === 'true') {
  require('newrelic');
}
/* eslint-enable @typescript-eslint/no-require-imports */

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from './common/logger/logger.service';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);
  const logger = app.get(LoggerService);

  // Use custom logger
  app.useLogger(logger);

  // Enable CORS
  const nodeEnv = configService.get<string>('nodeEnv') || 'development';
  const frontendUrl = process.env.FRONTEND_URL;
  const backendPort = configService.get<number>('port') || 3000;
  const backendOrigin = `http://localhost:${backendPort}`;

  // In development, allow common localhost origins
  // In production, use the configured FRONTEND_URL
  const allowedOrigins: string[] =
    nodeEnv === 'development'
      ? [
          backendOrigin, // Allow backend's own origin (for Swagger UI)
          'http://localhost:3000', // Common frontend port
          'http://localhost:3001', // Alternative frontend port
          'http://localhost:3002', // Another alternative
          'http://127.0.0.1:3000', // Sometimes browsers use 127.0.0.1
          'http://127.0.0.1:3001',
          ...(frontendUrl ? [frontendUrl] : []),
        ]
      : frontendUrl
        ? [frontendUrl]
        : ['http://localhost:3001'];

  logger.log('CORS configuration', 'Bootstrap', {
    nodeEnv,
    backendOrigin,
    allowedOrigins,
    frontendUrl,
  });

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // Allow requests with no origin (like mobile apps, curl, Postman, Swagger UI)
      if (!origin) {
        callback(null, true);
        return;
      }

      // Check if origin is in allowed list
      if (allowedOrigins.includes(origin)) {
        logger.log('CORS allowed origin', 'Bootstrap', { origin });
        callback(null, true);
        return;
      }

      // In development, log the blocked origin for debugging
      if (nodeEnv === 'development') {
        logger.warn('CORS blocked origin', 'Bootstrap', {
          origin,
          allowedOrigins,
          suggestion: `Add ${origin} to FRONTEND_URL or allowedOrigins list`,
        });
      }

      // Reject the origin
      callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'X-Requested-With',
      'Content-Length',
      'X-File-Name',
    ],
    exposedHeaders: ['Content-Length', 'Content-Type'],
    maxAge: 86400, // 24 hours
  });

  // Global validation pipe
  // Note: ValidationPipe will skip validation for multipart/form-data automatically
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false, // Set to false to allow file uploads
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global logging interceptor
  app.useGlobalInterceptors(new LoggingInterceptor(logger));

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter(logger));

  // API prefix
  const apiPrefix = configService.get<string>('apiPrefix') || '/api';
  app.setGlobalPrefix(apiPrefix);

  // Swagger API Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('MyMindOS API')
    .setDescription('Personal AI Operating System - API Documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Health', 'Health check endpoints')
    .addTag('Auth', 'Authentication and authorization')
    .addTag('Users', 'User management')
    .addTag('Files', 'File upload and management')
    .addTag('Memories', 'Memory storage and retrieval')
    .addTag('AI Engine', 'AI operations and embeddings')
    .addTag('Chat', 'Conversational interface')
    .addTag('Tasks', 'Task management')
    .addTag('Analytics', 'Analytics and metrics')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  const port = configService.get<number>('port') || 3000;
  await app.listen(port);

  logger.log(
    `Application is running on: http://localhost:${port}${apiPrefix}`,
    'Bootstrap',
    {
      port,
      apiPrefix,
      environment: configService.get<string>('nodeEnv'),
      newRelicEnabled: configService.get<boolean>('newRelic.enabled'),
      swaggerDocs: `http://localhost:${port}${apiPrefix}/docs`,
    },
  );
}
void bootstrap();
