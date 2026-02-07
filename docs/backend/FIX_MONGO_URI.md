# Fix MongoDB Connection String

## Current Issue

Your `MONGO_URI` is missing the database name and may have URL encoding issues.

**Current (Incorrect):**
```
MONGO_URI=mongodb+srv://rk_mongo_atlas:Rk@261996@cluster0.cmvlvjk.mongodb.net/
```

**Error:** `ENOTFOUND _mongodb._tcp.261996`

This happens because:
1. Missing database name at the end
2. Password contains `@` which conflicts with the URI format
3. Special characters in password need URL encoding

## Fix Steps

### Step 1: URL Encode Your Password

Your password `Rk@261996` contains `@` which needs to be encoded as `%40`.

**Password:** `Rk@261996`  
**Encoded:** `Rk%40261996`

### Step 2: Add Database Name

Add `/mymindos` (or your preferred database name) at the end.

### Step 3: Update .env File

**Correct Format:**
```env
MONGO_URI=mongodb+srv://rk_mongo_atlas:Rk%40261996@cluster0.cmvlvjk.mongodb.net/mymindos?retryWrites=true&w=majority
```

**Or use a different database name:**
```env
MONGO_URI=mongodb+srv://rk_mongo_atlas:Rk%40261996@cluster0.cmvlvjk.mongodb.net/mymindos?retryWrites=true&w=majority
```

## Quick Fix Script

Run this in PowerShell to generate the correct URI:

```powershell
$username = "rk_mongo_atlas"
$password = "Rk@261996"
$cluster = "cluster0.cmvlvjk.mongodb.net"
$database = "mymindos"

# URL encode password
$encodedPassword = [System.Web.HttpUtility]::UrlEncode($password)

# Build URI
$mongoUri = "mongodb+srv://${username}:${encodedPassword}@${cluster}/${database}?retryWrites=true&w=majority"

Write-Host "MONGO_URI=$mongoUri" -ForegroundColor Green
```

## Manual Encoding Reference

Common special characters in passwords:
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`
- `+` → `%2B`
- `=` → `%3D`
- `?` → `%3F`

## Verify Connection

After updating `.env`, restart the backend:

```bash
pnpm run dev:backend
```

Look for:
```
[INFO] DatabaseModule: MongoDB connected successfully
```

## Alternative: Use Local MongoDB

If you prefer local MongoDB for development:

```env
MONGO_URI=mongodb://localhost:27017/mymindos
```

Then start MongoDB:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## Test Connection String

You can test the connection string directly:

```bash
# Using mongosh (if installed)
mongosh "mongodb+srv://rk_mongo_atlas:Rk%40261996@cluster0.cmvlvjk.mongodb.net/mymindos"
```

## Next Steps

1. Update `.env` with correct `MONGO_URI`
2. Restart backend: `pnpm run dev:backend`
3. Check status: `http://localhost:3000/api/health`
4. Verify database status shows `"status": "connected"`

See [Checking Backend Status](checking-backend-status.md) for more details.

