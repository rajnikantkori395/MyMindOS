# Fix CORS and API Configuration Issues

## Problem

You're getting:
1. **CORS Error**: `Access-Control-Allow-Origin` header has value 'http://localhost:3001' but origin is 'http://localhost:3000'
2. **404 Error**: `Cannot POST /auth/login` - The URL is missing the `/api` prefix

## Root Causes

1. **Frontend environment variable** might be set to wrong port or missing `/api`
2. **Backend not restarted** with new CORS configuration
3. **Backend running on different port** than expected

## Solution

### Step 1: Check/Create Frontend Environment File

Create or update `apps/frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

**Important**: 
- Port should match your backend port (3000 or 4000)
- Must include `/api` prefix
- Restart frontend dev server after changing

### Step 2: Check Backend Port

Check what port your backend is running on:

```bash
# Check backend logs - should show:
# "Application is running on: http://localhost:XXXX/api"
```

Or check `apps/backend/.env`:
```env
PORT=3000
```

### Step 3: Update Frontend Environment Variable

If backend is on port **4000**, update `apps/frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

If backend is on port **3000**, use:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Step 4: Restart Both Servers

**Backend:**
```bash
# Stop current backend (Ctrl+C)
# Then restart:
pnpm run dev:backend
```

**Frontend:**
```bash
# Stop current frontend (Ctrl+C)
# Then restart:
pnpm run dev:frontend
```

### Step 5: Verify CORS Configuration

The backend CORS now allows:
- `http://localhost:3000` ✅
- `http://localhost:3001` ✅
- `http://localhost:3002` ✅
- Any URL in `FRONTEND_URL` env variable

If your backend is on port 4000, make sure `FRONTEND_URL` is set in backend `.env`:
```env
FRONTEND_URL=http://localhost:3000
```

## Quick Fix Checklist

- [ ] Created `apps/frontend/.env.local` with correct `NEXT_PUBLIC_API_URL`
- [ ] URL includes `/api` prefix: `http://localhost:XXXX/api`
- [ ] Port matches backend port (check backend logs)
- [ ] Restarted frontend dev server
- [ ] Restarted backend dev server
- [ ] Cleared browser cache (Ctrl+Shift+R)

## Testing

After fixing, test the login:

1. Open browser DevTools → Network tab
2. Try to login
3. Check the request URL - should be:
   - `http://localhost:3000/api/auth/login` OR
   - `http://localhost:4000/api/auth/login`
4. Should NOT be:
   - ❌ `http://localhost:4000/auth/login` (missing `/api`)
   - ❌ `http://localhost:3000/auth/login` (missing `/api`)

## Common Issues

### Issue: Still getting CORS error after restart

**Solution**: 
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Check backend logs to confirm CORS config loaded
- Verify `FRONTEND_URL` in backend `.env` matches frontend origin

### Issue: 404 on `/auth/login`

**Solution**:
- Check URL includes `/api` prefix
- Verify backend is running
- Check backend logs for "Application is running on..."

### Issue: Backend on different port

**Solution**:
- Update `NEXT_PUBLIC_API_URL` in frontend `.env.local`
- Update `FRONTEND_URL` in backend `.env` if needed
- Restart both servers
