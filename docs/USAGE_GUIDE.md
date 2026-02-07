# MyMindOS - Complete Usage Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Authentication](#authentication)
3. [File Management](#file-management)
4. [Memory Management](#memory-management)
5. [Chat Interface](#chat-interface)
6. [Task Management](#task-management)
7. [Profile Management](#profile-management)
8. [API Documentation](#api-documentation)
9. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Prerequisites
- Node.js 18+ and pnpm installed
- MongoDB running (local or Atlas)
- MinIO running (for file storage) - optional, can use S3
- Backend and Frontend servers running

### Initial Setup

1. **Clone and Install**
   ```bash
   pnpm install
   ```

2. **Configure Environment**
   - Backend: Copy `apps/backend/.env.example` to `apps/backend/.env`
   - Frontend: Copy `apps/frontend/.env.example` to `apps/frontend/.env.local`
   - Set required environment variables (see [Environment Variables Guide](backend/env-variables.md))

3. **Start Services**
   ```bash
   # Start MongoDB and MinIO (if using Docker)
   docker-compose -f infra/docker/docker-compose.yml up -d

   # Start backend
   pnpm run dev:backend

   # Start frontend (in another terminal)
   pnpm run dev:frontend
   ```

4. **Seed Initial Data**
   ```bash
   pnpm --filter backend seed
   ```

5. **Access Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000/api
   - Swagger UI: http://localhost:4000/api/docs

---

## Authentication

### Login Credentials

After seeding, use these credentials:

| Email | Password | Role |
|-------|----------|------|
| `superadmin@mymindos.com` | `Password123!` | SUPERADMIN |
| `admin@mymindos.com` | `Password123!` | ADMIN |
| `test@mymindos.com` | `Password123!` | USER |

### Login Process

1. Navigate to http://localhost:3000/signin
2. Enter email and password
3. Click "Sign in"
4. You'll be redirected to the dashboard

### Registration

1. Navigate to http://localhost:3000/signup
2. Fill in name, email, and password
3. Click "Sign up"
4. You'll be automatically logged in

---

## File Management

### Upload Files

1. Navigate to **Files** from dashboard
2. Click "Choose File" and select a file
3. Click "Upload File"
4. File will appear in your file list

**Supported File Types:**
- Documents: PDF, Word, Excel, PowerPoint, Text, Markdown, CSV
- Images: JPEG, PNG, GIF, WebP, SVG
- Audio: MP3, WAV, OGG, WebM
- Video: MP4, WebM, OGG
- Archives: ZIP, TAR, GZIP

**File Size Limits:**
- Max file size: 100 MB
- Max image: 10 MB
- Max document: 50 MB
- Max audio: 100 MB
- Max video: 500 MB

### View Files

- All uploaded files are listed on the Files page
- View file details: filename, size, type, status
- Check storage usage at the top of the page

### Download Files

1. Click "Download" button next to any file
2. File will open in a new tab/window

### Delete Files

1. Click "Delete" button next to any file
2. Confirm deletion
3. File is soft-deleted (can be recovered from database)

---

## Memory Management

### Create Memory

1. Navigate to **Memories** from dashboard
2. Click "Create Memory"
3. Fill in:
   - **Title**: Memory title
   - **Content**: Memory content/text
   - **Tags**: Comma-separated tags (optional)
4. Click "Create Memory"

### Search Memories

1. Use the search box at the top
2. Enter keywords
3. Click "Search" or press Enter
4. Results show matching memories

### Memory Types

- **File**: Extracted from uploaded files
- **Note**: User-created notes
- **Chat**: From chat conversations
- **Task**: Task-related memories
- **Event**: Event-related memories
- **Contact**: Contact information
- **Bookmark**: Bookmarked content

### Link Memories

Memories can be linked to show relationships:
- Related memories
- Parent/child relationships
- References
- Similar content

---

## Chat Interface

### Start New Chat

1. Navigate to **Chat** from dashboard
2. Click "New Chat"
3. Start typing messages
4. AI will respond (requires AI provider configuration)

### Chat Features

- **Message History**: All messages are saved
- **Multiple Chats**: Create and switch between chats
- **AI Responses**: Get AI-powered responses based on your memories

### AI Configuration

To enable AI chat responses, configure AI provider in `apps/backend/.env`:

```env
OPENAI_API_KEY=your-openai-key
# OR
ANTHROPIC_API_KEY=your-anthropic-key
# OR
OLLAMA_BASE_URL=http://localhost:11434
```

---

## Task Management

### Create Task

1. Navigate to **Tasks** from dashboard
2. Click "New Task"
3. Fill in:
   - **Title**: Task title (required)
   - **Description**: Task description (optional)
   - **Due Date**: Due date (optional)
4. Click "Create Task"

### Task Status

- **Pending**: Not started
- **In Progress**: Currently working on
- **Completed**: Finished
- **Cancelled**: Cancelled

### Manage Tasks

- **Complete**: Click "Complete" to mark as done
- **Reopen**: Click "Reopen" to mark as pending again
- **Delete**: Click "Delete" to remove task

### Filter Tasks

- Filter by status (pending, in_progress, completed, cancelled)
- Filter by tags
- View all tasks in one list

---

## Profile Management

### View Profile

1. Navigate to **Profile** from dashboard
2. View your account information:
   - Name
   - Email
   - Role
   - Status

### Edit Profile

1. Click "Edit Profile"
2. Update name and/or email
3. Click "Save Changes"
4. Changes are saved immediately

---

## API Documentation

### Swagger UI

Access interactive API documentation at:
- **URL**: http://localhost:4000/api/docs
- **Features**:
  - Browse all endpoints
  - Test API calls directly
  - View request/response schemas
  - Authenticate with JWT token

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

#### Files
- `POST /api/files/upload` - Upload file
- `POST /api/files/presigned-url` - Get presigned upload URL
- `GET /api/files` - List files
- `GET /api/files/:id` - Get file by ID
- `GET /api/files/:id/download` - Get download URL
- `DELETE /api/files/:id` - Delete file
- `GET /api/files/storage/usage` - Get storage usage

#### Memories
- `POST /api/memories` - Create memory
- `GET /api/memories` - List memories
- `GET /api/memories/:id` - Get memory by ID
- `PUT /api/memories/:id` - Update memory
- `DELETE /api/memories/:id` - Delete memory
- `POST /api/memories/search` - Text search
- `POST /api/memories/search/semantic` - Semantic search
- `POST /api/memories/search/hybrid` - Hybrid search

#### Chat
- `POST /api/chat` - Create chat
- `GET /api/chat` - List chats
- `GET /api/chat/:id` - Get chat by ID
- `POST /api/chat/:id/message` - Send message
- `DELETE /api/chat/:id` - Delete chat

#### Tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks` - List tasks
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

#### Analytics
- `GET /api/analytics/stats` - Get user statistics

---

## Troubleshooting

### Common Issues

#### 1. CORS Errors
**Problem**: "Failed to fetch" or CORS errors in browser console

**Solution**:
- Check backend is running on port 4000
- Check frontend origin is in allowedOrigins (localhost:3000, localhost:3001)
- Check backend logs for CORS blocked origin messages
- See [CORS Troubleshooting Guide](backend/README.md#cors-configuration)

#### 2. File Upload Fails
**Problem**: File upload returns error

**Solution**:
- Check file size (max 100MB)
- Check file type is allowed
- Check MinIO/S3 is running and configured
- Check storage environment variables
- See [File Upload Fix Guide](backend/FIX_FILE_UPLOAD.md)

#### 3. Database Connection Issues
**Problem**: "MongoServerError" or connection timeout

**Solution**:
- Check MongoDB is running
- Verify MONGO_URI in `.env` is correct
- Check network connectivity
- See [Database Troubleshooting Guide](backend/database-connection-troubleshooting.md)

#### 4. Authentication Issues
**Problem**: "Invalid credentials" or token errors

**Solution**:
- Verify email spelling (check for typos like `mymiindos` vs `mymindos`)
- Check JWT secrets are set in `.env`
- Verify user exists in database (run seeder)
- Check token expiration settings

#### 5. AI Features Not Working
**Problem**: Chat returns placeholder responses

**Solution**:
- Configure AI provider API keys in `.env`:
  ```env
  OPENAI_API_KEY=your-key
  # OR
  ANTHROPIC_API_KEY=your-key
  # OR
  OLLAMA_BASE_URL=http://localhost:11434
  ```
- Restart backend after adding keys
- Check AI provider service is accessible

### Getting Help

1. **Check Logs**:
   - Backend: Terminal where `pnpm run dev:backend` is running
   - Frontend: Browser console (F12)

2. **Check Documentation**:
   - [Backend Documentation](backend/README.md)
   - [Frontend Documentation](frontend/README.md)
   - [API Documentation](api/README.md)
   - [Module Documentation](modules/README.md)

3. **Check Status**:
   - Backend health: http://localhost:4000/api/health
   - Swagger UI: http://localhost:4000/api/docs

---

## Quick Reference

### Default URLs
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000/api
- Swagger UI: http://localhost:4000/api/docs
- MinIO Console: http://localhost:9001 (if using local MinIO)

### Default Credentials
- Email: `superadmin@mymindos.com`
- Password: `Password123!`

### Environment Files
- Backend: `apps/backend/.env`
- Frontend: `apps/frontend/.env.local`

### Key Commands
```bash
# Install dependencies
pnpm install

# Start backend
pnpm run dev:backend

# Start frontend
pnpm run dev:frontend

# Seed database
pnpm --filter backend seed

# Build backend
pnpm --filter backend build

# Build frontend
pnpm --filter frontend build
```

---

## Next Steps

1. **Configure AI Providers**: Add API keys for AI features
2. **Set Up Storage**: Configure S3 or MinIO for file storage
3. **Customize**: Modify settings, themes, and preferences
4. **Explore**: Try all features and integrate with your workflow

For detailed module documentation, see [Modules Documentation](modules/README.md).
