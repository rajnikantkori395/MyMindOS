# Environment Files Guide

Complete guide to all environment files you need to maintain in MyMindOS.

## Summary

**You need to maintain 2 environment files:**

1. **`apps/backend/.env`** - Backend configuration
2. **`apps/frontend/.env.local`** - Frontend configuration (Next.js convention)

---

## File Structure

```
MyMindOS/
├── apps/
│   ├── backend/
│   │   ├── .env              ← Backend environment variables (YOU CREATE)
│   │   └── .env.example      ← Template (already exists)
│   └── frontend/
│       ├── .env.local        ← Frontend environment variables (YOU CREATE)
│       └── .env.local.example ← Template (already exists)
```

---

## 1. Backend Environment File

### File Name: `apps/backend/.env`

**Location:** `apps/backend/.env`

**Purpose:** All backend configuration (database, JWT, logging, etc.)

**How to create:**
```bash
# Copy from template
copy apps\backend\.env.example apps\backend\.env

# Then edit with your values
```

**Contains:**
- Database connection (MongoDB)
- JWT secrets
- Logging configuration
- New Relic APM (optional)
- File storage (S3/MinIO)
- AI provider keys
- Vector database config

**Example:**
```env
NODE_ENV=development
PORT=3000
MONGO_URI=mongodb://localhost:27017/mymindos
JWT_ACCESS_SECRET=your-secret
JWT_REFRESH_SECRET=your-refresh-secret
LOG_LEVEL=info
NEW_RELIC_ENABLED=false
```

**⚠️ Important:**
- This file is **NOT** committed to git (in `.gitignore`)
- Contains sensitive data (secrets, API keys)
- Must be created manually from `.env.example`

---

## 2. Frontend Environment File

### File Name: `apps/frontend/.env.local`

**Location:** `apps/frontend/.env.local`

**Purpose:** Frontend configuration (API URLs, public keys, etc.)

**How to create:**
```bash
# Copy from template
copy apps\frontend\.env.local.example apps\frontend\.env.local

# Then edit with your values
```

**Contains:**
- Backend API URL
- Public API keys (if any)
- Analytics keys
- Feature flags

**Example:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_NAME=MyMindOS
NEXT_PUBLIC_SENTRY_DSN=
```

**⚠️ Important:**
- Next.js automatically loads `.env.local`
- Variables must start with `NEXT_PUBLIC_` to be accessible in browser
- This file is **NOT** committed to git
- `.env.local` takes precedence over `.env`

---

## Template Files (Already Exist)

These are **committed to git** and serve as templates:

1. **`apps/backend/.env.example`** - Backend template
2. **`apps/frontend/.env.local.example`** - Frontend template

**Purpose:**
- Show what variables are needed
- Document default values
- Safe to commit (no secrets)

---

## Quick Setup

### Step 1: Create Backend .env
```bash
cd apps/backend
copy .env.example .env
# Edit .env with your values
```

### Step 2: Create Frontend .env.local
```bash
cd apps/frontend
copy .env.local.example .env.local
# Edit .env.local with your values
```

### Step 3: Update Values
- Backend: Set `MONGO_URI`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`
- Frontend: Set `NEXT_PUBLIC_API_URL`

---

## Environment File Priority (Next.js)

For Next.js frontend, files are loaded in this order (higher priority overrides lower):

1. `.env.local` ← **Use this for local development**
2. `.env.development` (when NODE_ENV=development)
3. `.env.production` (when NODE_ENV=production)
4. `.env` (base file)

**Recommendation:** Use `.env.local` for all local development.

---

## Git Ignore

Both `.env` files are automatically ignored:

**Backend:**
- `.env` is in `.gitignore`

**Frontend:**
- `.env.local` is in `.gitignore` (Next.js default)

**✅ Safe to commit:**
- `.env.example` files
- Template files

**❌ Never commit:**
- `.env` files
- `.env.local` files
- Any file with secrets

---

## Per-Environment Files (Optional)

### Development
- `apps/backend/.env.development` (optional)
- `apps/frontend/.env.development.local` (optional)

### Production
- `apps/backend/.env.production` (optional)
- `apps/frontend/.env.production.local` (optional)

**Note:** For simplicity, you can use a single `.env` file and change values manually, or use environment-specific files for different deployments.

---

## Summary Table

| File | Location | Required | Purpose | Committed? |
|------|----------|----------|---------|------------|
| `.env` | `apps/backend/` | ✅ Yes | Backend config | ❌ No |
| `.env.example` | `apps/backend/` | ✅ Yes | Backend template | ✅ Yes |
| `.env.local` | `apps/frontend/` | ✅ Yes | Frontend config | ❌ No |
| `.env.local.example` | `apps/frontend/` | ✅ Yes | Frontend template | ✅ Yes |

---

## Checklist

- [ ] Create `apps/backend/.env` from `.env.example`
- [ ] Create `apps/frontend/.env.local` from `.env.local.example`
- [ ] Update backend `.env` with MongoDB URI and JWT secrets
- [ ] Update frontend `.env.local` with API URL
- [ ] Verify both files are in `.gitignore`
- [ ] Never commit actual `.env` files

---

## Troubleshooting

### "Cannot find module" or config errors
- Check if `.env` file exists in correct location
- Verify file name is exactly `.env` (not `.env.txt`)
- Restart the application after creating/updating `.env`

### Frontend can't connect to backend
- Check `NEXT_PUBLIC_API_URL` in `apps/frontend/.env.local`
- Ensure backend is running on the port specified
- Verify CORS settings in backend

### Variables not loading
- **Backend:** Check `envFilePath: '.env'` in `config.module.ts`
- **Frontend:** Ensure variables start with `NEXT_PUBLIC_` for browser access
- Restart dev server after changes

---

## Next Steps

1. Create both `.env` files from templates
2. Set required values (MongoDB, JWT secrets)
3. Start the applications
4. Refer to `docs/backend/env-variables.md` for complete variable reference

