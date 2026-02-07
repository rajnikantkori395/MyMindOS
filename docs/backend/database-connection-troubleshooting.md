# Database Connection Troubleshooting

Guide to diagnose and fix MongoDB connection issues in MyMindOS.

## Quick Diagnosis

### 1. Check if MongoDB is Running

**Local MongoDB:**
```bash
# Windows
netstat -ano | findstr :27017

# Check MongoDB service
sc query MongoDB
```

**MongoDB Atlas:**
- Verify cluster is running in Atlas dashboard
- Check network access (IP whitelist)
- Verify connection string is correct

### 2. Check Environment Variables

Verify `.env` file has correct MongoDB URI:

```env
MONGO_URI=mongodb://localhost:27017/mymindos
```

**For MongoDB Atlas:**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/mymindos?retryWrites=true&w=majority
```

### 3. Check Application Logs

When you start the app, look for:

**✅ Success:**
```
[DatabaseModule] Connecting to MongoDB: mongodb://***@localhost:27017/mymindos
[DatabaseModule] MongoDB connected successfully
```

**❌ Error:**
```
[DatabaseModule] MongoDB connection error
```

## Common Issues

### Issue 1: MongoDB Not Running

**Symptoms:**
- Connection timeout errors
- "ECONNREFUSED" errors
- App starts but database operations fail

**Solution:**
```bash
# Start MongoDB (Windows)
net start MongoDB

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Issue 2: Wrong Connection String

**Symptoms:**
- Authentication errors
- "Invalid connection string" errors

**Solution:**
- Check `.env` file has correct `MONGO_URI`
- For Atlas: Verify username, password, and cluster URL
- Ensure special characters in password are URL-encoded

### Issue 3: Network/Firewall Issues

**Symptoms:**
- Connection timeout
- "ENOTFOUND" errors

**Solution:**
- Check firewall allows MongoDB port (27017)
- For Atlas: Whitelist your IP address
- Check network connectivity

### Issue 4: Database Module Not Loading

**Symptoms:**
- No connection logs
- App starts but no database events

**Solution:**
- Verify `DatabaseModule` is imported in `AppModule`
- Check `ConfigModule` is loaded before `DatabaseModule`
- Verify `.env` file exists and is readable

## Testing Connection

### Manual Test

```bash
# Test MongoDB connection (if MongoDB shell installed)
mongo mongodb://localhost:27017/mymindos

# Or using mongosh
mongosh mongodb://localhost:27017/mymindos
```

### From Application

The app will automatically:
1. Log connection attempt on startup
2. Log success/error events
3. Show connection details in logs

## Connection String Formats

### Local MongoDB
```
mongodb://localhost:27017/mymindos
```

### MongoDB with Authentication
```
mongodb://username:password@localhost:27017/mymindos
```

### MongoDB Atlas
```
mongodb+srv://username:password@cluster.mongodb.net/mymindos?retryWrites=true&w=majority
```

### MongoDB with Options
```
mongodb://localhost:27017/mymindos?retryWrites=true&w=majority&authSource=admin
```

## Debug Steps

1. **Check .env file exists:**
   ```bash
   type apps\backend\.env
   ```

2. **Verify MONGO_URI is set:**
   ```bash
   type apps\backend\.env | findstr MONGO_URI
   ```

3. **Check MongoDB is accessible:**
   ```bash
   telnet localhost 27017
   ```

4. **Start app and watch logs:**
   ```bash
   pnpm run dev:backend
   ```
   Look for database connection messages

5. **Check MongoDB logs:**
   - Local: Check MongoDB log files
   - Atlas: Check Atlas dashboard for connection logs

## Expected Behavior

### On Successful Connection:
```
[DatabaseModule] Connecting to MongoDB: mongodb://***@localhost:27017/mymindos
[DatabaseModule] MongoDB connected successfully
  database: mymindos
  host: localhost
  port: 27017
```

### On Connection Error:
```
[DatabaseModule] Connecting to MongoDB: mongodb://***@localhost:27017/mymindos
[DatabaseModule] MongoDB connection error
  error: connect ECONNREFUSED 127.0.0.1:27017
  uri: mongodb://***@localhost:27017/mymindos
```

## Next Steps

If connection fails:
1. Verify MongoDB is running
2. Check connection string in `.env`
3. Test connection manually
4. Check firewall/network settings
5. Review application logs for specific error messages

