# Debug Frontend API Issues

## Quick Debug Steps

### 1. Check Browser Console

Open browser DevTools (F12) → Console tab. You should see:

```
API Configuration: {
  baseURL: "http://localhost:4000/api",
  envVar: "http://localhost:4000/api" or undefined,
  currentOrigin: "http://localhost:3000"
}
```

### 2. Check Network Tab

1. Open DevTools → Network tab
2. Try to login
3. Look for the request to `/api/auth/login`
4. Check:
   - **Request URL**: Should be `http://localhost:4000/api/auth/login`
   - **Status**: Should be 200 (success) or show error code
   - **CORS Error**: Look for red error with CORS message

### 3. Check Backend Logs

Look at your backend terminal. You should see:
- `CORS configuration` log showing allowed origins
- `CORS allowed origin` or `CORS blocked origin` messages

### 4. Verify Environment Variable

Check if `.env.local` exists in `apps/frontend/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

**Important**: 
- Must match your backend port
- Must include `/api` prefix
- Restart frontend after creating/changing this file

### 5. Common Issues

#### Issue: "Failed to fetch" with no details

**Check**:
1. Backend is running: `pnpm run dev:backend`
2. Backend port matches API URL port
3. `.env.local` file exists and is correct

#### Issue: CORS error in console

**Check backend logs** - you'll see:
```
CORS blocked origin: http://localhost:XXXX
```

**Solution**: 
- If frontend is on port 3000, it should already be allowed
- If on different port, add it to backend CORS or set `FRONTEND_URL` in backend `.env`

#### Issue: 404 Not Found

**Check**:
- API URL includes `/api` prefix
- Backend is running
- Request URL in Network tab is correct

## Expected Console Output

When API is configured correctly, you should see:

```
API Configuration: {
  baseURL: "http://localhost:4000/api",
  envVar: "http://localhost:4000/api",
  currentOrigin: "http://localhost:3000"
}
```

When login fails, you'll see detailed error:

```
🚨 API Request Failed: {
  url: "http://localhost:4000/api/auth/login",
  method: "POST",
  error: "...",
  frontendOrigin: "http://localhost:3000",
  backendURL: "http://localhost:4000/api"
}
```

## Quick Fix Checklist

- [ ] Backend is running (`pnpm run dev:backend`)
- [ ] Frontend is running (`pnpm run dev:frontend`)
- [ ] `.env.local` exists with correct `NEXT_PUBLIC_API_URL`
- [ ] API URL port matches backend port
- [ ] API URL includes `/api` prefix
- [ ] Frontend restarted after creating `.env.local`
- [ ] Browser console shows API configuration
- [ ] Network tab shows request being made
- [ ] Backend logs show CORS allowed/blocked messages
