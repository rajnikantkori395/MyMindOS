# Logging Usage Guide

Complete guide on how to use the LoggerService in your MyMindOS modules.

## Table of Contents
- [Basic Usage](#basic-usage)
- [Log Levels](#log-levels)
- [Context and Metadata](#context-and-metadata)
- [Specialized Logging Methods](#specialized-logging-methods)
- [Use Cases](#use-cases)
- [Best Practices](#best-practices)

## Basic Usage

### Injecting LoggerService

```typescript
import { Injectable } from '@nestjs/common';
import { LoggerService } from '../common/logger/logger.service';

@Injectable()
export class YourService {
  constructor(private logger: LoggerService) {}

  someMethod() {
    this.logger.log('Operation completed', 'YourService');
  }
}
```

### Basic Logging Methods

```typescript
// Info log
this.logger.log('User created successfully', 'UserService');

// Warning log
this.logger.warn('Rate limit approaching', 'ApiService', { 
  remaining: 10 
});

// Error log
this.logger.error('Failed to process payment', error.stack, 'PaymentService', {
  userId: '123',
  amount: 100
});

// Debug log
this.logger.debug('Processing request', 'RequestService', {
  requestId: 'abc123'
});

// Verbose log
this.logger.verbose('Detailed trace information', 'TraceService');
```

## Log Levels

### When to Use Each Level

**`log()` / `info`**: General informational messages
```typescript
this.logger.log('User logged in', 'AuthService', { userId: '123' });
```

**`warn()`**: Warning conditions that don't stop execution
```typescript
this.logger.warn('Cache miss', 'CacheService', { key: 'user:123' });
```

**`error()`**: Error conditions that need attention
```typescript
this.logger.error('Database connection failed', error.stack, 'DatabaseService', {
  host: 'localhost',
  port: 27017
});
```

**`debug()`**: Detailed debugging information
```typescript
this.logger.debug('Query executed', 'DatabaseService', {
  collection: 'users',
  query: { email: 'user@example.com' }
});
```

**`verbose()`**: Very detailed trace information
```typescript
this.logger.verbose('Step 1 of 10 completed', 'ProcessService');
```

## Context and Metadata

### Adding Context

Always provide a context (usually your service/class name):

```typescript
this.logger.log('Operation started', 'UserService');
```

### Adding Metadata

Include relevant metadata for better debugging:

```typescript
this.logger.log('User created', 'UserService', {
  userId: user.id,
  email: user.email,
  role: user.role,
  timestamp: new Date().toISOString()
});
```

## Specialized Logging Methods

### Event Logging

Log custom business events:

```typescript
this.logger.event('user_registered', {
  userId: user.id,
  email: user.email,
  source: 'web',
  timestamp: Date.now()
}, 'info');
```

### Performance Logging

Track operation performance:

```typescript
const startTime = Date.now();
// ... perform operation
const duration = Date.now() - startTime;

this.logger.performance('user_creation', duration, {
  userId: user.id,
  method: 'email'
});
```

### Database Logging

Log database operations:

```typescript
const startTime = Date.now();
const result = await this.userModel.findOne({ email });
const duration = Date.now() - startTime;

this.logger.database('findOne', 'users', duration, {
  query: { email },
  found: !!result
});
```

### API Request Logging

Log API requests (automatically done by interceptor, but can be used manually):

```typescript
this.logger.apiRequest('POST', '/api/users', 201, 150, {
  userId: '123',
  ip: request.ip
});
```

### Authentication Logging

Log auth events:

```typescript
// Successful login
this.logger.auth('login', user.id, {
  method: 'email',
  ip: request.ip,
  userAgent: request.headers['user-agent']
});

// Failed login
this.logger.auth('failed', undefined, {
  email: loginDto.email,
  reason: 'invalid_password',
  ip: request.ip
});

// Logout
this.logger.auth('logout', user.id, {
  sessionId: session.id
});
```

### Business Event Logging

Log business-critical events:

```typescript
this.logger.business('subscription_created', {
  userId: user.id,
  plan: 'premium',
  amount: 29.99,
  currency: 'USD'
});
```

## Use Cases

### Use Case 1: Service Method Logging

```typescript
@Injectable()
export class UserService {
  constructor(
    private userModel: Model<User>,
    private logger: LoggerService
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    this.logger.log('Creating user', 'UserService', { email: createUserDto.email });

    try {
      const user = await this.userModel.create(createUserDto);
      
      this.logger.log('User created successfully', 'UserService', {
        userId: user.id,
        email: user.email
      });

      this.logger.business('user_registered', {
        userId: user.id,
        email: user.email,
        method: createUserDto.method
      });

      return user;
    } catch (error) {
      this.logger.error(
        'Failed to create user',
        error.stack,
        'UserService',
        { email: createUserDto.email }
      );
      throw error;
    }
  }
}
```

### Use Case 2: Error Handling

```typescript
@Injectable()
export class PaymentService {
  constructor(private logger: LoggerService) {}

  async processPayment(paymentDto: PaymentDto) {
    try {
      // Process payment
      const result = await this.paymentGateway.charge(paymentDto);
      
      this.logger.business('payment_processed', {
        userId: paymentDto.userId,
        amount: paymentDto.amount,
        transactionId: result.id
      });

      return result;
    } catch (error) {
      this.logger.error(
        'Payment processing failed',
        error.stack,
        'PaymentService',
        {
          userId: paymentDto.userId,
          amount: paymentDto.amount,
          errorCode: error.code
        }
      );

      // Record in New Relic as custom error
      this.logger.event('payment_failed', {
        userId: paymentDto.userId,
        amount: paymentDto.amount,
        errorCode: error.code,
        errorMessage: error.message
      }, 'error');

      throw error;
    }
  }
}
```

### Use Case 3: Performance Monitoring

```typescript
@Injectable()
export class DataProcessingService {
  constructor(private logger: LoggerService) {}

  async processLargeDataset(dataset: any[]) {
    const startTime = Date.now();
    this.logger.debug('Starting data processing', 'DataProcessingService', {
      datasetSize: dataset.length
    });

    let processed = 0;
    for (const item of dataset) {
      await this.processItem(item);
      processed++;

      // Log progress every 100 items
      if (processed % 100 === 0) {
        const elapsed = Date.now() - startTime;
        this.logger.debug('Processing progress', 'DataProcessingService', {
          processed,
          total: dataset.length,
          elapsed,
          rate: processed / (elapsed / 1000) // items per second
        });
      }
    }

    const duration = Date.now() - startTime;
    this.logger.performance('dataset_processing', duration, {
      itemsProcessed: processed,
      itemsPerSecond: processed / (duration / 1000)
    });

    this.logger.log('Data processing completed', 'DataProcessingService', {
      totalItems: processed,
      duration
    });
  }
}
```

### Use Case 4: Database Query Logging

```typescript
@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private logger: LoggerService
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    const startTime = Date.now();
    
    try {
      const user = await this.userModel.findOne({ email }).exec();
      const duration = Date.now() - startTime;

      this.logger.database('findOne', 'users', duration, {
        query: { email },
        found: !!user
      });

      return user;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(
        'Database query failed',
        error.stack,
        'UserRepository',
        {
          operation: 'findOne',
          collection: 'users',
          query: { email },
          duration
        }
      );
      throw error;
    }
  }
}
```

### Use Case 5: Authentication Flow

```typescript
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private logger: LoggerService
  ) {}

  async login(loginDto: LoginDto, request: Request) {
    this.logger.debug('Login attempt', 'AuthService', {
      email: loginDto.email,
      ip: request.ip
    });

    const user = await this.userService.findByEmail(loginDto.email);
    
    if (!user) {
      this.logger.auth('failed', undefined, {
        email: loginDto.email,
        reason: 'user_not_found',
        ip: request.ip
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await this.validatePassword(loginDto.password, user.password);
    
    if (!isValid) {
      this.logger.auth('failed', user.id, {
        email: loginDto.email,
        reason: 'invalid_password',
        ip: request.ip
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.generateToken(user);
    
    this.logger.auth('login', user.id, {
      method: 'email',
      ip: request.ip,
      userAgent: request.headers['user-agent']
    });

    this.logger.log('User logged in successfully', 'AuthService', {
      userId: user.id,
      email: user.email
    });

    return { user, token };
  }
}
```

## Best Practices

### 1. Always Provide Context

```typescript
// ✅ Good
this.logger.log('Operation completed', 'UserService');

// ❌ Bad
this.logger.log('Operation completed');
```

### 2. Include Relevant Metadata

```typescript
// ✅ Good
this.logger.log('User created', 'UserService', {
  userId: user.id,
  email: user.email,
  role: user.role
});

// ❌ Bad
this.logger.log('User created', 'UserService');
```

### 3. Use Appropriate Log Levels

```typescript
// ✅ Good
this.logger.error('Database connection failed', error.stack, 'DatabaseService');
this.logger.warn('Cache miss, fetching from database', 'CacheService');
this.logger.debug('Query parameters', 'QueryService', { params });

// ❌ Bad
this.logger.log('Database connection failed', 'DatabaseService'); // Should be error
this.logger.error('Cache miss', 'CacheService'); // Should be warn
```

### 4. Don't Log Sensitive Data

```typescript
// ✅ Good
this.logger.log('User logged in', 'AuthService', {
  userId: user.id,
  email: user.email
  // password is automatically redacted
});

// ❌ Bad
this.logger.log('User logged in', 'AuthService', {
  password: user.password, // Will be redacted, but don't include it
  creditCard: user.creditCard // Don't log sensitive data
});
```

### 5. Use Specialized Methods

```typescript
// ✅ Good
this.logger.auth('login', user.id, { ip: request.ip });
this.logger.performance('user_creation', duration, { userId: user.id });
this.logger.business('subscription_created', { userId, plan, amount });

// ❌ Bad
this.logger.log('User logged in', 'AuthService', { event: 'login', userId, ip });
```

### 6. Log Errors with Stack Traces

```typescript
// ✅ Good
try {
  await someOperation();
} catch (error) {
  this.logger.error(
    'Operation failed',
    error.stack,
    'ServiceName',
    { additionalContext: 'value' }
  );
}

// ❌ Bad
try {
  await someOperation();
} catch (error) {
  this.logger.error('Operation failed', undefined, 'ServiceName');
}
```

### 7. Use Business Events for Analytics

```typescript
// ✅ Good - Use for important business events
this.logger.business('subscription_upgraded', {
  userId: user.id,
  fromPlan: 'basic',
  toPlan: 'premium',
  revenue: 29.99
});

// ✅ Good - Use for user actions
this.logger.business('file_uploaded', {
  userId: user.id,
  fileId: file.id,
  fileSize: file.size,
  fileType: file.type
});
```

## Next Steps

- Read [Custom Events Guide](custom-events.md) for defining custom event schemas
- Read [New Relic APM Guide](newrelic-apm.md) for APM-specific features

