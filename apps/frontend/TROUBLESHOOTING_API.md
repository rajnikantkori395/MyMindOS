# Frontend API Troubleshooting Guide

## "Failed to fetch" Error

This error typically means the frontend cannot reach the backend API. Here's how to fix it:

### Step 1: Verify Backend is Running

Check if your backend is running:

```bash
# Check backend logs - should show:
# "Application is running on: http://localhost:XXXX/api"
```

Or test the backend directly:
```bash
curl http://localhost:4000/api/health
```

### Step 2: Check API URL Configuration

The frontend needs to know where the backend is running.

**Option A: Create Environment File (Recommended)**

Create `apps/frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

**Important**: 
- Replace `4000` with your actual backend port
- Must include `/api` prefix
- Must use `http://` or `https://` (not relative URLs)

**Option B: Check Current Configuration**

The default is set in `apps/frontend/config/api.config.ts`:
```typescript
baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
```

### Step 3: Verify Ports Match

- **Backend Port**: Check what port your backend is running on (default: 3000 or 4000)
- **Frontend Port**: Usually 3000 or 3001
- **API URL**: Must match backend port

Example:
- Backend on port 4000 → `NEXT_PUBLIC_API_URL=http://localhost:4000/api`
- Backend on port 3000 → `NEXT_PUBLIC_API_URL=http://localhost:3000/api`

### Step 4: Restart Frontend

After changing environment variables, restart the frontend:

```bash
# Stop frontend (Ctrl+C)
# Then restart:
pnpm run dev:frontend
```

### Step 5: Check Browser Console

Open browser DevTools (F12) → Console tab:

1. Look for the actual error message
2. Check Network tab → see if request is being made
3. Check if request URL is correct

### Step 6: Verify CORS

If you see CORS errors in console:

1. Check backend CORS configuration allows your frontend origin
2. Backend should allow: `http://localhost:3000` (or your frontend port)
3. Restart backend after CORS changes

## Common Issues

### Issue: "URL scheme must be 'http' or 'https'"

**Cause**: API URL is malformed or relative

**Solution**:
- Use absolute URL: `http://localhost:4000/api`
- Don't use relative URLs like `/api` or `//localhost:4000/api`
- Ensure URL starts with `http://` or `https://`

### Issue: "Network Failure"

**Causes**:
1. Backend not running
2. Wrong port in API URL
3. Firewall blocking connection

**Solution**:
1. Start backend: `pnpm run dev:backend`
2. Verify backend port matches API URL
3. Test backend directly with curl

### Issue: "CORS Error"

**Causes**:
1. Backend CORS not configured for frontend origin
2. Backend not restarted after CORS changes

**Solution**:
1. Check backend CORS allows your frontend origin
2. Restart backend
3. Clear browser cache (Ctrl+Shift+R)

## Quick Checklist

- [ ] Backend is running (`pnpm run dev:backend`)
- [ ] Backend port matches API URL port
- [ ] `apps/frontend/.env.local` exists with correct `NEXT_PUBLIC_API_URL`
- [ ] API URL includes `/api` prefix
- [ ] API URL uses `http://` or `https://` (not relative)
- [ ] Frontend restarted after changing `.env.local`
- [ ] Browser cache cleared (Ctrl+Shift+R)
- [ ] CORS allows frontend origin

## Testing

### Test 1: Backend Health Check
```bash
curl http://localhost:4000/api/health
```

### Test 2: Backend Login (from terminal)
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@mymindos.com","password":"Password123!"}'
```

### Test 3: Check Frontend API Config
Open browser console and check:
```javascript
// Should show your API URL
console.log(process.env.NEXT_PUBLIC_API_URL)
```

## Still Not Working?

1. **Check Backend Logs**: Look for CORS errors or connection issues
2. **Check Browser Network Tab**: See the actual request URL and response
3. **Verify Environment Variable**: Make sure `NEXT_PUBLIC_API_URL` is set correctly
4. **Try Swagger UI**: Test API directly at `http://localhost:4000/api/docs`

## Example Working Configuration

**Backend `.env`:**
```env
PORT=4000
FRONTEND_URL=http://localhost:3000
```

**Frontend `.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

**Result**: Frontend on `http://localhost:3000` can call backend on `http://localhost:4000/api`
