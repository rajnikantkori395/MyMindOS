# MyMindOS Deployment Script for Windows
# This script helps deploy the application to various platforms

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("build", "deploy", "build-deploy", "push", "all")]
    [string]$Action = "all"
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 MyMindOS Deployment Script" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan

# Function to print colored output
function Print-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Print-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

function Print-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Yellow
}

# Check if Docker is installed
function Test-Docker {
    try {
        docker --version | Out-Null
        Print-Success "Docker is installed"
        return $true
    } catch {
        Print-Error "Docker is not installed. Please install Docker Desktop first."
        exit 1
    }
}

# Check if Docker Compose is installed
function Test-DockerCompose {
    try {
        docker-compose --version | Out-Null
        Print-Success "Docker Compose is installed"
        return $true
    } catch {
        Print-Error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    }
}

# Build Docker images
function Build-Images {
    Print-Info "Building Docker images..."
    
    # Build backend
    Print-Info "Building backend image..."
    docker build -f apps/backend/Dockerfile -t mymindos-backend:latest .
    if ($LASTEXITCODE -ne 0) {
        Print-Error "Failed to build backend image"
        exit 1
    }
    
    # Build frontend
    Print-Info "Building frontend image..."
    docker build -f apps/frontend/Dockerfile -t mymindos-frontend:latest .
    if ($LASTEXITCODE -ne 0) {
        Print-Error "Failed to build frontend image"
        exit 1
    }
    
    Print-Success "Docker images built successfully"
}

# Deploy with Docker Compose
function Deploy-Compose {
    Print-Info "Deploying with Docker Compose..."
    
    if (-not (Test-Path "docker-compose.prod.yml")) {
        Print-Error "docker-compose.prod.yml not found"
        exit 1
    }
    
    # Check if .env file exists
    if (-not (Test-Path "apps/backend/.env")) {
        Print-Error "apps/backend/.env not found. Please create it first."
        exit 1
    }
    
    docker-compose -f docker-compose.prod.yml up -d --build
    if ($LASTEXITCODE -ne 0) {
        Print-Error "Failed to deploy with Docker Compose"
        exit 1
    }
    
    Print-Success "Deployment completed!"
    Print-Info "Services are starting up. Check logs with: docker-compose -f docker-compose.prod.yml logs -f"
}

# Push images to Docker Hub
function Push-ToDockerHub {
    if (-not $env:DOCKER_USERNAME) {
        Print-Error "DOCKER_USERNAME environment variable is not set"
        Print-Info "Set it with: `$env:DOCKER_USERNAME = 'your-username'"
        exit 1
    }
    
    Print-Info "Pushing images to Docker Hub..."
    
    docker tag mymindos-backend:latest "$env:DOCKER_USERNAME/mymindos-backend:latest"
    docker tag mymindos-frontend:latest "$env:DOCKER_USERNAME/mymindos-frontend:latest"
    
    docker push "$env:DOCKER_USERNAME/mymindos-backend:latest"
    if ($LASTEXITCODE -ne 0) {
        Print-Error "Failed to push backend image"
        exit 1
    }
    
    docker push "$env:DOCKER_USERNAME/mymindos-frontend:latest"
    if ($LASTEXITCODE -ne 0) {
        Print-Error "Failed to push frontend image"
        exit 1
    }
    
    Print-Success "Images pushed to Docker Hub"
}

# Main execution
switch ($Action) {
    "build" {
        Test-Docker
        Build-Images
    }
    "deploy" {
        Test-Docker
        Test-DockerCompose
        Deploy-Compose
    }
    "build-deploy" {
        Test-Docker
        Test-DockerCompose
        Build-Images
        Deploy-Compose
    }
    "push" {
        Test-Docker
        Push-ToDockerHub
    }
    "all" {
        Test-Docker
        Test-DockerCompose
        Build-Images
        Deploy-Compose
        
        if ($env:DOCKER_USERNAME) {
            $push = Read-Host "Push to Docker Hub? (y/n)"
            if ($push -eq "y" -or $push -eq "Y") {
                Push-ToDockerHub
            }
        }
    }
    default {
        Print-Error "Invalid action: $Action"
        exit 1
    }
}

Write-Host ""
Print-Success "Deployment script completed!"
