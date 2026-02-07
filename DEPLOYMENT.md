# MyMindOS Deployment Guide

This guide covers deploying MyMindOS to production using free tier services.

## Quick Deployment Options

### Option 1: Docker Compose (Local/EC2) - Recommended for AWS

Deploy everything using Docker Compose on a single server (EC2 t2.micro free tier).

### Option 2: Hybrid Free Tier (Lowest Cost)

- Frontend: Vercel (Free)
- Backend: Railway/Render (Free tier)
- Database: MongoDB Atlas (Free tier)
- Storage: AWS S3 (Free tier)

### Option 3: Full AWS Free Tier

- Frontend: AWS Amplify
- Backend: EC2 t2.micro
- Database: MongoDB Atlas or self-hosted
- Storage: S3

## Prerequisites

1. **GitHub Account** - For repository hosting
2. **AWS Account** - Free tier eligible
3. **Docker** - Installed locally
4. **Docker Hub Account** - For container registry (optional)

## Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: MyMindOS monorepo"

# Add remote (replace with your GitHub repo URL)
git remote add origin https://github.com/yourusername/mymindos.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 2: Deploy to AWS EC2 (Free Tier)

### 2.1 Launch EC2 Instance

1. Go to AWS Console → EC2
2. Launch Instance:
   - **AMI**: Ubuntu 22.04 LTS
   - **Instance Type**: t2.micro (Free tier eligible)
   - **Key Pair**: Create/download .pem file
   - **Security Group**: Allow:
     - SSH (22)
     - HTTP (80)
     - HTTPS (443)
     - Custom TCP 3000 (for backend API)

### 2.2 Connect to EC2

```bash
ssh -i your-key.pem ubuntu@<EC2-PUBLIC-IP>
```

### 2.3 Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout and login again for docker group to take effect
exit
# Then reconnect via SSH
```

### 2.4 Clone Repository

```bash
git clone https://github.com/yourusername/mymindos.git
cd mymindos
```

### 2.5 Setup Environment Variables

```bash
# Create backend .env file
cd apps/backend
cp .env.example .env  # If exists, or create manually
nano .env
```

**Required Environment Variables:**

```env
NODE_ENV=production
PORT=3000
API_PREFIX=/api

# MongoDB (use MongoDB Atlas free tier)
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/mymindos?retryWrites=true&w=majority

# Redis (will use Docker container)
REDIS_URL=redis://redis:6379

# JWT Secrets (generate strong secrets)
JWT_ACCESS_SECRET=<generate-strong-secret>
JWT_REFRESH_SECRET=<generate-strong-secret>
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=7d

# AWS S3 (Free tier)
S3_ENDPOINT=https://s3.us-east-1.amazonaws.com
S3_BUCKET=mymindos-uploads
S3_ACCESS_KEY=<your-aws-access-key>
S3_SECRET_KEY=<your-aws-secret-key>
S3_REGION=us-east-1

# Vector DB (Qdrant - will use Docker container)
VECTOR_DB_URL=http://qdrant:6333
VECTOR_DB_API_KEY=

# Optional: AI Provider
OPENAI_API_KEY=<optional>
```

**Generate JWT Secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2.6 Setup AWS S3

```bash
# On your local machine with AWS CLI configured
aws s3 mb s3://mymindos-uploads --region us-east-1

# Create IAM user for S3 access
aws iam create-user --user-name mymindos-s3-user

# Create access key
aws iam create-access-key --user-name mymindos-s3-user

# Create and attach policy (save as s3-policy.json first)
aws iam put-user-policy --user-name mymindos-s3-user \
  --policy-name S3UploadAccess \
  --policy-document file://s3-policy.json
```

**s3-policy.json:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::mymindos-uploads",
        "arn:aws:s3:::mymindos-uploads/*"
      ]
    }
  ]
}
```

### 2.7 Deploy with Docker Compose

```bash
# From project root
cd /home/ubuntu/mymindos

# Update docker-compose.prod.yml with correct environment variables
# Then start services
docker-compose -f docker-compose.prod.yml up -d

# Check logs
docker-compose -f docker-compose.prod.yml logs -f

# Check status
docker-compose -f docker-compose.prod.yml ps
```

### 2.8 Setup Nginx Reverse Proxy

```bash
sudo apt install nginx -y

# Create nginx config
sudo nano /etc/nginx/sites-available/mymindos
```

**Nginx Config:**
```nginx
server {
    listen 80;
    server_name your-domain.com;  # or EC2 public IP

    # Frontend
    location / {
        proxy_pass http://localhost:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/mymindos /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 2.9 Setup SSL with Let's Encrypt (Optional)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

## Step 3: Deploy Frontend to Vercel (Alternative - Free)

### 3.1 Connect GitHub to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Import your repository
5. Configure:
   - **Root Directory**: `apps/frontend`
   - **Build Command**: `pnpm install && pnpm build`
   - **Output Directory**: `.next`
   - **Install Command**: `pnpm install`

### 3.2 Environment Variables in Vercel

```
NEXT_PUBLIC_API_URL=http://your-ec2-ip/api
NEXT_PUBLIC_APP_NAME=MyMindOS
```

### 3.3 Deploy

Vercel will automatically deploy on every push to main branch.

## Step 4: Deploy Backend to Railway (Alternative - Free Tier)

### 4.1 Setup Railway

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create new project → "Deploy from GitHub repo"
4. Select your repository
5. Add service → "Empty Service"
6. Set root directory: `apps/backend`

### 4.2 Environment Variables

Add all environment variables from Step 2.5 in Railway dashboard.

### 4.3 Deploy

Railway will auto-detect Dockerfile and deploy.

## Step 5: Setup MongoDB Atlas (Free Tier)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free account
3. Create free cluster (M0 Sandbox)
4. Create database user
5. Whitelist IP: `0.0.0.0/0` (or specific IPs)
6. Get connection string
7. Update `MONGO_URI` in your deployment

## Step 6: Verify Deployment

### Health Checks

```bash
# Backend health
curl http://your-server/api/health

# Frontend
curl http://your-server/

# Expected response from health endpoint:
{
  "status": "ok",
  "timestamp": "...",
  "service": "MyMindOS Backend"
}
```

### Test Application

1. Visit frontend URL
2. Register/Login
3. Test file upload
4. Test chat functionality

## Step 7: Setup CI/CD (Optional)

See `.github/workflows/deploy.yml` for GitHub Actions workflow.

## Monitoring

### Free Monitoring Tools

- **Uptime Robot**: Monitor uptime (free tier: 50 monitors)
- **Sentry**: Error tracking (free tier: 5K events/month)
- **AWS CloudWatch**: Logs and metrics (free tier: 10 metrics, 5GB logs)

## Troubleshooting

### Backend Won't Start

```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs backend

# Check environment variables
docker-compose -f docker-compose.prod.yml exec backend env

# Restart service
docker-compose -f docker-compose.prod.yml restart backend
```

### Database Connection Issues

- Verify MongoDB Atlas IP whitelist
- Check connection string format
- Verify credentials

### Frontend Can't Connect to Backend

- Check `NEXT_PUBLIC_API_URL` environment variable
- Verify CORS settings in backend
- Check backend is running and accessible

## Cost Optimization

1. Use free tiers first (MongoDB Atlas, S3, Vercel)
2. Set up AWS billing alerts
3. Use EC2 instance scheduler for non-production
4. Monitor usage regularly

## Next Steps

1. Setup custom domain
2. Configure SSL certificates
3. Setup automated backups
4. Configure monitoring and alerts
5. Setup CI/CD pipeline

## Support

For issues, check:
- [Troubleshooting Guide](docs/USAGE_GUIDE.md#troubleshooting)
- [Backend Documentation](docs/backend/README.md)
- [Frontend Documentation](docs/frontend/README.md)
