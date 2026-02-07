import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const method = request.method;
    const url = request.url;
    const query = request.query;
    const params = request.params;
    const body: unknown = request.body;
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse<Response>();
          const duration = Date.now() - startTime;
          const statusCode = response.statusCode;

          this.logger.apiRequest(method, url, statusCode, duration, {
            query,
            params,
            // Don't log full body in production for security
            body:
              process.env.NODE_ENV === 'development' && body
                ? (JSON.parse(JSON.stringify(body)) as Record<string, unknown>)
                : undefined,
          });
        },
        error: (error: Error) => {
          const duration = Date.now() - startTime;
          this.logger.error(
            `Request failed: ${method} ${url}`,
            error.stack,
            'LoggingInterceptor',
            {
              method,
              url,
              duration,
              query,
              params,
              error: error.message,
            },
          );
        },
      }),
    );
  }
}
