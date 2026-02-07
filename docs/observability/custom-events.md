# Custom Events Guide

Guide to defining and using custom log events in MyMindOS.

## Table of Contents
- [Overview](#overview)
- [Built-in Event Types](#built-in-event-types)
- [Custom Event Patterns](#custom-event-patterns)
- [Event Schemas](#event-schemas)
- [Best Practices](#best-practices)

## Overview

Custom events allow you to track specific business metrics and user actions. They are automatically sent to New Relic (if enabled) and can be queried for analytics.

## Built-in Event Types

### 1. Authentication Events

```typescript
// Login
this.logger.auth('login', userId, {
  method: 'email' | 'oauth' | 'token',
  ip: string,
  userAgent?: string
});

// Logout
this.logger.auth('logout', userId, {
  sessionId?: string
});

// Registration
this.logger.auth('register', userId, {
  method: 'email',
  email: string
});

// Token Refresh
this.logger.auth('token_refresh', userId, {
  tokenType: 'access' | 'refresh'
});

// Failed Attempt
this.logger.auth('failed', userId | undefined, {
  email?: string,
  reason: string,
  ip: string
});
```

### 2. Business Events

```typescript
this.logger.business('event_name', {
  // Your custom metadata
  userId?: string,
  // ... other fields
});
```

### 3. Performance Events

```typescript
this.logger.performance('operation_name', durationMs, {
  // Additional context
  operationId?: string,
  // ... other fields
});
```

### 4. Generic Events

```typescript
this.logger.event('event_name', {
  // Your custom metadata
}, 'info' | 'warn' | 'error' | 'debug');
```

## Custom Event Patterns

### Pattern 1: User Actions

```typescript
// File Upload
this.logger.business('file_uploaded', {
  userId: user.id,
  fileId: file.id,
  fileName: file.name,
  fileSize: file.size,
  fileType: file.type,
  storageLocation: 's3',
  timestamp: Date.now()
});

// File Deleted
this.logger.business('file_deleted', {
  userId: user.id,
  fileId: file.id,
  reason: 'user_request' | 'cleanup' | 'quota_exceeded'
});

// Memory Created
this.logger.business('memory_created', {
  userId: user.id,
  memoryId: memory.id,
  source: 'file' | 'note' | 'chat',
  contentType: 'text' | 'image' | 'audio',
  size: number
});

// Memory Searched
this.logger.business('memory_searched', {
  userId: user.id,
  query: string,
  resultsCount: number,
  duration: number,
  searchType: 'semantic' | 'keyword' | 'hybrid'
});
```

### Pattern 2: Subscription Events

```typescript
// Subscription Created
this.logger.business('subscription_created', {
  userId: user.id,
  plan: 'free' | 'premium' | 'enterprise',
  amount: number,
  currency: 'USD',
  billingCycle: 'monthly' | 'yearly',
  paymentMethod: 'card' | 'paypal'
});

// Subscription Upgraded
this.logger.business('subscription_upgraded', {
  userId: user.id,
  fromPlan: 'free' | 'premium',
  toPlan: 'premium' | 'enterprise',
  revenue: number,
  upgradeReason?: string
});

// Subscription Cancelled
this.logger.business('subscription_cancelled', {
  userId: user.id,
  plan: string,
  cancellationReason?: string,
  refundAmount?: number
});
```

### Pattern 3: AI Operations

```typescript
// Embedding Generated
this.logger.business('embedding_generated', {
  userId: user.id,
  memoryId: memory.id,
  provider: 'openai' | 'anthropic' | 'local',
  model: string,
  tokensUsed: number,
  duration: number,
  cost?: number
});

// Chat Message
this.logger.business('chat_message', {
  userId: user.id,
  sessionId: string,
  messageType: 'user' | 'assistant',
  tokensUsed: number,
  duration: number,
  memoriesRetrieved: number
});

// Summary Generated
this.logger.business('summary_generated', {
  userId: user.id,
  memoryId: memory.id,
  sourceCount: number,
  summaryLength: number,
  duration: number
});
```

### Pattern 4: Error Events

```typescript
// Payment Failed
this.logger.event('payment_failed', {
  userId: user.id,
  amount: number,
  currency: string,
  errorCode: string,
  errorMessage: string,
  paymentMethod: string
}, 'error');

// API Rate Limit
this.logger.event('rate_limit_exceeded', {
  userId: user.id,
  endpoint: string,
  limit: number,
  retryAfter: number
}, 'warn');

// Quota Exceeded
this.logger.event('quota_exceeded', {
  userId: user.id,
  quotaType: 'storage' | 'api_calls' | 'ai_tokens',
  limit: number,
  current: number
}, 'warn');
```

## Event Schemas

### Recommended Event Schema Structure

```typescript
interface CustomEvent {
  // Always include
  userId?: string;           // User who triggered the event
  timestamp?: number;        // Event timestamp (defaults to now)
  
  // Event-specific
  [key: string]: any;        // Additional event-specific fields
}
```

### Example: Complete Event Schema

```typescript
// Define in a types file
export interface FileUploadedEvent {
  userId: string;
  fileId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  mimeType: string;
  storageLocation: 's3' | 'local';
  uploadDuration: number;
  timestamp: number;
}

// Use in service
this.logger.business('file_uploaded', {
  userId: user.id,
  fileId: file.id,
  fileName: file.name,
  fileSize: file.size,
  fileType: file.type,
  mimeType: file.mimeType,
  storageLocation: 's3',
  uploadDuration: duration,
  timestamp: Date.now()
} as FileUploadedEvent);
```

## Best Practices

### 1. Use Consistent Event Names

```typescript
// ✅ Good - Consistent naming
this.logger.business('file_uploaded', {...});
this.logger.business('file_deleted', {...});
this.logger.business('file_shared', {...});

// ❌ Bad - Inconsistent
this.logger.business('fileUpload', {...});
this.logger.business('delete_file', {...});
this.logger.business('FileShared', {...});
```

### 2. Include User Context

```typescript
// ✅ Good
this.logger.business('memory_created', {
  userId: user.id,
  memoryId: memory.id,
  // ... other fields
});

// ❌ Bad
this.logger.business('memory_created', {
  memoryId: memory.id
  // Missing userId
});
```

### 3. Use Appropriate Event Types

```typescript
// ✅ Good - Business events for user actions
this.logger.business('subscription_created', {...});

// ✅ Good - Performance events for operations
this.logger.performance('database_query', duration, {...});

// ✅ Good - Generic events for errors
this.logger.event('payment_failed', {...}, 'error');
```

### 4. Don't Over-log

```typescript
// ✅ Good - Log important events
this.logger.business('subscription_created', {...});

// ❌ Bad - Don't log every method call
// this.logger.business('method_called', {...}); // Too verbose
```

### 5. Include Relevant Metrics

```typescript
// ✅ Good - Include useful metrics
this.logger.business('memory_searched', {
  userId: user.id,
  query: query,
  resultsCount: results.length,
  duration: duration,
  searchType: 'semantic'
});

// ❌ Bad - Missing important metrics
this.logger.business('memory_searched', {
  userId: user.id
  // Missing query, results, duration
});
```

### 6. Use Enums for Fixed Values

```typescript
// ✅ Good - Use enums or constants
enum Plan {
  FREE = 'free',
  PREMIUM = 'premium',
  ENTERPRISE = 'enterprise'
}

this.logger.business('subscription_created', {
  plan: Plan.PREMIUM,
  // ...
});

// ❌ Bad - Magic strings
this.logger.business('subscription_created', {
  plan: 'premium', // Could be 'Premium', 'PREMIUM', etc.
});
```

## Event Categories

### Recommended Categories

1. **User Actions**: `user_*` (e.g., `user_registered`, `user_updated`)
2. **File Operations**: `file_*` (e.g., `file_uploaded`, `file_deleted`)
3. **Memory Operations**: `memory_*` (e.g., `memory_created`, `memory_searched`)
4. **AI Operations**: `ai_*` (e.g., `ai_embedding_generated`, `ai_summary_created`)
5. **Subscription**: `subscription_*` (e.g., `subscription_created`, `subscription_upgraded`)
6. **Payment**: `payment_*` (e.g., `payment_processed`, `payment_failed`)
7. **Chat**: `chat_*` (e.g., `chat_message_sent`, `chat_session_created`)

## Querying Events in New Relic

Once events are logged, you can query them in New Relic:

```sql
-- Query custom events
SELECT * FROM Business WHERE event = 'file_uploaded' SINCE 1 day ago

-- Count events
SELECT count(*) FROM Business WHERE event = 'subscription_created' FACET userId SINCE 7 days ago

-- Average metrics
SELECT average(duration) FROM Business WHERE event = 'memory_searched' SINCE 1 day ago
```

## Next Steps

- Review [Logging Usage Guide](logging-usage.md) for more examples
- Check [New Relic APM Guide](newrelic-apm.md) for querying events

