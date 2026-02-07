# Logging & APM Quick Reference

Quick reference guide for common logging operations.

## Common Operations

### Basic Logging

```typescript
// Info
this.logger.log('Message', 'Context', { metadata });

// Warning
this.logger.warn('Warning message', 'Context', { metadata });

// Error
this.logger.error('Error message', error.stack, 'Context', { metadata });

// Debug
this.logger.debug('Debug message', 'Context', { metadata });
```

### Specialized Logging

```typescript
// Event
this.logger.event('event_name', { data }, 'info');

// Performance
this.logger.performance('operation', duration, { metadata });

// Database
this.logger.database('findOne', 'collection', duration, { metadata });

// API Request
this.logger.apiRequest('POST', '/api/users', 201, duration, { metadata });

// Auth
this.logger.auth('login', userId, { metadata });

// Business
this.logger.business('subscription_created', { metadata });
```

## Environment Variables

```env
LOG_LEVEL=info
NEW_RELIC_ENABLED=true
NEW_RELIC_LICENSE_KEY=your-key
NEW_RELIC_APP_NAME=MyMindOS-Backend
```

## Log Levels

- `trace` - Very detailed
- `debug` - Debugging info
- `info` - General info (default)
- `warn` - Warnings
- `error` - Errors
- `fatal` - Critical errors

## Common Patterns

### Service Method

```typescript
async someMethod() {
  this.logger.log('Starting operation', 'ServiceName');
  try {
    const result = await operation();
    this.logger.log('Operation completed', 'ServiceName', { resultId: result.id });
    return result;
  } catch (error) {
    this.logger.error('Operation failed', error.stack, 'ServiceName');
    throw error;
  }
}
```

### Performance Tracking

```typescript
const startTime = Date.now();
await operation();
const duration = Date.now() - startTime;
this.logger.performance('operation_name', duration, { context });
```

### Business Event

```typescript
this.logger.business('user_registered', {
  userId: user.id,
  email: user.email,
  method: 'email'
});
```

