# Required Configuration Values

Complete list of environment variables needed for logging and APM setup.

## Logging Configuration

### Required Variables

| Variable | Default | Required | Description |
|----------|---------|----------|-------------|
| `LOG_LEVEL` | `info` | No | Log level: `trace`, `debug`, `info`, `warn`, `error`, `fatal` |
| `NODE_ENV` | `development` | No | Environment mode (affects pretty printing) |

### Example

```env
LOG_LEVEL=info
NODE_ENV=development
```

## New Relic APM Configuration

### Required Variables

| Variable | Default | Required | Description |
|----------|---------|----------|-------------|
| `NEW_RELIC_ENABLED` | `false` | Yes (if using APM) | Enable/disable New Relic (`true` or `false`) |
| `NEW_RELIC_LICENSE_KEY` | - | Yes (if enabled) | Your New Relic license key |
| `NEW_RELIC_APP_NAME` | `MyMindOS-Backend` | No | Application name in New Relic dashboard |
| `NEW_RELIC_LOG_LEVEL` | `info` | No | New Relic agent log level |

### Example (APM Enabled)

```env
NEW_RELIC_ENABLED=true
NEW_RELIC_LICENSE_KEY=your-license-key-here
NEW_RELIC_APP_NAME=MyMindOS-Backend
NEW_RELIC_LOG_LEVEL=info
```

### Example (APM Disabled)

```env
NEW_RELIC_ENABLED=false
```

## Complete .env Example

```env
# Logging Configuration
LOG_LEVEL=info
NODE_ENV=development

# New Relic APM Configuration
NEW_RELIC_ENABLED=false
NEW_RELIC_LICENSE_KEY=
NEW_RELIC_APP_NAME=MyMindOS-Backend
NEW_RELIC_LOG_LEVEL=info
```

## How to Get New Relic License Key

1. Sign up at [newrelic.com](https://newrelic.com)
2. Go to **API Keys** section
3. Copy your **License Key**
4. Add to `.env` as `NEW_RELIC_LICENSE_KEY`

## Quick Setup Checklist

- [ ] Copy `.env.example` to `.env`
- [ ] Set `LOG_LEVEL` (optional, defaults to `info`)
- [ ] If using New Relic:
  - [ ] Set `NEW_RELIC_ENABLED=true`
  - [ ] Add `NEW_RELIC_LICENSE_KEY` from New Relic dashboard
  - [ ] Optionally set `NEW_RELIC_APP_NAME`
- [ ] Restart application

## Notes

- **New Relic is optional**: Set `NEW_RELIC_ENABLED=false` to disable APM
- **Logging works without New Relic**: Pino logging works independently
- **Development vs Production**: 
  - Development: Pretty printed logs, full request bodies
  - Production: JSON logs, no request bodies for security

