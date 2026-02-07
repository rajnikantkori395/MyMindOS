# Environment Variables Reference

Complete list of all environment variables needed for MyMindOS backend.

## Quick Start

**Minimum Required for Development:**
```env
NODE_ENV=development
PORT=3000
MONGO_URI=mongodb://localhost:27017/mymindos
JWT_ACCESS_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-here
```

---

## Environment Variables by Category

### 1. Application Configuration

| Variable | Default | Required | Description |
|----------|---------|----------|-------------|
| `NODE_ENV` | `development` | No | Environment mode: `development`, `production`, `test` |
| `PORT` | `3000` | No | Server port number |
| `API_PREFIX` | `/api` | No | API route prefix |
| `FRONTEND_URL` | `http://localhost:3001` | No | Frontend URL for CORS |

**Example:**
```env
NODE_ENV=development
PORT=3000
API_PREFIX=/api
FRONTEND_URL=http://localhost:3001
```

---

### 2. Database Configuration

| Variable | Default | Required | Description |
|----------|---------|----------|-------------|
| `MONGO_URI` | `mongodb://localhost:27017/mymindos` | **Yes** | MongoDB connection string |
| `MONGO_DB_NAME` | `mymindos` | No | Database name (extracted from URI if not set) |
| `REDIS_URL` | `redis://localhost:6379` | No | Redis connection URL (for queues) |
| `QUEUE_PREFIX` | `mymindos` | No | Prefix for queue names |

**Example:**
```env
MONGO_URI=mongodb://localhost:27017/mymindos
MONGO_DB_NAME=mymindos
REDIS_URL=redis://localhost:6379
QUEUE_PREFIX=mymindos
```

**For MongoDB Atlas:**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/mymindos?retryWrites=true&w=majority
```

---

### 3. Security Configuration (JWT)

| Variable | Default | Required | Description |
|----------|---------|----------|-------------|
| `JWT_ACCESS_SECRET` | `change-me` | **Yes** | Secret key for access tokens (use strong random string) |
| `JWT_REFRESH_SECRET` | `change-me-too` | **Yes** | Secret key for refresh tokens (use strong random string) |
| `JWT_ACCESS_TTL` | `15m` | No | Access token expiration time (e.g., `15m`, `1h`) |
| `JWT_REFRESH_TTL` | `7d` | No | Refresh token expiration time (e.g., `7d`, `30d`) |

**Example:**
```env
JWT_ACCESS_SECRET=your-super-secret-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=7d
```

**⚠️ Important:** Generate strong secrets:
```bash
# Generate random secret (32+ characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

### 4. Logging Configuration

| Variable | Default | Required | Description |
|----------|---------|----------|-------------|
| `LOG_LEVEL` | `info` | No | Log level: `trace`, `debug`, `info`, `warn`, `error`, `fatal` |

**Example:**
```env
LOG_LEVEL=info
```

**Log Levels:**
- `trace` - Very detailed debugging
- `debug` - Debugging information
- `info` - General information (recommended for production)
- `warn` - Warnings only
- `error` - Errors only
- `fatal` - Critical errors only

---

### 5. New Relic APM Configuration (Optional)

| Variable | Default | Required | Description |
|----------|---------|----------|-------------|
| `NEW_RELIC_ENABLED` | `false` | No | Enable New Relic APM (`true` or `false`) |
| `NEW_RELIC_LICENSE_KEY` | - | Yes (if enabled) | Your New Relic license key |
| `NEW_RELIC_APP_NAME` | `MyMindOS-Backend` | No | Application name in New Relic dashboard |
| `NEW_RELIC_LOG_LEVEL` | `info` | No | New Relic agent log level |

**Example (APM Enabled):**
```env
NEW_RELIC_ENABLED=true
NEW_RELIC_LICENSE_KEY=your-license-key-from-newrelic-dashboard
NEW_RELIC_APP_NAME=MyMindOS-Backend
NEW_RELIC_LOG_LEVEL=info
```

**Example (APM Disabled):**
```env
NEW_RELIC_ENABLED=false
```

---

### 6. File Storage Configuration (Future - S3/MinIO)

| Variable | Default | Required | Description |
|----------|---------|----------|-------------|
| `S3_ENDPOINT` | `http://localhost:9000` | No | S3-compatible storage endpoint |
| `S3_BUCKET` | `mymindos` | No | S3 bucket name |
| `S3_ACCESS_KEY` | `localaccess` | No | S3 access key |
| `S3_SECRET_KEY` | `localsecret` | No | S3 secret key |
| `S3_REGION` | `us-east-1` | No | S3 region |

**Example (Local MinIO):**
```env
S3_ENDPOINT=http://localhost:9000
S3_BUCKET=mymindos
S3_ACCESS_KEY=localaccess
S3_SECRET_KEY=localsecret
S3_REGION=us-east-1
```

**Example (AWS S3):**
```env
S3_ENDPOINT=https://s3.us-east-1.amazonaws.com
S3_BUCKET=mymindos-uploads
S3_ACCESS_KEY=your-aws-access-key
S3_SECRET_KEY=your-aws-secret-key
S3_REGION=us-east-1
```

---

### 7. AI Provider Configuration (Future)

| Variable | Default | Required | Description |
|----------|---------|----------|-------------|
| `OPENAI_API_KEY` | - | No | OpenAI API key |
| `ANTHROPIC_API_KEY` | - | No | Anthropic API key |
| `OLLAMA_BASE_URL` | `http://localhost:11434` | No | Ollama local server URL |

**Example:**
```env
OPENAI_API_KEY=sk-your-openai-key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key
OLLAMA_BASE_URL=http://localhost:11434
```

---

### 8. Vector Database Configuration (Future)

| Variable | Default | Required | Description |
|----------|---------|----------|-------------|
| `VECTOR_DB_URL` | `http://localhost:6333` | No | Qdrant/Pinecone URL |
| `VECTOR_DB_API_KEY` | - | No | Vector database API key |

**Example (Qdrant Local):**
```env
VECTOR_DB_URL=http://localhost:6333
VECTOR_DB_API_KEY=
```

**Example (Qdrant Cloud):**
```env
VECTOR_DB_URL=https://your-cluster.qdrant.io
VECTOR_DB_API_KEY=your-qdrant-api-key
```

---

## Complete .env Example

### Development (Minimal)
```env
# Application
NODE_ENV=development
PORT=3000
API_PREFIX=/api
FRONTEND_URL=http://localhost:3001

# Database
MONGO_URI=mongodb://localhost:27017/mymindos
MONGO_DB_NAME=mymindos
REDIS_URL=redis://localhost:6379
QUEUE_PREFIX=mymindos

# Security (CHANGE THESE!)
JWT_ACCESS_SECRET=change-me-to-strong-secret-min-32-chars
JWT_REFRESH_SECRET=change-me-to-strong-secret-min-32-chars
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=7d

# Logging
LOG_LEVEL=debug

# New Relic (Optional)
NEW_RELIC_ENABLED=false
NEW_RELIC_LICENSE_KEY=
NEW_RELIC_APP_NAME=MyMindOS-Backend
NEW_RELIC_LOG_LEVEL=info

# File Storage (Future)
S3_ENDPOINT=http://localhost:9000
S3_BUCKET=mymindos
S3_ACCESS_KEY=localaccess
S3_SECRET_KEY=localsecret
S3_REGION=us-east-1

# AI Providers (Future)
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
OLLAMA_BASE_URL=http://localhost:11434

# Vector DB (Future)
VECTOR_DB_URL=http://localhost:6333
VECTOR_DB_API_KEY=
```

### Production
```env
NODE_ENV=production
PORT=3000
API_PREFIX=/api
FRONTEND_URL=https://yourdomain.com

MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/mymindos
REDIS_URL=redis://your-redis-host:6379

JWT_ACCESS_SECRET=<strong-random-secret-32+ chars>
JWT_REFRESH_SECRET=<strong-random-secret-32+ chars>
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=7d

LOG_LEVEL=info

NEW_RELIC_ENABLED=true
NEW_RELIC_LICENSE_KEY=your-production-key
NEW_RELIC_APP_NAME=MyMindOS-Backend-Prod
```

---

## Required vs Optional

### ✅ **Required for Basic Functionality:**
- `MONGO_URI` - Database connection
- `JWT_ACCESS_SECRET` - Authentication
- `JWT_REFRESH_SECRET` - Authentication

### ⚠️ **Recommended:**
- `NODE_ENV` - Environment mode
- `PORT` - Server port
- `LOG_LEVEL` - Logging level

### 🔵 **Optional:**
- All other variables have defaults and are optional

---

## Security Best Practices

1. **Never commit `.env` files** - Add to `.gitignore`
2. **Use strong JWT secrets** - Minimum 32 characters, random
3. **Rotate secrets regularly** - Especially in production
4. **Use different secrets per environment** - Dev, staging, prod
5. **Store secrets securely** - Use AWS Secrets Manager, Vault, etc. in production

---

## Generating Secrets

```bash
# Generate JWT secrets (Node.js)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate JWT secrets (OpenSSL)
openssl rand -hex 32
```

---

## Next Steps

1. Copy `.env.example` to `.env`
2. Update required variables (MongoDB URI, JWT secrets)
3. Set optional variables as needed
4. Restart the application

