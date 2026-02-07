#!/bin/bash

# MyMindOS Deployment Script
# This script helps deploy the application to various platforms

set -e

echo "🚀 MyMindOS Deployment Script"
echo "=============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    print_success "Docker is installed"
}

# Check if Docker Compose is installed
check_docker_compose() {
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    print_success "Docker Compose is installed"
}

# Build Docker images
build_images() {
    print_info "Building Docker images..."
    
    # Build backend
    print_info "Building backend image..."
    docker build -f apps/backend/Dockerfile -t mymindos-backend:latest .
    
    # Build frontend
    print_info "Building frontend image..."
    docker build -f apps/frontend/Dockerfile -t mymindos-frontend:latest .
    
    print_success "Docker images built successfully"
}

# Deploy with Docker Compose
deploy_compose() {
    print_info "Deploying with Docker Compose..."
    
    if [ ! -f "docker-compose.prod.yml" ]; then
        print_error "docker-compose.prod.yml not found"
        exit 1
    fi
    
    # Check if .env file exists
    if [ ! -f "apps/backend/.env" ]; then
        print_error "apps/backend/.env not found. Please create it first."
        exit 1
    fi
    
    docker-compose -f docker-compose.prod.yml up -d --build
    
    print_success "Deployment completed!"
    print_info "Services are starting up. Check logs with: docker-compose -f docker-compose.prod.yml logs -f"
}

# Push images to Docker Hub
push_to_dockerhub() {
    if [ -z "$DOCKER_USERNAME" ]; then
        print_error "DOCKER_USERNAME environment variable is not set"
        exit 1
    fi
    
    print_info "Pushing images to Docker Hub..."
    
    docker tag mymindos-backend:latest $DOCKER_USERNAME/mymindos-backend:latest
    docker tag mymindos-frontend:latest $DOCKER_USERNAME/mymindos-frontend:latest
    
    docker push $DOCKER_USERNAME/mymindos-backend:latest
    docker push $DOCKER_USERNAME/mymindos-frontend:latest
    
    print_success "Images pushed to Docker Hub"
}

# Main menu
main() {
    echo ""
    echo "Select deployment option:"
    echo "1) Build Docker images"
    echo "2) Deploy with Docker Compose"
    echo "3) Build and Deploy"
    echo "4) Push to Docker Hub"
    echo "5) Full deployment (Build, Deploy, Push)"
    echo ""
    read -p "Enter option (1-5): " option
    
    case $option in
        1)
            check_docker
            build_images
            ;;
        2)
            check_docker
            check_docker_compose
            deploy_compose
            ;;
        3)
            check_docker
            check_docker_compose
            build_images
            deploy_compose
            ;;
        4)
            check_docker
            push_to_dockerhub
            ;;
        5)
            check_docker
            check_docker_compose
            build_images
            deploy_compose
            push_to_dockerhub
            ;;
        *)
            print_error "Invalid option"
            exit 1
            ;;
    esac
}

# Run main function
main
