# Troubleshooting Guide

## API Endpoint Not Found (404)

### Problem
When making API requests, you get a 404 error or Next.js 404 page instead of API responses.

### Solution

#### Option 1: Ensure Backend is Running

1. **Check if backend is running:**
   ```bash
   # Check if port 3000 is in use
   netstat -ano | findstr :3000
   
   # Or use the check script
   pnpm --filter backend check-status
   ```

2. **Start the backend:**
   ```bash
   pnpm run dev:backend
   ```

   You should see:
   ```
   Application is running on: http://localhost:3000/api
   ```

#### Option 2: Use Correct Backend Port

The backend runs on port **3000** by default. Make sure your API requests go to:
- `http://localhost:3000/api/auth/login` (Backend - NestJS)
- NOT `http://localhost:3001/api/auth/login` (Frontend - Next.js)

#### Option 3: Test Backend Directly

Test the backend API directly with curl:

```bash
# Windows PowerShell
curl http://localhost:3000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"superadmin@mymindos.com\",\"password\":\"Password123!\"}'

# Or use the correct email (note: no double 'i' in mymindos)
curl http://localhost:3000/api/auth/login `
  -H "Content-Type: application/json" `
  -d "{\"email\":\"superadmin@mymindos.com\",\"password\":\"Password123!\"}"
```

**Important:** The email in your curl command has a typo:
- ❌ Wrong: `superadmin@mymiindos.com` (double 'i')
- ✅ Correct: `superadmin@mymindos.com`

#### Option 4: Check Environment Variables

1. **Backend `.env`:**
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/mymindos
   JWT_ACCESS_SECRET=your-secret
   JWT_REFRESH_SECRET=your-secret
   ```

2. **Frontend `.env.local`:**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   BACKEND_URL=http://localhost:3000
   ```

## Common Issues

### 1. Port Already in Use

**Error:** `EADDRINUSE: address already in use :::3000`

**Solution:**
```bash
# Kill process on port 3000
pnpm --filter backend kill-port 3000

# Or use the clear script
pnpm --filter backend clear-all-ports
```

### 2. Database Connection Failed

**Error:** `MongoServerError: bad auth` or connection timeout

**Solution:**
- Check MongoDB is running: `docker ps` (if using Docker)
- Verify `MONGO_URI` in `.env` is correct
- See `docs/backend/database-connection-troubleshooting.md`

### 3. Users Not Found

**Error:** `Invalid credentials` when logging in

**Solution:**
1. Run the seeder to create initial users:
   ```bash
   pnpm --filter backend seed
   ```

2. Use the correct credentials:
   - Email: `superadmin@mymindos.com`
   - Password: `Password123!`

### 4. CORS Errors

**Error:** `Access to fetch at 'http://localhost:3000/api' from origin 'http://localhost:3001' has been blocked by CORS policy`

**Solution:**
- Check `FRONTEND_URL` in backend `.env` matches your frontend URL
- Default: `FRONTEND_URL=http://localhost:3001`

## Testing API Endpoints

### Using Swagger UI

1. Start the backend
2. Open: `http://localhost:3000/api/docs`
3. Test endpoints directly in the browser

### Using curl

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"superadmin@mymindos.com\",\"password\":\"Password123!\"}"

# Get current user (requires token)
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Using Postman/Insomnia

1. Base URL: `http://localhost:3000/api`
2. For authenticated requests, add header:
   ```
   Authorization: Bearer YOUR_ACCESS_TOKEN
   ```

## Verification Checklist

- [ ] Backend is running on port 3000
- [ ] MongoDB is running and connected
- [ ] Users are seeded (`pnpm --filter backend seed`)
- [ ] Environment variables are set correctly
- [ ] No port conflicts
- [ ] Email/password are correct (no typos)

## Getting Help

1. Check backend logs: Look at the terminal where `pnpm run dev:backend` is running
2. Check Swagger docs: `http://localhost:3000/api/docs`
3. Review documentation:
   - `docs/backend/README.md`
   - `apps/backend/STARTUP_CHECKLIST.md`
   - `docs/backend/database-connection-troubleshooting.md`
