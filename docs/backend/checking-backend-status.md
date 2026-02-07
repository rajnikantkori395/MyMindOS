# Checking Backend Status & Viewing Logs

Complete guide to verify if your backend is running and where to find logs.

## Quick Status Check

### 1. Health Check Endpoint

**URL:** `http://localhost:3000/api/health`

**Using curl:**
```bash
curl http://localhost:3000/api/health
```

**Using PowerShell:**
```powershell
Invoke-WebRequest -Uri http://localhost:3000/api/health | Select-Object -ExpandProperty Content
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-12-30T04:00:00.000Z",
  "service": "MyMindOS Backend",
  "database": {
    "status": "connected",
    "name": "mymindos",
    "host": "localhost",
    "port": 27017,
    "readyState": 1
  },
  "uptime": 123.45,
  "environment": "development",
  "port": 3000
}
```

**Database Status Values:**
- `readyState: 0` = Disconnected
- `readyState: 1` = Connected ✅
- `readyState: 2` = Connecting
- `readyState: 3` = Disconnecting

### 2. Root Endpoint

**URL:** `http://localhost:3000/`

**Using Browser:**
Open: `http://localhost:3000/api`

**Expected:** Welcome message

### 3. Swagger UI

**URL:** `http://localhost:3000/api/docs`

If Swagger loads, backend is running! ✅

## Where Are Logs?

### Development Mode (Terminal Output)

When running `pnpm run dev:backend`, logs appear in **your terminal/console**:

```
[12:00:00.000] INFO (Bootstrap): Application is running on: http://localhost:3000/api
    port: 3000
    apiPrefix: "/api"
    environment: "development"
    newRelicEnabled: false
    swaggerDocs: "http://localhost:3000/api/docs"

[12:00:00.100] INFO (DatabaseModule): Connecting to MongoDB: mongodb://***@localhost:27017/mymindos

[12:00:00.200] INFO (DatabaseModule): MongoDB connected successfully
    database: "mymindos"
    host: "localhost"
    port: 27017
```

### Log Format

Logs use **Pino** with **pino-pretty** in development:

- **Colorized** output (green for info, red for errors)
- **Timestamp** in `HH:MM:ss.SSS` format
- **Log Level** (INFO, ERROR, WARN, DEBUG)
- **Context** (module/service name)
- **Metadata** (additional data)

### Production Mode

In production (`NODE_ENV=production`), logs are:
- **JSON formatted** (structured logging)
- Output to **stdout** (can be redirected to files)
- **No pretty printing** (for log aggregation tools)

## Checking Backend Status

### Method 1: Process Check (Windows)

```powershell
# Check if Node process is running
Get-Process node -ErrorAction SilentlyContinue

# Check specific port
netstat -ano | findstr :3000
```

### Method 2: HTTP Request

```powershell
# Simple check
try {
    $response = Invoke-WebRequest -Uri http://localhost:3000/api/health -TimeoutSec 2
    Write-Host "✅ Backend is running!" -ForegroundColor Green
    $response.Content | ConvertFrom-Json | ConvertTo-Json
} catch {
    Write-Host "❌ Backend is not responding" -ForegroundColor Red
}
```

### Method 3: Check Logs for Startup Message

Look for this in terminal:
```
Application is running on: http://localhost:3000/api
```

## Understanding Log Messages

### Startup Logs

**✅ Successful Startup:**
```
[INFO] Bootstrap: Application is running on: http://localhost:3000/api
[INFO] DatabaseModule: MongoDB connected successfully
```

**❌ Connection Error:**
```
[ERROR] DatabaseModule: MongoDB connection error
    error: "ENOTFOUND _mongodb._tcp.261996"
    uri: "mongodb://***@..."
```

### Common Log Contexts

- **Bootstrap** - Application startup
- **DatabaseModule** - MongoDB connection
- **LoggingInterceptor** - HTTP request/response
- **HttpExceptionFilter** - Error handling
- **AuthService** - Authentication events
- **UserService** - User operations

## Troubleshooting MongoDB Connection Error

The error `ENOTFOUND _mongodb._tcp.261996` suggests:

### Issue: Malformed MONGO_URI

**Check your `.env` file:**
```bash
# View MONGO_URI (Windows)
Get-Content apps\backend\.env | Select-String "MONGO_URI"
```

**Correct Formats:**

✅ **Local MongoDB:**
```
MONGO_URI=mongodb://localhost:27017/mymindos
```

✅ **MongoDB Atlas:**
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/mymindos?retryWrites=true&w=majority
```

❌ **Wrong (missing protocol):**
```
MONGO_URI=261996  # This causes the error!
```

### Fix Steps

1. **Check `.env` file:**
   ```powershell
   cd apps\backend
   Get-Content .env
   ```

2. **Verify MONGO_URI format:**
   - Must start with `mongodb://` or `mongodb+srv://`
   - Include database name: `/mymindos`
   - For Atlas: Include `?retryWrites=true&w=majority`

3. **Test connection string:**
   ```bash
   # If using local MongoDB
   mongosh mongodb://localhost:27017/mymindos
   ```

## Real-Time Log Monitoring

### Development

Logs appear **automatically** in terminal when running:
```bash
pnpm run dev:backend
```

### Filter Logs

**Windows PowerShell:**
```powershell
# Filter for errors only
pnpm run dev:backend 2>&1 | Select-String "ERROR"

# Filter for database logs
pnpm run dev:backend 2>&1 | Select-String "DatabaseModule"
```

### Save Logs to File

```powershell
# Save all logs
pnpm run dev:backend 2>&1 | Tee-Object -FilePath logs.txt

# Save errors only
pnpm run dev:backend 2>&1 | Select-String "ERROR" | Out-File errors.txt
```

## Log Levels

Configure log level in `.env`:
```env
LOG_LEVEL=debug  # Options: error, warn, info, debug, verbose
```

**Log Level Hierarchy:**
- `error` - Only errors
- `warn` - Warnings and errors
- `info` - Info, warnings, errors (default)
- `debug` - Debug + all above
- `verbose` - Everything

## Quick Status Checklist

- [ ] Backend process running? → Check `Get-Process node`
- [ ] Port 3000 listening? → Check `netstat -ano | findstr :3000`
- [ ] Health endpoint responds? → `curl http://localhost:3000/api/health`
- [ ] Swagger UI loads? → `http://localhost:3000/api/docs`
- [ ] MongoDB connected? → Check health endpoint `database.status`
- [ ] Logs showing? → Check terminal output
- [ ] No errors in logs? → Look for `[ERROR]` messages

## Next Steps

- [Database Connection Troubleshooting](./database-connection-troubleshooting.md)
- [Environment Variables](./env-variables.md)
- [Startup Checklist](../apps/backend/STARTUP_CHECKLIST.md)

