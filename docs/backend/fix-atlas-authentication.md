# Fix MongoDB Atlas Authentication Error

## Current Error

```
MongoServerError: bad auth : Authentication failed.
code: 8000
codeName: 'AtlasError'
```

This means your MongoDB Atlas connection string has incorrect credentials.

## Solutions

### Option 1: Fix Atlas Connection String (Recommended if using Atlas)

1. **Get correct connection string from MongoDB Atlas:**
   - Go to [MongoDB Atlas Dashboard](https://cloud.mongodb.com)
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

2. **Update your `.env` file:**
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/mymindos?retryWrites=true&w=majority
   ```

3. **Important checks:**
   - ✅ Username is correct
   - ✅ Password is correct (no special characters need URL encoding)
   - ✅ Database name is correct
   - ✅ IP address is whitelisted in Atlas Network Access

4. **URL encode special characters in password:**
   - If password has `@`, `#`, `%`, etc., encode them:
   - `@` → `%40`
   - `#` → `%23`
   - `%` → `%25`
   - Or use MongoDB Atlas connection string builder

### Option 2: Use Local MongoDB (Easier for Development)

1. **Update `.env` to use local MongoDB:**
   ```env
   MONGO_URI=mongodb://localhost:27017/mymindos
   ```

2. **Start local MongoDB:**
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   
   # Or if MongoDB is installed locally
   net start MongoDB
   ```

3. **No authentication needed for local MongoDB** (default setup)

## Quick Fix Steps

### For MongoDB Atlas:

1. **Check your current connection string:**
   ```bash
   # Check what's in your .env (masked)
   type apps\backend\.env | findstr MONGO_URI
   ```

2. **Verify in Atlas Dashboard:**
   - Database Access → Check username exists
   - Network Access → Whitelist your IP (or use 0.0.0.0/0 for development)
   - Clusters → Get connection string

3. **Update `.env` file:**
   - Open `apps/backend/.env`
   - Replace `MONGO_URI` with correct connection string
   - Save and restart app

### For Local MongoDB:

1. **Update `.env`:**
   ```env
   MONGO_URI=mongodb://localhost:27017/mymindos
   ```

2. **Start MongoDB:**
   ```bash
   # Check if running
   netstat -ano | findstr :27017
   
   # Start if not running
   net start MongoDB
   # OR
   docker start mongodb
   ```

3. **Restart app**

## Connection String Formats

### MongoDB Atlas (with auth):
```
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

### Local MongoDB (no auth):
```
mongodb://localhost:27017/mymindos
```

### Local MongoDB (with auth):
```
mongodb://username:password@localhost:27017/mymindos?authSource=admin
```

## Common Issues

### Issue 1: Password has special characters
**Solution:** URL encode special characters or use Atlas connection string builder

### Issue 2: IP not whitelisted
**Solution:** Go to Atlas → Network Access → Add IP Address (or 0.0.0.0/0 for dev)

### Issue 3: Wrong database name
**Solution:** Check database name in connection string matches Atlas database

### Issue 4: User doesn't have permissions
**Solution:** Go to Atlas → Database Access → Edit user → Ensure "Read and write to any database"

## Test Connection

After updating `.env`, restart the app and you should see:

**✅ Success:**
```
[DatabaseModule] Connecting to MongoDB: mongodb+srv://***@cluster.mongodb.net/mymindos
[DatabaseModule] MongoDB connected successfully
```

**❌ Still failing:**
- Double-check username/password
- Verify IP is whitelisted
- Check database name
- Ensure cluster is running in Atlas

