# MyMindOS - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
pnpm install
```

### Step 2: Start Services
```bash
# Start MongoDB and MinIO
docker-compose -f infra/docker/docker-compose.yml up -d

# Start backend (terminal 1)
pnpm run dev:backend

# Start frontend (terminal 2)
pnpm run dev:frontend
```

### Step 3: Seed Database
```bash
# In a new terminal
pnpm --filter backend seed
```

### Step 4: Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000/api
- **Swagger UI**: http://localhost:4000/api/docs

### Step 5: Login
- **Email**: `superadmin@mymindos.com`
- **Password**: `Password123!`

---

## 📋 What's Available

### ✅ Fully Implemented Modules

1. **Authentication** - Login, register, JWT tokens
2. **User Management** - Profile, roles, status
3. **File Management** - Upload, download, storage
4. **Memory Management** - Create, search, organize knowledge
5. **Chat Interface** - AI-powered conversations
6. **Task Management** - Create, track, complete tasks
7. **Analytics** - Usage statistics and metrics

### 📚 Documentation

- **[Complete Usage Guide](docs/USAGE_GUIDE.md)** - Full user guide
- **[API Documentation](docs/api/README.md)** - API reference
- **[Module Documentation](docs/modules/README.md)** - Module details
- **[Troubleshooting](apps/backend/TROUBLESHOOTING.md)** - Common issues

---

## 🎯 Next Steps

1. **Explore the Dashboard** - Navigate to all modules
2. **Upload Files** - Test file upload functionality
3. **Create Memories** - Add knowledge to your system
4. **Start a Chat** - Try the AI chat interface
5. **Manage Tasks** - Create and track tasks

---

## ⚙️ Configuration

### Minimum Required (`.env` files)

**Backend** (`apps/backend/.env`):
```env
MONGO_URI=mongodb://localhost:27017/mymindos
JWT_ACCESS_SECRET=your-secret-min-32-chars
JWT_REFRESH_SECRET=your-secret-min-32-chars
```

**Frontend** (`apps/frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### Optional (for full features)

- **File Storage**: Configure S3/MinIO for file uploads
- **AI Features**: Add OpenAI/Anthropic API keys for AI chat

---

## 🆘 Need Help?

- Check [Usage Guide](docs/USAGE_GUIDE.md) for detailed instructions
- Check [Troubleshooting Guide](apps/backend/TROUBLESHOOTING.md) for common issues
- Check backend logs for error messages
- Check browser console (F12) for frontend errors

---

**Ready to go!** 🎉
