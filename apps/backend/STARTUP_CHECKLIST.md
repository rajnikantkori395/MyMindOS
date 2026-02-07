# Startup Checklist

## ✅ Pre-Startup Verification

### 1. Dependencies Installed
```bash
pnpm install
```
✅ All dependencies are in `package.json` and installed

### 2. Environment File
- [ ] `.env` file exists at `apps/backend/.env`
- [ ] Contains required variables (see below)

### 3. Required Environment Variables

**Minimum Required:**
```env
MONGO_URI=mongodb://localhost:27017/mymindos
JWT_ACCESS_SECRET=<generate-strong-secret>
JWT_REFRESH_SECRET=<generate-strong-secret>
```

**Recommended:**
```env
NODE_ENV=development
PORT=3000
LOG_LEVEL=info
```

### 4. MongoDB Status

**Option A: Local MongoDB**
- [ ] MongoDB running on port 27017
- [ ] Connection string: `mongodb://localhost:27017/mymindos`

**Option B: MongoDB Atlas**
- [ ] Correct connection string in `.env`
- [ ] IP whitelisted in Atlas Network Access
- [ ] Username/password correct

### 5. Build Status
```bash
pnpm --filter backend build
```
✅ Should compile without errors

## 🚀 Starting the App

### Step 1: Verify .env File
```bash
# Check if .env exists
Test-Path apps\backend\.env

# View MONGO_URI (masked)
Get-Content apps\backend\.env | Select-String "MONGO_URI"
```

### Step 2: Generate JWT Secrets (if needed)
```bash
node -e "console.log('JWT_ACCESS_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('JWT_REFRESH_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
```

### Step 3: Start MongoDB (if using local)
```bash
# Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or if installed
net start MongoDB
```

### Step 4: Start Backend
```bash
pnpm run dev:backend
```

## ✅ Success Indicators

You should see:
1. ✅ Compilation successful
2. ✅ All modules initialized
3. ✅ `[DatabaseModule] Connecting to MongoDB...`
4. ✅ `[DatabaseModule] MongoDB connected successfully`
5. ✅ `Application is running on: http://localhost:3000/api`

## ❌ Common Issues

### MongoDB Connection Failed
- Check MongoDB is running
- Verify `MONGO_URI` in `.env`
- For Atlas: Check credentials and IP whitelist

### Missing Dependencies
- Run `pnpm install`
- Check `package.json` has all required packages

### Port Already in Use
- Change `PORT` in `.env`
- Or stop other service on port 3000

