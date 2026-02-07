# Quick Deployment Guide

## 🚀 Push to GitHub

### Step 1: Create GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click "New repository"
3. Name it: `mymindos` (or your preferred name)
4. **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click "Create repository"

### Step 2: Push to GitHub

```bash
# From project root
cd F:\Study\Practice\ASSESSMENT\myMindOs\MyMindOS

# Commit all files (if not already committed)
git commit -m "Initial commit: MyMindOS monorepo with deployment setup"

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/mymindos.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## 🐳 Deploy with Docker (Quick Start)

### Option A: Local/EC2 Deployment

1. **Setup Environment Variables**
   ```bash
   # Create backend .env file
   cd apps/backend
   # Copy and edit .env with your MongoDB, S3, and JWT secrets
   ```

2. **Deploy with Docker Compose**
   ```bash
   # From project root
   docker-compose -f docker-compose.prod.yml up -d
   ```

3. **Access Application**
   - Frontend: http://localhost
   - Backend API: http://localhost:3000/api
   - Swagger: http://localhost:3000/api/docs

### Option B: AWS EC2 Free Tier

1. **Launch EC2 Instance**
   - AMI: Ubuntu 22.04 LTS
   - Instance Type: t2.micro (Free tier)
   - Security Group: Allow HTTP (80), HTTPS (443), SSH (22), Custom TCP 3000

2. **Connect and Setup**
   ```bash
   ssh -i your-key.pem ubuntu@<EC2-IP>
   
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo usermod -aG docker ubuntu
   
   # Install Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

3. **Clone and Deploy**
   ```bash
   git clone https://github.com/YOUR_USERNAME/mymindos.git
   cd mymindos
   
   # Setup .env file
   cd apps/backend
   nano .env  # Add your environment variables
   
   # Deploy
   cd ../..
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Option C: Hybrid Free Tier (Lowest Cost)

1. **Frontend on Vercel** (Free)
   - Go to [vercel.com](https://vercel.com)
   - Import GitHub repository
   - Root Directory: `apps/frontend`
   - Build Command: `pnpm install && pnpm build`
   - Output Directory: `.next`

2. **Backend on Railway** (Free tier)
   - Go to [railway.app](https://railway.app)
   - Deploy from GitHub
   - Root Directory: `apps/backend`
   - Add environment variables

3. **Database: MongoDB Atlas** (Free tier)
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create free cluster
   - Get connection string

4. **Storage: AWS S3** (Free tier)
   - Create S3 bucket
   - Create IAM user with S3 access
   - Get access keys

## 📋 Required Environment Variables

### Backend (.env)

```env
NODE_ENV=production
PORT=3000
API_PREFIX=/api

# MongoDB
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/mymindos

# Redis (use Docker container or external)
REDIS_URL=redis://redis:6379

# JWT Secrets (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_ACCESS_SECRET=<your-secret>
JWT_REFRESH_SECRET=<your-secret>

# AWS S3
S3_ENDPOINT=https://s3.us-east-1.amazonaws.com
S3_BUCKET=mymindos-uploads
S3_ACCESS_KEY=<your-key>
S3_SECRET_KEY=<your-secret>
S3_REGION=us-east-1

# Vector DB (Qdrant - use Docker container)
VECTOR_DB_URL=http://qdrant:6333
```

### Frontend (Vercel Environment Variables)

```
NEXT_PUBLIC_API_URL=https://your-backend-url/api
NEXT_PUBLIC_APP_NAME=MyMindOS
```

## 🔧 Useful Commands

```bash
# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Restart services
docker-compose -f docker-compose.prod.yml restart

# Stop services
docker-compose -f docker-compose.prod.yml down

# Rebuild and deploy
docker-compose -f docker-compose.prod.yml up -d --build

# Check status
docker-compose -f docker-compose.prod.yml ps
```

## 📚 Full Documentation

- [Complete Deployment Guide](DEPLOYMENT.md)
- [AWS Free Tier Guide](docs/deployment/aws-free-tier-guide.md)
- [Usage Guide](docs/USAGE_GUIDE.md)

## 🆘 Troubleshooting

### Backend won't start
```bash
docker-compose -f docker-compose.prod.yml logs backend
```

### Database connection issues
- Check MongoDB Atlas IP whitelist
- Verify connection string format
- Check credentials

### Frontend can't connect to backend
- Verify `NEXT_PUBLIC_API_URL` environment variable
- Check CORS settings in backend
- Ensure backend is running and accessible

## ✅ Next Steps

1. ✅ Push to GitHub
2. ✅ Setup MongoDB Atlas
3. ✅ Setup AWS S3
4. ✅ Deploy backend
5. ✅ Deploy frontend
6. ✅ Test application
7. ✅ Setup monitoring
