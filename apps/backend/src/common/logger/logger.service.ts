import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as newrelic from 'newrelic';
import pino from 'pino';

@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly logger: pino.Logger;
  private readonly newRelicEnabled: boolean;

  constructor(private configService: ConfigService) {
    const loggingConfig = this.configService.get('logging');
    const newRelicConfig = this.configService.get('newRelic');

    this.newRelicEnabled = newRelicConfig?.enabled || false;

    this.logger = pino({
      level: loggingConfig?.level || 'info',
      transport: loggingConfig?.pretty
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'HH:MM:ss Z',
              ignore: 'pid,hostname',
            },
          }
        : undefined,
      redact: loggingConfig?.redact || [],
      serializers: loggingConfig?.serializers || {},
    });
  }

  /**
   * Log a message with context
   */
  log(message: string, context?: string, metadata?: Record<string, any>) {
    const logData = {
      context: context || 'Application',
      ...metadata,
    };
    this.logger.info(logData, message);
    if (
      this.newRelicEnabled &&
      typeof newrelic.addCustomAttribute === 'function'
    ) {
      // Add custom attributes to current transaction
      Object.entries(metadata || {}).forEach(([key, value]) => {
        try {
          newrelic.addCustomAttribute(key, value);
        } catch (error) {
          // Silently fail if not in a transaction context
        }
      });
    }
  }

  /**
   * Log an error with stack trace
   */
  error(
    message: string,
    trace?: string,
    context?: string,
    metadata?: Record<string, any>,
  ) {
    const logData = {
      context: context || 'Application',
      trace,
      ...metadata,
    };
    this.logger.error(logData, message);
    if (this.newRelicEnabled && typeof newrelic.noticeError === 'function') {
      try {
        const error = new Error(message);
        if (trace) {
          error.stack = trace;
        }
        newrelic.noticeError(error, {
          context,
          ...metadata,
        });
      } catch (err) {
        // Silently fail if New Relic is not properly initialized
      }
    }
  }

  /**
   * Log a warning
   */
  warn(message: string, context?: string, metadata?: Record<string, any>) {
    const logData = {
      context: context || 'Application',
      ...metadata,
    };
    this.logger.warn(logData, message);
    if (
      this.newRelicEnabled &&
      typeof newrelic.addCustomAttribute === 'function'
    ) {
      // Add custom attributes for warnings
      try {
        newrelic.addCustomAttribute('warning_message', message);
        newrelic.addCustomAttribute(
          'warning_context',
          context || 'Application',
        );
      } catch (error) {
        // Silently fail if not in a transaction context
      }
    }
  }

  /**
   * Log debug information
   */
  debug(message: string, context?: string, metadata?: Record<string, any>) {
    const logData = {
      context: context || 'Application',
      ...metadata,
    };
    this.logger.debug(logData, message);
    // Debug logs are typically not sent to New Relic to reduce overhead
  }

  /**
   * Log verbose information
   */
  verbose(message: string, context?: string, metadata?: Record<string, any>) {
    const logData = {
      context: context || 'Application',
      ...metadata,
    };
    this.logger.trace(logData, message);
    // Verbose/trace logs are typically not sent to New Relic to reduce overhead
  }

  /**
   * Log a custom event with structured data
   */
  event(
    eventName: string,
    metadata: Record<string, any>,
    level: 'info' | 'warn' | 'error' | 'debug' = 'info',
  ) {
    const logData = {
      event: eventName,
      ...metadata,
    };

    switch (level) {
      case 'error':
        this.logger.error(logData, `Event: ${eventName}`);
        break;
      case 'warn':
        this.logger.warn(logData, `Event: ${eventName}`);
        break;
      case 'debug':
        this.logger.debug(logData, `Event: ${eventName}`);
        break;
      default:
        this.logger.info(logData, `Event: ${eventName}`);
    }

    if (
      this.newRelicEnabled &&
      typeof newrelic.recordCustomEvent === 'function'
    ) {
      try {
        newrelic.recordCustomEvent(eventName, metadata);
      } catch (err) {
        // Silently fail if New Relic is not properly initialized
      }
    }
  }

  /**
   * Log performance metrics
   */
  performance(
    operation: string,
    duration: number,
    metadata?: Record<string, any>,
  ) {
    const logData = {
      operation,
      duration,
      unit: 'ms',
      ...metadata,
    };
    this.logger.info(logData, `Performance: ${operation} took ${duration}ms`);

    if (this.newRelicEnabled) {
      try {
        if (typeof newrelic.recordMetric === 'function') {
          newrelic.recordMetric(`Custom/${operation}`, duration);
        }
        if (typeof newrelic.recordCustomEvent === 'function') {
          newrelic.recordCustomEvent('Performance', {
            operation,
            duration,
            ...metadata,
          });
        }
      } catch (err) {
        // Silently fail if New Relic is not properly initialized
      }
    }
  }

  /**
   * Log database query
   */
  database(
    operation: string,
    collection: string,
    duration?: number,
    metadata?: Record<string, any>,
  ) {
    const logData = {
      type: 'database',
      operation,
      collection,
      duration,
      ...metadata,
    };
    this.logger.debug(logData, `Database ${operation} on ${collection}`);

    if (
      this.newRelicEnabled &&
      duration &&
      typeof newrelic.recordMetric === 'function'
    ) {
      try {
        newrelic.recordMetric(`Database/${collection}/${operation}`, duration);
      } catch (err) {
        // Silently fail if New Relic is not properly initialized
      }
    }
  }

  /**
   * Log API request
   */
  apiRequest(
    method: string,
    path: string,
    statusCode: number,
    duration?: number,
    metadata?: Record<string, any>,
  ) {
    const logData = {
      type: 'api',
      method,
      path,
      statusCode,
      duration,
      ...metadata,
    };
    this.logger.info(logData, `${method} ${path} - ${statusCode}`);

    if (
      this.newRelicEnabled &&
      duration &&
      typeof newrelic.recordMetric === 'function'
    ) {
      try {
        newrelic.recordMetric(`API/${method}/${path}`, duration);
      } catch (err) {
        // Silently fail if New Relic is not properly initialized
      }
    }
  }

  /**
   * Log authentication event
   */
  auth(
    event: 'login' | 'logout' | 'register' | 'token_refresh' | 'failed',
    userId?: string,
    metadata?: Record<string, any>,
  ) {
    const logData = {
      type: 'auth',
      event,
      userId,
      ...metadata,
    };
    this.logger.info(logData, `Auth: ${event}`);

    if (
      this.newRelicEnabled &&
      typeof newrelic.recordCustomEvent === 'function'
    ) {
      try {
        newrelic.recordCustomEvent('Auth', {
          event,
          userId,
          ...metadata,
        });
      } catch (err) {
        // Silently fail if New Relic is not properly initialized
      }
    }
  }

  /**
   * Log business event
   */
  business(eventName: string, metadata: Record<string, any>) {
    const logData = {
      type: 'business',
      event: eventName,
      ...metadata,
    };
    this.logger.info(logData, `Business Event: ${eventName}`);

    if (
      this.newRelicEnabled &&
      typeof newrelic.recordCustomEvent === 'function'
    ) {
      try {
        newrelic.recordCustomEvent('Business', {
          event: eventName,
          ...metadata,
        });
      } catch (err) {
        // Silently fail if New Relic is not properly initialized
      }
    }
  }
}
