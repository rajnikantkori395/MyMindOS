# Quick Fix: Database Connection

## Current Error
```
MongoServerError: bad auth : Authentication failed.
code: 8000 (AtlasError)
```

## Immediate Fix

### Step 1: Check Your Current Connection String

Open `apps/backend/.env` and find:
```env
MONGO_URI=...
```

### Step 2: Choose Your Solution

#### A. Fix Atlas Connection (If using MongoDB Atlas)

1. **Get new connection string from Atlas:**
   - Login to [cloud.mongodb.com](https://cloud.mongodb.com)
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

2. **Update `.env`:**
   ```env
   MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster.mongodb.net/mymindos?retryWrites=true&w=majority
   ```

3. **Check Network Access:**
   - Go to Atlas → Network Access
   - Add your IP or use `0.0.0.0/0` for development

#### B. Use Local MongoDB (Easier)

1. **Update `.env`:**
   ```env
   MONGO_URI=mongodb://localhost:27017/mymindos
   ```

2. **Start MongoDB:**
   ```bash
   # Option 1: Docker (Recommended)
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   
   # Option 2: If MongoDB installed locally
   net start MongoDB
   ```

3. **Verify it's running:**
   ```bash
   netstat -ano | findstr :27017
   ```

### Step 3: Restart App

After updating `.env`, restart:
```bash
# Stop current process (Ctrl+C)
# Then restart
pnpm run dev:backend
```

### Step 4: Verify Connection

You should see:
```
[DatabaseModule] Connecting to MongoDB: mongodb://***@...
[DatabaseModule] MongoDB connected successfully
```

## Common Password Issues

If password has special characters, URL encode them:
- `@` → `%40`
- `#` → `%23`
- `%` → `%25`
- `&` → `%26`
- `+` → `%2B`
- `=` → `%3D`

Or use MongoDB Atlas connection string builder to generate it automatically.

## Still Having Issues?

1. Double-check username/password in Atlas Dashboard
2. Verify IP is whitelisted in Network Access
3. Check database name matches
4. Ensure cluster is running (not paused)

