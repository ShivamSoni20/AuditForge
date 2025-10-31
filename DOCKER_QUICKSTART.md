# 🚀 Docker Quick Start - AuditForge

Get AuditForge running in Docker in 5 minutes!

---

## ⚡ Super Quick Start

### For Windows Users

```powershell
# 1. Build
docker build -t auditforge:latest .

# 2. Run
docker run -d --name auditforge -p 3000:3000 -p 3001:3001 auditforge:latest

# 3. Access
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
```

### For Linux/Mac Users

```bash
# 1. Build
docker build -t auditforge:latest .

# 2. Run
docker run -d --name auditforge -p 3000:3000 -p 3001:3001 auditforge:latest

# 3. Access
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
```

---

## 📦 Publish to Docker Hub (3 Steps)

### Step 1: Login

```bash
docker login
# Enter your Docker Hub username and password
```

### Step 2: Tag & Push

```bash
# Replace 'yourusername' with your Docker Hub username
docker tag auditforge:latest yourusername/auditforge:latest
docker push yourusername/auditforge:latest
```

### Step 3: Copy Image URL

Your public image URL:
```
docker.io/yourusername/auditforge:latest
```

**Use this URL for NodeOps submission!**

---

## 🎯 NodeOps Submission

1. Go to NodeOps Template Marketplace
2. Click "Submit Template"
3. Paste your Docker image URL: `docker.io/yourusername/auditforge:latest`
4. Fill in details from `NODEOPS_TEMPLATE.md`
5. Submit!

---

## 🛠️ Automated Scripts

### Windows

```powershell
.\docker-build.bat
```

### Linux/Mac

```bash
chmod +x docker-build.sh
./docker-build.sh
```

These scripts will:
- ✅ Build the image
- ✅ Tag it properly
- ✅ Push to Docker Hub
- ✅ Test locally

---

## 📋 Common Commands

```bash
# View running containers
docker ps

# View logs
docker logs -f auditforge

# Stop container
docker stop auditforge

# Remove container
docker rm auditforge

# Remove image
docker rmi auditforge:latest

# Clean up everything
docker system prune -a
```

---

## 🐛 Quick Troubleshooting

### Container won't start?
```bash
docker logs auditforge
```

### Port already in use?
```bash
docker run -d -p 8000:3000 -p 8001:3001 auditforge:latest
```

### Need to rebuild?
```bash
docker build --no-cache -t auditforge:latest .
```

---

## 📚 Full Documentation

For detailed instructions, see:
- `DOCKER_DEPLOYMENT.md` - Complete Docker guide
- `NODEOPS_TEMPLATE.md` - NodeOps submission details

---

**That's it! Your Docker image is ready for NodeOps! 🎉**
