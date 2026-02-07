# Logging & APM Setup Guide

Complete guide to setting up Pino logging and New Relic APM in MyMindOS.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Environment Variables](#environment-variables)
- [New Relic Setup](#new-relic-setup)
- [Verification](#verification)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- Node.js 18+
- New Relic account (free tier available)
- Access to environment configuration

## Installation

Dependencies are already installed. If you need to reinstall:

```bash
pnpm --filter backend add pino pino-http pino-pretty nestjs-pino newrelic
```

## Configuration

### 1. Environment Variables

Add these to your `apps/backend/.env` file:

```env
# Logging Configuration
LOG_LEVEL=info                    # Options: trace, debug, info, warn, error, fatal
NODE_ENV=development              # Controls pretty printing

# New Relic Configuration
NEW_RELIC_ENABLED=true            # Set to false to disable APM
NEW_RELIC_LICENSE_KEY=your-key     # Get from New Relic dashboard
NEW_RELIC_APP_NAME=MyMindOS-Backend
NEW_RELIC_LOG_LEVEL=info
```

### 2. New Relic Configuration File

The `newrelic.js` file is located at `apps/backend/newrelic.js`. It's automatically loaded when `NEW_RELIC_ENABLED=true`.

**Key Settings:**
- `app_name`: Application name in New Relic
- `license_key`: Your New Relic license key
- `distributed_tracing.enabled`: Enable distributed tracing
- `error_collector.enabled`: Enable error collection
- `custom_insights_events.enabled`: Enable custom events

### 3. Module Integration

The logging system is already integrated:

- **LoggerModule**: Global module providing LoggerService
- **LoggingInterceptor**: Automatically logs all HTTP requests
- **HttpExceptionFilter**: Logs all exceptions
- **LoggerService**: Main logging service with custom methods

## Environment Variables Reference

### Logging Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `LOG_LEVEL` | `info` | Minimum log level (trace, debug, info, warn, error, fatal) |
| `NODE_ENV` | `development` | Environment mode (affects pretty printing) |

### New Relic Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NEW_RELIC_ENABLED` | `false` | Enable/disable New Relic APM |
| `NEW_RELIC_LICENSE_KEY` | - | Your New Relic license key (required if enabled) |
| `NEW_RELIC_APP_NAME` | `MyMindOS-Backend` | Application name in New Relic |
| `NEW_RELIC_LOG_LEVEL` | `info` | New Relic agent log level |

## New Relic Setup

### Step 1: Create New Relic Account

1. Go to [newrelic.com](https://newrelic.com)
2. Sign up for a free account
3. Complete the onboarding process

### Step 2: Get License Key

1. Navigate to **API Keys** in New Relic dashboard
2. Copy your **License Key**
3. Add it to `.env` as `NEW_RELIC_LICENSE_KEY`

### Step 3: Configure Application

1. Set `NEW_RELIC_ENABLED=true` in `.env`
2. Set `NEW_RELIC_APP_NAME` to your preferred name
3. Restart the application

### Step 4: Verify Installation

1. Start your application
2. Make a few API requests
3. Go to New Relic dashboard → **APM & Services**
4. You should see your application appear within 1-2 minutes

## Verification

### 1. Check Logs Are Working

Start the application and look for structured logs:

```bash
pnpm run dev:backend
```

You should see:
- Structured JSON logs (development: pretty printed)
- Request/response logs for each API call
- Error logs with stack traces

### 2. Test Custom Logging

Create a test endpoint or use existing code:

```typescript
import { LoggerService } from '../common/logger/logger.service';

constructor(private logger: LoggerService) {}

someMethod() {
  this.logger.log('Test message', 'TestContext');
  this.logger.event('test_event', { key: 'value' });
}
```

### 3. Verify New Relic

1. Check New Relic dashboard for your application
2. Look for:
   - **Transactions**: API requests
   - **Errors**: Exception tracking
   - **Custom Events**: Your custom events
   - **Metrics**: Performance data

### 4. Test Error Logging

Trigger an error and verify:
- Error appears in application logs
- Error appears in New Relic (if enabled)
- Stack trace is captured

## Log Levels

### Available Levels

1. **trace**: Very detailed debugging information
2. **debug**: Debugging information
3. **info**: General informational messages (default)
4. **warn**: Warning messages
5. **error**: Error messages
6. **fatal**: Critical errors that may cause shutdown

### Setting Log Level

```env
LOG_LEVEL=debug  # Show debug and above
LOG_LEVEL=warn   # Show warnings and errors only
```

## Pretty Printing

In development, logs are automatically pretty-printed for readability. In production, logs are output as JSON for log aggregation tools.

**Development:**
```json
{
  "level": 30,
  "time": 1234567890,
  "msg": "User logged in",
  "context": "AuthService",
  "userId": "123"
}
```

**Production (JSON):**
```json
{"level":30,"time":1234567890,"msg":"User logged in","context":"AuthService","userId":"123"}
```

## Redacted Fields

Sensitive fields are automatically redacted from logs:

- `password`
- `token`
- `secret`
- `authorization`
- `cookie`

Add more in `apps/backend/src/config/logging.config.ts`:

```typescript
redact: ['password', 'token', 'secret', 'authorization', 'cookie', 'apiKey'],
```

## Troubleshooting

### Logs Not Appearing

1. Check `LOG_LEVEL` is set correctly
2. Verify LoggerModule is imported in AppModule
3. Check console for errors

### New Relic Not Working

1. Verify `NEW_RELIC_ENABLED=true`
2. Check `NEW_RELIC_LICENSE_KEY` is correct
3. Verify `newrelic.js` file exists
4. Check New Relic agent logs (if enabled)
5. Wait 1-2 minutes for data to appear

### Performance Issues

1. Set `LOG_LEVEL=warn` in production
2. Disable pretty printing (`NODE_ENV=production`)
3. Reduce New Relic sampling if needed

### Missing Custom Events

1. Verify event is being called
2. Check New Relic dashboard → **Custom Events**
3. Verify `custom_insights_events.enabled: true` in `newrelic.js`

## Next Steps

- Read [Logging Usage Guide](logging-usage.md) to learn how to use logging
- Read [Custom Events Guide](custom-events.md) for custom event patterns
- Read [New Relic APM Guide](newrelic-apm.md) for APM features

