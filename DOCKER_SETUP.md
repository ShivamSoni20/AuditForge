# 🐳 Docker Setup Guide for AuditForge

This guide will help you run AuditForge using Docker and Docker Compose.

## Prerequisites

- Docker installed ([Download Docker](https://www.docker.com/products/docker-desktop))
- Docker Compose installed (included with Docker Desktop)
- AIML API Key ([Get your key](https://aimlapi.com))

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/ShivamSoni20/AuditForge.git
cd AuditForge
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
# Copy the example
cp backend/.env.example .env

# Edit with your API key
AIML_API_KEY=your_api_key_here
```

### 3. Build and Run with Docker Compose

```bash
# Build and start the container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

The application will be available at:
- **Frontend & API**: http://localhost:3000

### 4. Build Docker Image Manually (Optional)

```bash
# Build the image
docker build -t auditforge:latest .

# Run the container
docker run -d \
  -p 3000:3000 \
  -e AIML_API_KEY=your_api_key_here \
  -e NODE_ENV=production \
  --name auditforge \
  auditforge:latest

# View logs
docker logs -f auditforge

# Stop and remove
docker stop auditforge
docker rm auditforge
```

## Docker Configuration

### Multi-Stage Build

The Dockerfile uses a multi-stage build process:

1. **Stage 1**: Builds the React frontend
2. **Stage 2**: Installs backend dependencies
3. **Stage 3**: Creates final production image with both frontend and backend

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `AIML_API_KEY` | Your AIML API key (required) | - |
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `3000` |
| `AIML_BASE_URL` | AIML API base URL | `https://api.aimlapi.com/v1` |

### Health Check

The container includes a health check that runs every 30 seconds:
- Endpoint: `http://localhost:3000/api/health`
- Interval: 30s
- Timeout: 10s
- Retries: 3

## Docker Commands Reference

### View Running Containers
```bash
docker ps
```

### View All Containers
```bash
docker ps -a
```

### View Container Logs
```bash
docker logs auditforge
docker logs -f auditforge  # Follow logs
```

### Execute Commands in Container
```bash
docker exec -it auditforge sh
```

### Restart Container
```bash
docker restart auditforge
```

### Remove Container and Image
```bash
docker stop auditforge
docker rm auditforge
docker rmi auditforge:latest
```

## Docker Compose Commands

### Start Services
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### Rebuild and Start
```bash
docker-compose up -d --build
```

### View Logs
```bash
docker-compose logs -f
```

### Scale Services (if needed)
```bash
docker-compose up -d --scale auditforge=3
```

## Troubleshooting

### Container Won't Start

1. Check logs:
   ```bash
   docker logs auditforge
   ```

2. Verify environment variables:
   ```bash
   docker exec auditforge env
   ```

3. Check if port is already in use:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   
   # Linux/Mac
   lsof -i :3000
   ```

### API Key Issues

Make sure your `.env` file contains the correct API key:
```bash
AIML_API_KEY=your_actual_api_key_here
```

### Build Failures

1. Clear Docker cache:
   ```bash
   docker builder prune
   ```

2. Rebuild without cache:
   ```bash
   docker build --no-cache -t auditforge:latest .
   ```

### Health Check Failing

1. Check if the backend is running:
   ```bash
   docker exec auditforge curl http://localhost:3000/api/health
   ```

2. Verify the health check endpoint in your backend code

## Production Deployment

### Push to Docker Hub

```bash
# Tag the image
docker tag auditforge:latest yourusername/auditforge:latest

# Login to Docker Hub
docker login

# Push the image
docker push yourusername/auditforge:latest
```

### Deploy to Cloud

#### AWS ECS
```bash
# Install AWS CLI and configure
aws configure

# Create ECR repository
aws ecr create-repository --repository-name auditforge

# Tag and push
docker tag auditforge:latest <account-id>.dkr.ecr.<region>.amazonaws.com/auditforge:latest
docker push <account-id>.dkr.ecr.<region>.amazonaws.com/auditforge:latest
```

#### Google Cloud Run
```bash
# Tag for GCR
docker tag auditforge:latest gcr.io/<project-id>/auditforge:latest

# Push to GCR
docker push gcr.io/<project-id>/auditforge:latest

# Deploy
gcloud run deploy auditforge \
  --image gcr.io/<project-id>/auditforge:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

#### Azure Container Instances
```bash
# Create resource group
az group create --name auditforge-rg --location eastus

# Create container
az container create \
  --resource-group auditforge-rg \
  --name auditforge \
  --image auditforge:latest \
  --dns-name-label auditforge \
  --ports 3000
```

## Performance Optimization

### Image Size Optimization

The current Dockerfile uses Alpine Linux for minimal size:
- Base image: `node:18-alpine` (~40MB)
- Final image size: ~200-300MB

### Resource Limits

Add resource limits in docker-compose.yml:

```yaml
services:
  auditforge:
    # ... other config
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

## Security Best Practices

1. **Don't commit .env files** - Already in .gitignore
2. **Use secrets management** for production
3. **Run as non-root user** (add to Dockerfile if needed)
4. **Keep base images updated**
5. **Scan for vulnerabilities**:
   ```bash
   docker scan auditforge:latest
   ```

## Support

For issues or questions:
- GitHub Issues: https://github.com/ShivamSoni20/AuditForge/issues
- Documentation: https://github.com/ShivamSoni20/AuditForge

## License

MIT License - See LICENSE file for details
