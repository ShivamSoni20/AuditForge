# AuditForge - NodeOps Template

## 📋 Template Information

**Name**: AuditForge  
**Category**: Development Tools / Security  
**Version**: 1.0.0  
**License**: MIT

## 📝 Description

AuditForge is an AI-powered smart contract security auditor specialized for DePIN (Decentralized Physical Infrastructure Networks) and NodeOps ecosystems. It provides comprehensive security analysis, vulnerability detection, and automated code correction for Solidity and Rust smart contracts.

### Key Features

- 🤖 **AI-Powered Analysis** - GPT-4o integration for intelligent vulnerability detection
- 🔍 **Multi-Layer Scanning** - Combines AI, static analysis, and DePIN-specific checks
- ⚡ **Fast Results** - Complete audits in under 60 seconds
- 🌐 **DePIN Specialized** - Node operator risks, staking, slashing mechanisms
- 🔨 **Code Correction** - AI-powered automatic vulnerability fixes
- 📊 **PDF Reports** - Professional downloadable audit reports
- 🔧 **Multi-Language** - Solidity and Rust support

## 🐳 Docker Image

**Public Image URL**:
```
docker.io/yourusername/auditforge:latest
```

**Image Size**: ~500MB  
**Base Image**: node:18-alpine  
**Architecture**: linux/amd64, linux/arm64

## 🚀 Quick Deploy

### One-Line Deploy

```bash
docker run -d \
  --name auditforge \
  --restart unless-stopped \
  -p 3000:3000 \
  -p 3001:3001 \
  -e AIML_API_KEY=${AIML_API_KEY} \
  docker.io/yourusername/auditforge:latest
```

### Docker Compose

```yaml
version: '3.8'

services:
  auditforge:
    image: docker.io/yourusername/auditforge:latest
    container_name: auditforge
    ports:
      - "3000:3000"
      - "3001:3001"
    environment:
      - AIML_API_KEY=${AIML_API_KEY}
    restart: unless-stopped
```

## 🔌 Ports

| Port | Service | Description |
|------|---------|-------------|
| 3000 | Frontend | Web UI (React + Vite) |
| 3001 | Backend | REST API (Node.js + Express) |

## 🔧 Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `AIML_API_KEY` | No | None | AIML API key for AI-powered analysis |
| `AIML_BASE_URL` | No | `https://api.aimlapi.com/v1` | AIML API base URL |
| `NODE_ENV` | No | `production` | Node environment |
| `PORT` | No | `3001` | Backend API port |

**Note**: Application works without `AIML_API_KEY` using fallback pattern-based analysis.

## 📊 Resource Requirements

### Minimum Requirements

- **CPU**: 1 core
- **RAM**: 1GB
- **Storage**: 2GB
- **Network**: Outbound HTTPS (for AI API)

### Recommended Requirements

- **CPU**: 2 cores
- **RAM**: 2GB
- **Storage**: 5GB
- **Network**: Outbound HTTPS

## 🏥 Health Check

**Endpoint**: `http://localhost:3001/api/health`

**Expected Response**:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Health Check Command**:
```bash
curl http://localhost:3001/api/health
```

## 🎯 Usage

### Access the Application

1. **Web Interface**: Navigate to `http://your-node-ip:3000`
2. **API Endpoint**: `http://your-node-ip:3001`

### Audit a Smart Contract

1. Open the web interface
2. Paste or upload your smart contract code
3. Select language (Solidity or Rust)
4. Click "Run Audit"
5. Review results and download PDF report

### API Usage

```bash
# Audit a contract via API
curl -X POST http://your-node-ip:3001/api/audit \
  -H "Content-Type: application/json" \
  -d '{
    "code": "pragma solidity ^0.8.0; contract Test { }",
    "language": "solidity",
    "contractName": "Test"
  }'
```

## 🔐 Security Features

- Reentrancy detection
- Access control analysis
- Integer overflow/underflow checks
- Unchecked external calls
- tx.origin usage detection
- Timestamp dependence
- DePIN-specific vulnerabilities
- Node operator security
- Staking/slashing mechanism analysis

## 📚 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/audit` | POST | Audit smart contract |
| `/api/audits` | GET | Get audit history |
| `/api/report/:id` | POST | Generate PDF report |
| `/api/correct-code` | POST | AI code correction |

## 🧪 Testing the Deployment

### 1. Check Container Status

```bash
docker ps | grep auditforge
```

### 2. View Logs

```bash
docker logs -f auditforge
```

### 3. Test Health Endpoint

```bash
curl http://localhost:3001/api/health
```

### 4. Test Frontend

Open browser: `http://localhost:3000`

### 5. Test Full Audit

```bash
curl -X POST http://localhost:3001/api/audit \
  -H "Content-Type: application/json" \
  -d '{
    "code": "contract NodeStaking { mapping(address => uint) stakes; }",
    "language": "solidity",
    "contractName": "NodeStaking"
  }'
```

## 🐛 Troubleshooting

### Container Won't Start

```bash
# Check logs
docker logs auditforge

# Restart container
docker restart auditforge
```

### Port Already in Use

```bash
# Use different ports
docker run -d \
  -p 8000:3000 \
  -p 8001:3001 \
  docker.io/yourusername/auditforge:latest
```

### API Not Responding

```bash
# Check backend health
docker exec auditforge curl http://localhost:3001/api/health

# Check if backend process is running
docker exec auditforge ps aux | grep node
```

### Frontend Not Loading

```bash
# Check if frontend is built
docker exec auditforge ls /app/frontend/dist

# Restart container
docker restart auditforge
```

## 📈 Monitoring

### View Real-time Logs

```bash
docker logs -f auditforge
```

### Check Resource Usage

```bash
docker stats auditforge
```

### Inspect Container

```bash
docker inspect auditforge
```

## 🔄 Updates

### Pull Latest Version

```bash
# Stop current container
docker stop auditforge
docker rm auditforge

# Pull latest image
docker pull docker.io/yourusername/auditforge:latest

# Start new container
docker run -d \
  --name auditforge \
  -p 3000:3000 \
  -p 3001:3001 \
  docker.io/yourusername/auditforge:latest
```

## 🛠️ Advanced Configuration

### Custom Environment Variables

```bash
docker run -d \
  --name auditforge \
  -p 3000:3000 \
  -p 3001:3001 \
  -e AIML_API_KEY=your_key \
  -e NODE_ENV=production \
  -e PORT=3001 \
  docker.io/yourusername/auditforge:latest
```

### Persistent Data (Optional)

```bash
docker run -d \
  --name auditforge \
  -p 3000:3000 \
  -p 3001:3001 \
  -v auditforge-data:/app/data \
  docker.io/yourusername/auditforge:latest
```

### Network Configuration

```bash
# Create custom network
docker network create auditforge-network

# Run with custom network
docker run -d \
  --name auditforge \
  --network auditforge-network \
  -p 3000:3000 \
  -p 3001:3001 \
  docker.io/yourusername/auditforge:latest
```

## 📞 Support

- **GitHub**: https://github.com/ShivamSoni20/AuditForge
- **Issues**: https://github.com/ShivamSoni20/AuditForge/issues
- **Documentation**: See README.md in repository

## 📄 License

MIT License - Free to use, modify, and distribute

---

## ✅ NodeOps Marketplace Checklist

- [x] Docker image is public
- [x] Image size < 1GB
- [x] Health check implemented
- [x] Documentation complete
- [x] Ports documented
- [x] Environment variables documented
- [x] Resource requirements specified
- [x] Tested on clean system
- [x] Security features documented
- [x] API endpoints documented

---

**Ready for NodeOps Template Marketplace submission! 🚀**

**Docker Image URL**: `docker.io/yourusername/auditforge:latest`
