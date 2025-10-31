# 🐳 Docker Deployment Guide - AuditForge

Complete guide for packaging AuditForge as a Docker image and deploying to NodeOps Template Marketplace.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Building the Docker Image](#building-the-docker-image)
4. [Testing Locally](#testing-locally)
5. [Publishing to Docker Hub](#publishing-to-docker-hub)
6. [NodeOps Template Marketplace Submission](#nodeops-template-marketplace-submission)
7. [Environment Variables](#environment-variables)
8. [Troubleshooting](#troubleshooting)
9. [Advanced Configuration](#advanced-configuration)

---

## 🎯 Prerequisites

Before starting, ensure you have:

- ✅ Docker installed ([Download Docker](https://www.docker.com/get-started))
- ✅ Docker Hub account ([Sign up](https://hub.docker.com/signup))
- ✅ Git installed
- ✅ AIML API key (optional but recommended)

### Verify Docker Installation

```bash
docker --version
# Should show: Docker version 20.x.x or higher

docker-compose --version
# Should show: Docker Compose version 2.x.x or higher
```

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/ShivamSoni20/AuditForge.git
cd AuditForge
```

### 2. Build and Run with Docker Compose

```bash
# Build and start the container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

Access the application:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

---

## 🔨 Building the Docker Image

### Step 1: Build the Image

```bash
# Basic build
docker build -t auditforge:latest .

# Build with specific tag
docker build -t auditforge:v1.0.0 .

# Build with build arguments
docker build \
  --build-arg NODE_VERSION=18 \
  -t auditforge:latest .
```

**Build time**: ~5-10 minutes (depending on internet speed)

### Step 2: Verify the Build

```bash
# List Docker images
docker images | grep auditforge

# Should show:
# auditforge   latest   abc123def456   2 minutes ago   500MB
```

### Step 3: Inspect the Image

```bash
# View image details
docker inspect auditforge:latest

# View image layers
docker history auditforge:latest
```

---

## 🧪 Testing Locally

### Method 1: Using Docker Run

```bash
# Run the container
docker run -d \
  --name auditforge-test \
  -p 3000:3000 \
  -p 3001:3001 \
  -e AIML_API_KEY=your_api_key_here \
  auditforge:latest

# Check if it's running
docker ps

# View logs
docker logs -f auditforge-test

# Stop and remove
docker stop auditforge-test
docker rm auditforge-test
```

### Method 2: Using Docker Compose

```bash
# Create .env file
echo "AIML_API_KEY=your_api_key_here" > .env

# Start services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Method 3: Interactive Testing

```bash
# Run container interactively
docker run -it \
  -p 3000:3000 \
  -p 3001:3001 \
  auditforge:latest /bin/sh

# Inside container, you can:
# - Check files: ls -la
# - Test backend: cd backend && node server.js
# - Check frontend: cd frontend && ls dist
```

### Verify Everything Works

1. **Frontend**: Open http://localhost:3000
   - Should see AuditForge UI
   - Try uploading a contract
   
2. **Backend API**: Test with curl
   ```bash
   # Health check
   curl http://localhost:3001/api/health
   
   # Should return: {"status":"ok","timestamp":"..."}
   ```

3. **Full Audit Test**:
   ```bash
   curl -X POST http://localhost:3001/api/audit \
     -H "Content-Type: application/json" \
     -d '{
       "code": "contract Test { }",
       "language": "solidity",
       "contractName": "Test"
     }'
   ```

---

## 📦 Publishing to Docker Hub

### Step 1: Login to Docker Hub

```bash
# Login
docker login

# Enter your Docker Hub username and password
# Username: your-dockerhub-username
# Password: your-dockerhub-password

# Verify login
docker info | grep Username
```

### Step 2: Tag Your Image

**NodeOps Naming Convention**: `username/project-name:version`

```bash
# Replace 'yourusername' with your Docker Hub username
docker tag auditforge:latest yourusername/auditforge:latest
docker tag auditforge:latest yourusername/auditforge:v1.0.0

# Example:
docker tag auditforge:latest shivamsoni20/auditforge:latest
docker tag auditforge:latest shivamsoni20/auditforge:v1.0.0
```

### Step 3: Push to Docker Hub

```bash
# Push latest tag
docker push yourusername/auditforge:latest

# Push version tag
docker push yourusername/auditforge:v1.0.0

# Push all tags
docker push yourusername/auditforge --all-tags
```

**Push time**: ~5-15 minutes (depending on internet speed)

### Step 4: Verify on Docker Hub

1. Go to https://hub.docker.com
2. Navigate to your repositories
3. Find `auditforge`
4. Verify:
   - ✅ Image is public
   - ✅ Tags are visible (latest, v1.0.0)
   - ✅ Size is reasonable (~500MB)

### Step 5: Make Repository Public

1. Go to your repository on Docker Hub
2. Click **Settings**
3. Under **Visibility**, select **Public**
4. Click **Save**

---

## 🎯 NodeOps Template Marketplace Submission

### Step 1: Get Your Docker Image URL

Your public Docker image URL format:
```
docker.io/yourusername/auditforge:latest
```

**Example**:
```
docker.io/shivamsoni20/auditforge:latest
```

### Step 2: Test Pull from Docker Hub

```bash
# Remove local image
docker rmi yourusername/auditforge:latest

# Pull from Docker Hub
docker pull yourusername/auditforge:latest

# Run pulled image
docker run -d -p 3000:3000 -p 3001:3001 yourusername/auditforge:latest
```

### Step 3: Prepare NodeOps Submission

**Required Information**:

1. **Template Name**: AuditForge
2. **Docker Image URL**: `docker.io/yourusername/auditforge:latest`
3. **Description**: 
   ```
   AI-powered smart contract security auditor specialized for DePIN and NodeOps ecosystems. 
   Features multi-layer scanning, code correction, and professional PDF reports.
   ```
4. **Category**: Development Tools / Security
5. **Ports**:
   - `3000` - Frontend (Web UI)
   - `3001` - Backend API
6. **Environment Variables**:
   - `AIML_API_KEY` (optional) - AI analysis API key
   - `NODE_ENV` (default: production)
7. **Minimum Resources**:
   - CPU: 1 core
   - RAM: 1GB
   - Storage: 2GB
8. **Health Check Endpoint**: `http://localhost:3001/api/health`

### Step 4: Create Template Documentation

Create a `NODEOPS_TEMPLATE.md` file:

```markdown
# AuditForge - NodeOps Template

## Quick Deploy

docker run -d \
  --name auditforge \
  -p 3000:3000 \
  -p 3001:3001 \
  -e AIML_API_KEY=your_key \
  docker.io/yourusername/auditforge:latest

## Access
- Frontend: http://your-node-ip:3000
- API: http://your-node-ip:3001

## Environment Variables
- AIML_API_KEY: Optional AI API key for enhanced analysis

## Health Check
curl http://localhost:3001/api/health
```

### Step 5: Submit to NodeOps

1. Go to NodeOps Template Marketplace submission page
2. Fill in the form with information from Step 3
3. Paste Docker image URL: `docker.io/yourusername/auditforge:latest`
4. Upload documentation (optional)
5. Submit for review

---

## 🔧 Environment Variables

### Required Variables

None - Application works without API key using fallback analysis.

### Optional Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `AIML_API_KEY` | AIML API key for AI analysis | None | `sk-abc123...` |
| `AIML_BASE_URL` | AIML API base URL | `https://api.aimlapi.com/v1` | Custom URL |
| `NODE_ENV` | Node environment | `production` | `production` |
| `PORT` | Backend API port | `3001` | `3001` |

### Setting Environment Variables

**Docker Run**:
```bash
docker run -d \
  -e AIML_API_KEY=your_key \
  -e NODE_ENV=production \
  yourusername/auditforge:latest
```

**Docker Compose**:
```yaml
environment:
  - AIML_API_KEY=your_key
  - NODE_ENV=production
```

**NodeOps Dashboard**:
1. Go to your deployed template
2. Click **Environment Variables**
3. Add `AIML_API_KEY` with your key
4. Restart container

---

## 🐛 Troubleshooting

### Issue 1: Build Fails

**Error**: `npm install failed`

**Solution**:
```bash
# Clear Docker cache
docker builder prune -a

# Rebuild without cache
docker build --no-cache -t auditforge:latest .
```

### Issue 2: Container Exits Immediately

**Error**: Container stops right after starting

**Solution**:
```bash
# Check logs
docker logs container-name

# Run interactively to debug
docker run -it auditforge:latest /bin/sh
```

### Issue 3: Port Already in Use

**Error**: `Bind for 0.0.0.0:3000 failed: port is already allocated`

**Solution**:
```bash
# Use different ports
docker run -d -p 8000:3000 -p 8001:3001 auditforge:latest

# Or stop conflicting container
docker ps
docker stop conflicting-container
```

### Issue 4: Cannot Connect to Frontend

**Error**: Frontend not loading at http://localhost:3000

**Solution**:
```bash
# Check if container is running
docker ps

# Check logs
docker logs container-name

# Verify ports are exposed
docker port container-name

# Test backend health
curl http://localhost:3001/api/health
```

### Issue 5: API Calls Failing (404)

**Error**: Frontend shows 404 errors for API calls

**Solution**:
```bash
# Check backend is running
curl http://localhost:3001/api/health

# Verify environment variables
docker exec container-name env | grep API

# Check backend logs
docker logs container-name | grep error
```

### Issue 6: Image Too Large

**Error**: Image size > 1GB

**Solution**:
```bash
# Use alpine base image (already in Dockerfile)
# Remove unnecessary files in .dockerignore
# Use multi-stage builds (already implemented)

# Check image size
docker images auditforge:latest
```

### Issue 7: Health Check Failing

**Error**: Container marked as unhealthy

**Solution**:
```bash
# Check health status
docker inspect container-name | grep Health -A 10

# Test health endpoint manually
docker exec container-name curl http://localhost:3001/api/health

# Increase health check timeout in Dockerfile
```

### Issue 8: Push to Docker Hub Fails

**Error**: `denied: requested access to the resource is denied`

**Solution**:
```bash
# Re-login to Docker Hub
docker logout
docker login

# Verify repository name matches username
docker tag auditforge:latest correct-username/auditforge:latest
docker push correct-username/auditforge:latest
```

---

## 🔬 Advanced Configuration

### Custom Dockerfile

Create `Dockerfile.custom`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy everything
COPY . .

# Install dependencies
RUN npm run install-all

# Build frontend
RUN cd frontend && npm run build

# Expose ports
EXPOSE 3000 3001

# Start script
CMD ["npm", "run", "dev"]
```

### Multi-Architecture Build

Build for multiple platforms (AMD64, ARM64):

```bash
# Create builder
docker buildx create --name multiarch --use

# Build for multiple platforms
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t yourusername/auditforge:latest \
  --push .
```

### Optimize Image Size

```bash
# Use specific node version
FROM node:18.19-alpine

# Clean npm cache
RUN npm cache clean --force

# Remove dev dependencies
RUN npm prune --production
```

### Add Monitoring

```dockerfile
# Install monitoring tools
RUN npm install -g pm2

# Use PM2 for process management
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
```

---

## 📊 Image Information

### Final Image Details

- **Base Image**: node:18-alpine
- **Size**: ~500MB
- **Layers**: 15-20
- **Exposed Ports**: 3000, 3001
- **Health Check**: Enabled
- **Multi-stage Build**: Yes
- **Production Ready**: Yes

### Image Layers

```
Layer 1: Base Alpine Linux
Layer 2: Node.js 18
Layer 3: Frontend dependencies
Layer 4: Frontend build
Layer 5: Backend dependencies
Layer 6: Application code
Layer 7: Startup scripts
```

---

## ✅ Pre-Submission Checklist

Before submitting to NodeOps:

- [ ] Docker image builds successfully
- [ ] Image runs locally without errors
- [ ] Frontend accessible at port 3000
- [ ] Backend API accessible at port 3001
- [ ] Health check endpoint responds
- [ ] Image pushed to Docker Hub
- [ ] Repository is public
- [ ] Image size < 1GB
- [ ] Documentation is complete
- [ ] Environment variables documented
- [ ] Tested pull from Docker Hub
- [ ] Tested on clean system

---

## 📝 Quick Reference Commands

```bash
# Build
docker build -t auditforge:latest .

# Run
docker run -d -p 3000:3000 -p 3001:3001 auditforge:latest

# Tag
docker tag auditforge:latest username/auditforge:latest

# Push
docker push username/auditforge:latest

# Pull
docker pull username/auditforge:latest

# Logs
docker logs -f container-name

# Stop
docker stop container-name

# Remove
docker rm container-name

# Clean up
docker system prune -a
```

---

## 🎯 NodeOps Deployment Command

**One-line deploy command for NodeOps**:

```bash
docker run -d \
  --name auditforge \
  --restart unless-stopped \
  -p 3000:3000 \
  -p 3001:3001 \
  -e AIML_API_KEY=${AIML_API_KEY} \
  docker.io/yourusername/auditforge:latest
```

---

## 📚 Additional Resources

- **Docker Documentation**: https://docs.docker.com
- **Docker Hub**: https://hub.docker.com
- **NodeOps Marketplace**: https://nodeops.xyz/marketplace
- **AuditForge GitHub**: https://github.com/ShivamSoni20/AuditForge

---

## 🆘 Support

If you encounter issues:

1. Check troubleshooting section above
2. Review Docker logs: `docker logs container-name`
3. Test locally before deploying to NodeOps
4. Verify all prerequisites are met

---

**Your AuditForge Docker image is now ready for NodeOps Template Marketplace! 🚀**
