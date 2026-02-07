# AWS Free Tier Deployment Guide

This guide walks you through deploying MyMindOS using AWS free tier resources and cost-effective alternatives.

## Table of Contents
- [Cost-Effective Architecture](#cost-effective-architecture)
- [Prerequisites](#prerequisites)
- [Option 1: Hybrid Free Tier (Recommended)](#option-1-hybrid-free-tier-recommended)
- [Option 2: Full AWS Free Tier](#option-2-full-aws-free-tier)
- [Option 3: Alternative Free Platforms](#option-3-alternative-free-platforms)
- [Step-by-Step Deployment](#step-by-step-deployment)
- [Monitoring & Maintenance](#monitoring--maintenance)
- [Cost Optimization Tips](#cost-optimization-tips)

## Cost-Effective Architecture

### Recommended Setup (Lowest Cost)
- **Frontend:** Vercel (Free tier: unlimited personal projects)
- **Backend:** Railway/Render (Free tier: $5-7/month credit) OR AWS EC2 t2.micro (Free tier: 750 hours/month)
- **Database:** MongoDB Atlas (Free tier: 512MB) OR Railway MongoDB
- **Vector DB:** Qdrant Cloud (Free tier: 1GB) OR self-hosted on EC2
- **File Storage:** AWS S3 (Free tier: 5GB storage, 20K GET requests)
- **Redis:** Railway/Render (included) OR AWS ElastiCache (not free, use Railway)

### Full AWS Free Tier Setup
- **Frontend:** AWS Amplify (Free tier: 1000 build minutes/month)
- **Backend:** EC2 t2.micro (Free tier: 750 hours/month for 12 months)
- **Database:** MongoDB Atlas (Free tier) OR self-hosted on EC2
- **Vector DB:** Self-hosted Qdrant on EC2
- **File Storage:** S3 (Free tier: 5GB)
- **Redis:** Self-hosted on EC2

## Prerequisites

1. **AWS Account** (Free tier eligible for 12 months)
2. **GitHub Account** (for CI/CD)
3. **Docker** installed locally
4. **AWS CLI** configured: `aws configure`
5. **Domain name** (optional, can use provided subdomains)

## Option 1: Hybrid Free Tier (Recommended)

### Why This Option?
- **Frontend on Vercel:** Zero cost, excellent performance, automatic HTTPS
- **Backend on Railway/Render:** Simple deployment, includes Redis, ~$5-7/month credit
- **MongoDB Atlas:** Free tier sufficient for MVP
- **S3:** Free tier covers initial storage needs

### Architecture
```
Frontend (Vercel) → Backend (Railway) → MongoDB Atlas (Free)
                              ↓
                         Redis (Railway)
                              ↓
                         Qdrant Cloud (Free)
                              ↓
                         S3 (AWS Free Tier)
```

### Deployment Steps

#### 1. Frontend on Vercel
```bash
# From project root
cd apps/frontend

# Install Vercel CLI (optional)
pnpm add -g vercel

# Deploy
vercel

# Or connect GitHub repo in Vercel dashboard
# - Import repository
# - Root directory: apps/frontend
# - Build command: pnpm install && pnpm build
# - Output directory: .next
```

**Environment Variables in Vercel:**
- `NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api`
- `NEXT_PUBLIC_APP_NAME=MyMindOS`

#### 2. Backend on Railway
1. Sign up at [railway.app](https://railway.app)
2. Create new project → "Deploy from GitHub repo"
3. Select your repository
4. Add service → "Empty Service"
5. Connect GitHub repo
6. Set root directory: `apps/backend`
7. Add environment variables (see `.env.example`)
8. Railway auto-detects Dockerfile or Node.js

**Railway Environment Variables:**
```env
NODE_ENV=production
PORT=3000
API_PREFIX=/api
MONGO_URI=<from MongoDB Atlas>
REDIS_URL=${{Redis.REDIS_URL}}
JWT_ACCESS_SECRET=<generate>
JWT_REFRESH_SECRET=<generate>
# ... other vars
```

#### 3. MongoDB Atlas Setup
1. Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster (M0 Sandbox)
3. Create database user
4. Whitelist IP: `0.0.0.0/0` (or Railway IPs)
5. Get connection string
6. Update `MONGO_URI` in Railway

#### 4. Qdrant Cloud (Free Tier)
1. Sign up at [cloud.qdrant.io](https://cloud.qdrant.io)
2. Create free cluster (1GB)
3. Get API key and URL
4. Update `VECTOR_DB_URL` and `VECTOR_DB_API_KEY` in Railway

#### 5. AWS S3 Setup
```bash
# Create S3 bucket
aws s3 mb s3://mymindos-uploads --region us-east-1

# Create IAM user for S3 access
aws iam create-user --user-name mymindos-s3-user

# Create access key
aws iam create-access-key --user-name mymindos-s3-user

# Attach S3 policy (create policy file first)
aws iam put-user-policy --user-name mymindos-s3-user \
  --policy-name S3UploadAccess \
  --policy-document file://s3-policy.json
```

**S3 Policy (`s3-policy.json`):**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::mymindos-uploads/*"
    }
  ]
}
```

Update Railway env vars:
```env
S3_ENDPOINT=https://s3.us-east-1.amazonaws.com
S3_BUCKET=mymindos-uploads
S3_ACCESS_KEY=<from IAM user>
S3_SECRET_KEY=<from IAM user>
S3_REGION=us-east-1
```

## Option 2: Full AWS Free Tier

### Architecture
```
Frontend (Amplify) → Backend (EC2) → MongoDB (Atlas or EC2)
                              ↓
                         Redis (EC2)
                              ↓
                         Qdrant (EC2)
                              ↓
                         S3 (Free Tier)
```

### Step-by-Step

#### 1. EC2 Instance Setup
```bash
# Launch EC2 t2.micro (Free tier eligible)
# - AMI: Ubuntu 22.04 LTS
# - Instance type: t2.micro
# - Security group: Allow HTTP (80), HTTPS (443), SSH (22), Custom TCP 3000
# - Key pair: Create/download .pem file
```

**Connect to EC2:**
```bash
ssh -i your-key.pem ubuntu@<EC2-IP>
```

**Install Dependencies:**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install pnpm
corepack enable
corepack prepare pnpm@latest --activate

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### 2. Deploy Backend to EC2

**Option A: Direct Deployment**
```bash
# On EC2
git clone <your-repo>
cd MyMindOS
pnpm install
cd apps/backend
cp .env.example .env
# Edit .env with production values
pnpm build
pnpm start:prod
```

**Option B: Docker Deployment**
Create `apps/backend/Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY pnpm-lock.yaml package.json ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start:prod"]
```

**Deploy:**
```bash
# On EC2
cd MyMindOS/apps/backend
docker build -t mymindos-backend .
docker run -d -p 3000:3000 --env-file .env --name backend mymindos-backend
```

#### 3. Setup Nginx Reverse Proxy
```bash
sudo apt install nginx
sudo nano /etc/nginx/sites-available/mymindos
```

**Nginx Config:**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/mymindos /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 4. Setup PM2 for Process Management
```bash
sudo npm install -g pm2
cd apps/backend
pm2 start dist/main.js --name mymindos-backend
pm2 startup
pm2 save
```

#### 5. Frontend on AWS Amplify
1. Go to AWS Amplify Console
2. "New app" → "Host web app"
3. Connect GitHub repository
4. Build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - corepack enable
           - corepack prepare pnpm@latest --activate
           - cd apps/frontend && pnpm install
       build:
         commands:
           - cd apps/frontend && pnpm build
     artifacts:
       baseDirectory: apps/frontend/.next
       files:
         - '**/*'
     cache:
       paths:
         - apps/frontend/.next/cache/**/*
   ```
5. Add environment variables:
   - `NEXT_PUBLIC_API_URL=http://your-ec2-ip/api`

#### 6. Self-Hosted Services on EC2

**Redis:**
```bash
docker run -d -p 6379:6379 --name redis redis:alpine
```

**Qdrant:**
```bash
docker run -d -p 6333:6333 -p 6334:6334 --name qdrant qdrant/qdrant
```

Update backend `.env`:
```env
REDIS_URL=redis://localhost:6379
VECTOR_DB_URL=http://localhost:6333
```

## Option 3: Alternative Free Platforms

### Render.com (Free Tier)
- **Backend:** Free tier (spins down after 15min inactivity)
- **PostgreSQL:** Free tier (90 days)
- **Redis:** Free tier (25MB)

### Fly.io (Free Tier)
- **Apps:** 3 shared-cpu VMs free
- **PostgreSQL:** 3GB free
- **Redis:** 256MB free

### Supabase (Free Tier)
- **PostgreSQL:** 500MB
- **Storage:** 1GB
- **API:** Unlimited requests

## Step-by-Step Deployment

### Quick Start Checklist

1. ✅ **Setup MongoDB Atlas** (Free tier)
2. ✅ **Setup Qdrant Cloud** (Free tier)
3. ✅ **Setup AWS S3** (Free tier)
4. ✅ **Deploy Backend** (Railway/EC2)
5. ✅ **Deploy Frontend** (Vercel/Amplify)
6. ✅ **Configure Environment Variables**
7. ✅ **Test Endpoints**
8. ✅ **Setup Domain** (optional)

### Environment Variables Reference

**Backend (.env):**
```env
NODE_ENV=production
PORT=3000
API_PREFIX=/api

MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/mymindos
REDIS_URL=redis://localhost:6379

VECTOR_DB_URL=https://your-cluster.qdrant.io
VECTOR_DB_API_KEY=your-key

S3_ENDPOINT=https://s3.us-east-1.amazonaws.com
S3_BUCKET=mymindos-uploads
S3_ACCESS_KEY=your-key
S3_SECRET_KEY=your-secret
S3_REGION=us-east-1

JWT_ACCESS_SECRET=<generate-strong-secret>
JWT_REFRESH_SECRET=<generate-strong-secret>
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=7d

OPENAI_API_KEY=your-key
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=https://your-backend-url/api
NEXT_PUBLIC_APP_NAME=MyMindOS
```

## Monitoring & Maintenance

### Free Monitoring Tools
- **Uptime Robot:** Free tier (50 monitors)
- **Sentry:** Free tier (5K events/month)
- **CloudWatch:** Free tier (10 metrics, 5GB logs)

### Health Checks
```bash
# Backend health
curl https://your-backend-url/api/health

# Expected response:
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "MyMindOS Backend"
}
```

### Logs
**Railway:** View logs in dashboard
**EC2:** `pm2 logs` or `docker logs backend`
**Vercel:** View logs in dashboard

## Cost Optimization Tips

1. **Use Free Tiers First:** MongoDB Atlas, Qdrant Cloud, S3 free tier
2. **Monitor Usage:** Set up AWS billing alerts
3. **Auto-shutdown:** Use EC2 instance scheduler for non-production
4. **Compress Assets:** Reduce S3 storage costs
5. **Cache Aggressively:** Reduce API calls and database queries
6. **Use CDN:** CloudFront free tier (1TB transfer out)
7. **Optimize Images:** Use Next.js Image component
8. **Database Indexing:** Improve query performance, reduce compute

## Troubleshooting

### Backend Won't Start
- Check environment variables
- Verify MongoDB connection
- Check port availability (3000)
- Review logs: `pm2 logs` or `docker logs`

### Frontend Can't Connect to Backend
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check CORS settings in backend
- Verify backend is running and accessible

### Database Connection Issues
- Whitelist IP addresses in MongoDB Atlas
- Verify connection string format
- Check network security groups (EC2)

## Next Steps

1. **CI/CD:** Setup GitHub Actions for automated deployments
2. **SSL Certificates:** Use Let's Encrypt (free) for custom domains
3. **Backup Strategy:** Automated MongoDB backups
4. **Scaling:** Plan for when free tier limits are reached

## Additional Resources

- [AWS Free Tier Details](https://aws.amazon.com/free/)
- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [MongoDB Atlas Free Tier](https://www.mongodb.com/cloud/atlas/pricing)

