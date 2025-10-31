#!/bin/bash

# AuditForge Docker Build and Push Script
# This script automates building and pushing Docker images to Docker Hub

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
IMAGE_NAME="auditforge"
VERSION="v1.0.0"

echo -e "${GREEN}🔨 AuditForge Docker Build Script${NC}"
echo "=================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Get Docker Hub username
read -p "Enter your Docker Hub username: " DOCKER_USERNAME

if [ -z "$DOCKER_USERNAME" ]; then
    echo -e "${RED}❌ Docker Hub username is required${NC}"
    exit 1
fi

# Login to Docker Hub
echo -e "${YELLOW}🔐 Logging in to Docker Hub...${NC}"
docker login

# Build the image
echo -e "${YELLOW}🏗️  Building Docker image...${NC}"
docker build -t ${IMAGE_NAME}:latest .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful!${NC}"
else
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi

# Tag the image
echo -e "${YELLOW}🏷️  Tagging image...${NC}"
docker tag ${IMAGE_NAME}:latest ${DOCKER_USERNAME}/${IMAGE_NAME}:latest
docker tag ${IMAGE_NAME}:latest ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}

# Show image info
echo -e "${GREEN}📦 Image Information:${NC}"
docker images | grep ${IMAGE_NAME}

# Ask to push
read -p "Push to Docker Hub? (y/n): " PUSH_CONFIRM

if [ "$PUSH_CONFIRM" = "y" ] || [ "$PUSH_CONFIRM" = "Y" ]; then
    echo -e "${YELLOW}📤 Pushing to Docker Hub...${NC}"
    docker push ${DOCKER_USERNAME}/${IMAGE_NAME}:latest
    docker push ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}
    
    echo -e "${GREEN}✅ Push successful!${NC}"
    echo ""
    echo -e "${GREEN}🎉 Your Docker image is now public!${NC}"
    echo ""
    echo "Docker Image URL:"
    echo -e "${YELLOW}docker.io/${DOCKER_USERNAME}/${IMAGE_NAME}:latest${NC}"
    echo ""
    echo "Use this URL for NodeOps Template Marketplace submission"
else
    echo -e "${YELLOW}⏭️  Skipping push${NC}"
fi

# Test the image
read -p "Test the image locally? (y/n): " TEST_CONFIRM

if [ "$TEST_CONFIRM" = "y" ] || [ "$TEST_CONFIRM" = "Y" ]; then
    echo -e "${YELLOW}🧪 Starting test container...${NC}"
    docker run -d \
        --name auditforge-test \
        -p 3000:3000 \
        -p 3001:3001 \
        ${DOCKER_USERNAME}/${IMAGE_NAME}:latest
    
    echo -e "${GREEN}✅ Container started!${NC}"
    echo ""
    echo "Access your application:"
    echo "  Frontend: http://localhost:3000"
    echo "  Backend:  http://localhost:3001"
    echo ""
    echo "View logs: docker logs -f auditforge-test"
    echo "Stop test: docker stop auditforge-test && docker rm auditforge-test"
fi

echo ""
echo -e "${GREEN}✨ Done!${NC}"
