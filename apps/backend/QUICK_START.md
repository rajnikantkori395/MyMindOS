# Quick Start Guide

## The Problem

You're getting a 404 error when trying to access the API because:
1. The **backend (NestJS)** needs to be running on port 3000
2. Your curl request is hitting the frontend (Next.js) instead of the backend

## Solution

### Step 1: Start the Backend

```bash
# From project root
pnpm run dev:backend

# Or from apps/backend
pnpm --filter backend start:dev
```

**Expected output:**
```
Application is running on: http://localhost:3000/api
MongoDB connected successfully
```

### Step 2: Verify Backend is Running

Open in browser: `http://localhost:3000/api/docs` (Swagger UI)

Or test with curl:
```bash
curl http://localhost:3000/api/health
```

### Step 3: Seed Users (If Not Done)

```bash
pnpm --filter backend seed
```

This creates:
- `superadmin@mymindos.com` (Password: `Password123!`)
- `admin@mymindos.com` (Password: `Password123!`)
- `test@mymindos.com` (Password: `Password123!`)

### Step 4: Test Login

**Important:** Fix the email typo in your curl command:
- ❌ Wrong: `superadmin@mymiindos.com` (has double 'i')
- ✅ Correct: `superadmin@mymindos.com`

**Windows PowerShell:**
```powershell
curl http://localhost:3000/api/auth/login `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"email":"superadmin@mymindos.com","password":"Password123!"}'
```

**Windows CMD:**
```cmd
curl http://localhost:3000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"superadmin@mymindos.com\",\"password\":\"Password123!\"}"
```

**Expected Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 900,
  "user": {
    "id": "...",
    "email": "superadmin@mymindos.com",
    "name": "Super Administrator",
    "role": "superadmin"
  }
}
```

## Port Configuration

- **Backend (NestJS):** Port 3000 → `http://localhost:3000/api`
- **Frontend (Next.js):** Port 3001 → `http://localhost:3001` (default)

If both try to use port 3000, you'll get conflicts. The frontend should run on a different port.

## Troubleshooting

### Backend Not Starting

1. **Check MongoDB:**
   ```bash
   # If using Docker
   docker ps | findstr mongo
   
   # If not running
   docker-compose -f infra/docker/docker-compose.yml up -d mongodb
   ```

2. **Check Environment Variables:**
   - `apps/backend/.env` exists
   - `MONGO_URI` is set correctly
   - `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` are set

3. **Check Port:**
   ```bash
   # Kill process on port 3000 if needed
   pnpm --filter backend kill-port 3000
   ```

### Still Getting 404?

1. **Verify backend is actually running:**
   - Check terminal output for "Application is running on..."
   - Visit `http://localhost:3000/api/docs` in browser

2. **Check the URL:**
   - ✅ Correct: `http://localhost:3000/api/auth/login`
   - ❌ Wrong: `http://localhost:3001/api/auth/login` (frontend port)

3. **Check email/password:**
   - Email: `superadmin@mymindos.com` (not `mymiindos`)
   - Password: `Password123!` (case sensitive)

## Next Steps

Once the backend is running and you can login:
1. Start the frontend: `pnpm run dev:frontend`
2. Open `http://localhost:3001` in browser
3. Login with seeded credentials
