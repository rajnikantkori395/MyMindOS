# New Relic APM Guide

Complete guide to using New Relic APM features in MyMindOS.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Dashboard Navigation](#dashboard-navigation)
- [Custom Metrics](#custom-metrics)
- [Error Tracking](#error-tracking)
- [Performance Monitoring](#performance-monitoring)
- [Custom Events](#custom-events)
- [Alerts](#alerts)
- [Best Practices](#best-practices)

## Overview

New Relic APM provides:
- **Application Performance Monitoring**: Track response times, throughput, errors
- **Error Tracking**: Automatic error detection and stack traces
- **Custom Metrics**: Track your own business metrics
- **Custom Events**: Track business events and user actions
- **Distributed Tracing**: Track requests across services
- **Alerts**: Get notified of issues

## Features

### 1. Automatic Transaction Tracking

All HTTP requests are automatically tracked:

- Request/response times
- Status codes
- Error rates
- Throughput

**No code changes needed** - handled by the interceptor.

### 2. Error Tracking

Errors are automatically captured with:
- Stack traces
- Request context
- User information
- Custom attributes

### 3. Custom Metrics

Track your own metrics:

```typescript
// Automatically recorded via LoggerService
this.logger.performance('user_creation', duration, {...});
// Creates metric: Custom/user_creation

this.logger.database('findOne', 'users', duration, {...});
// Creates metric: Database/users/findOne
```

### 4. Custom Events

Track business events:

```typescript
this.logger.business('subscription_created', {...});
// Creates event in New Relic
```

## Dashboard Navigation

### Key Sections

1. **APM & Services**: View your application
2. **Errors**: See all errors and exceptions
3. **Transactions**: View API endpoint performance
4. **Custom Events**: Query your custom events
5. **Metrics**: View performance metrics

### Viewing Your Application

1. Go to **APM & Services**
2. Click on **MyMindOS-Backend**
3. View:
   - **Overview**: Response time, throughput, error rate
   - **Transactions**: Individual endpoint performance
   - **Errors**: All errors and exceptions
   - **Database**: Database query performance
   - **External Services**: Third-party API calls

## Custom Metrics

### Automatic Metrics

The LoggerService automatically creates metrics:

```typescript
// Performance metrics
this.logger.performance('operation_name', duration);
// Metric: Custom/operation_name

// Database metrics
this.logger.database('findOne', 'users', duration);
// Metric: Database/users/findOne

// API metrics
this.logger.apiRequest('POST', '/api/users', 201, duration);
// Metric: API/POST//api/users
```

### Manual Metrics

You can also record metrics directly:

```typescript
import * as newrelic from 'newrelic';

// Record a metric
newrelic.recordMetric('Custom/MyMetric', 100);

// Increment a counter
newrelic.incrementMetric('Custom/MyCounter');

// Record a metric with count and total
newrelic.recordMetric('Custom/MyMetric', {
  count: 10,
  total: 1000,
  min: 50,
  max: 200,
  sumOfSquares: 50000
});
```

### Viewing Metrics

1. Go to **Metrics** in New Relic
2. Search for your custom metrics (e.g., `Custom/user_creation`)
3. View graphs and statistics

## Error Tracking

### Automatic Error Tracking

All errors logged via `LoggerService.error()` are automatically tracked:

```typescript
this.logger.error('Operation failed', error.stack, 'ServiceName', {
  userId: '123',
  operationId: 'abc'
});
```

### Viewing Errors

1. Go to **Errors** in New Relic
2. See:
   - Error frequency
   - Stack traces
   - Affected users
   - Custom attributes

### Error Attributes

Errors include:
- Stack trace
- Request context (method, URL, headers)
- Custom metadata from logger
- User information (if available)

## Performance Monitoring

### Transaction Performance

View performance by endpoint:

1. Go to **Transactions** in New Relic
2. Click on an endpoint
3. See:
   - Average response time
   - Throughput
   - Error rate
   - Time breakdown (database, external calls)

### Slow Transactions

New Relic automatically identifies slow transactions:

1. Go to **Transactions**
2. Sort by **Slowest**
3. Investigate slow endpoints

### Database Performance

Database operations are tracked:

```typescript
this.logger.database('findOne', 'users', duration);
// Shows up in Database tab
```

## Custom Events

### Viewing Custom Events

1. Go to **Custom Events** in New Relic
2. Query events:

```sql
SELECT * FROM Business WHERE event = 'subscription_created' SINCE 1 day ago
```

### Event Queries

```sql
-- Count events
SELECT count(*) FROM Business WHERE event = 'file_uploaded' SINCE 7 days ago

-- Group by user
SELECT count(*) FROM Business 
WHERE event = 'memory_created' 
FACET userId 
SINCE 7 days ago

-- Average metrics
SELECT average(duration) FROM Business 
WHERE event = 'memory_searched' 
SINCE 1 day ago

-- Filter by attributes
SELECT * FROM Business 
WHERE event = 'subscription_created' 
AND plan = 'premium' 
SINCE 30 days ago
```

## Alerts

### Creating Alerts

1. Go to **Alerts & AI** → **Alert conditions**
2. Create new condition:
   - **Metric**: Response time, error rate, etc.
   - **Threshold**: Set your threshold
   - **Duration**: How long before alerting
3. Configure notifications (email, Slack, PagerDuty)

### Recommended Alerts

1. **High Error Rate**
   - Metric: `Error rate`
   - Threshold: > 5%
   - Duration: 5 minutes

2. **Slow Response Time**
   - Metric: `Response time`
   - Threshold: > 2 seconds
   - Duration: 5 minutes

3. **High Database Time**
   - Metric: `Database time`
   - Threshold: > 1 second
   - Duration: 5 minutes

4. **Custom Metric Alert**
   - Metric: `Custom/user_creation`
   - Threshold: > 5 seconds
   - Duration: 5 minutes

## Best Practices

### 1. Use Meaningful Metric Names

```typescript
// ✅ Good
this.logger.performance('user_creation', duration);
// Metric: Custom/user_creation

// ❌ Bad
this.logger.performance('op1', duration);
// Metric: Custom/op1 (not descriptive)
```

### 2. Include Context in Events

```typescript
// ✅ Good
this.logger.business('subscription_created', {
  userId: user.id,
  plan: 'premium',
  amount: 29.99,
  currency: 'USD'
});

// ❌ Bad
this.logger.business('subscription_created', {
  // Missing important context
});
```

### 3. Don't Over-Metric

```typescript
// ✅ Good - Important operations
this.logger.performance('user_creation', duration);
this.logger.performance('payment_processing', duration);

// ❌ Bad - Every operation
// this.logger.performance('get_user', duration); // Too granular
```

### 4. Use Consistent Naming

```typescript
// ✅ Good - Consistent
this.logger.performance('user_creation', duration);
this.logger.performance('user_update', duration);
this.logger.performance('user_deletion', duration);

// ❌ Bad - Inconsistent
this.logger.performance('createUser', duration);
this.logger.performance('update_user', duration);
this.logger.performance('deleteUser', duration);
```

### 5. Monitor Key Business Metrics

Track metrics that matter:

- User registrations
- Subscriptions
- Payments
- File uploads
- AI operations
- Search performance

## Distributed Tracing

Distributed tracing is enabled by default. It tracks requests across:

- Your backend services
- External APIs
- Database calls
- Message queues

### Viewing Traces

1. Go to **Distributed tracing** in New Relic
2. See request flow across services
3. Identify bottlenecks

## Next Steps

- Set up alerts for critical metrics
- Create dashboards for key metrics
- Review error trends regularly
- Optimize slow transactions

