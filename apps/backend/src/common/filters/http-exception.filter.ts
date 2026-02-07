import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from '../logger/logger.service';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private logger: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const isDevelopment = process.env.NODE_ENV === 'development';
    const errorMessage =
      typeof message === 'string' ? message : (message as any).message;
    const errorStack =
      exception instanceof Error ? exception.stack : undefined;
    const errorName = exception instanceof Error ? exception.name : 'UnknownError';

    const errorResponse: any = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: errorMessage,
    };

    // Include stack trace and error details in development
    if (isDevelopment && exception instanceof Error) {
      errorResponse.error = errorName;
      errorResponse.stack = errorStack;
      errorResponse.details = {
        message: exception.message,
        name: exception.name,
      };
    }

    // Log the error with full details
    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${errorMessage}`,
      errorStack,
      'HttpExceptionFilter',
      {
        statusCode: status,
        path: request.url,
        method: request.method,
        body: request.body,
        query: request.query,
        params: request.params,
        errorName,
        errorMessage,
        ...(isDevelopment && { stack: errorStack }),
      },
    );

    response.status(status).json(errorResponse);
  }
}
