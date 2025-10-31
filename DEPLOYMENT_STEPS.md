# 🚀 Complete Deployment Steps - AuditForge

## ⚠️ Docker Not Installed

Docker is not currently installed on your system. Follow the steps below to complete the deployment.

---

## 📋 Step-by-Step Action Plan

### ✅ Step 1: Install Docker Desktop

1. **Download Docker Desktop**:
   - Windows: https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe
   - Mac: https://desktop.docker.com/mac/main/amd64/Docker.dmg
   - Linux: https://docs.docker.com/engine/install/

2. **Install Docker Desktop**:
   - Run the installer
   - Follow installation wizard
   - Restart your computer if prompted

3. **Verify Installation**:
   ```bash
   docker --version
   # Should show: Docker version 24.x.x or higher
   ```

4. **Start Docker Desktop**:
   - Open Docker Desktop application
   - Wait for it to start (green icon in system tray)

---

### ✅ Step 2: Create Docker Hub Account

1. **Sign Up**:
   - Go to https://hub.docker.com/signup
   - Create free account
   - Verify email

2. **Note Your Username**:
   - Example: `shivamsoni20`
   - You'll need this for tagging images

---

### ✅ Step 3: Build Docker Image

Once Docker is installed:

```bash
# Navigate to project directory
cd "d:\Gihtub Main\ai-powered-smart-contract-auditor"

# Build the image (takes 5-10 minutes)
docker build -t auditforge:latest .
```

**Expected Output**:
```
[+] Building 300.5s (20/20) FINISHED
 => [internal] load build definition
 => => transferring dockerfile
 => [internal] load .dockerignore
 => [stage-1 1/5] FROM docker.io/library/node:18-alpine
 ...
 => => naming to docker.io/library/auditforge:latest
```

---

### ✅ Step 4: Test Locally

```bash
# Run the container
docker run -d --name auditforge-test -p 3000:3000 -p 3001:3001 auditforge:latest

# Check if running
docker ps

# View logs
docker logs -f auditforge-test
```

**Test Access**:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001/api/health

**Stop Test**:
```bash
docker stop auditforge-test
docker rm auditforge-test
```

---

### ✅ Step 5: Login to Docker Hub

```bash
# Login
docker login

# Enter credentials:
# Username: your-dockerhub-username
# Password: your-dockerhub-password
```

**Expected Output**:
```
Login Succeeded
```

---

### ✅ Step 6: Tag and Push Image

```bash
# Replace 'yourusername' with your Docker Hub username
docker tag auditforge:latest yourusername/auditforge:latest
docker tag auditforge:latest yourusername/auditforge:v1.0.0

# Push to Docker Hub (takes 5-15 minutes)
docker push yourusername/auditforge:latest
docker push yourusername/auditforge:v1.0.0
```

**Expected Output**:
```
The push refers to repository [docker.io/yourusername/auditforge]
abc123: Pushed
def456: Pushed
...
latest: digest: sha256:abc123... size: 1234
```

---

### ✅ Step 7: Verify on Docker Hub

1. Go to https://hub.docker.com
2. Login to your account
3. Navigate to **Repositories**
4. Find `auditforge`
5. Verify:
   - ✅ Image is visible
   - ✅ Tags: `latest`, `v1.0.0`
   - ✅ Size: ~500MB

---

### ✅ Step 8: Make Repository Public

1. Click on `auditforge` repository
2. Go to **Settings**
3. Under **Visibility**, select **Public**
4. Click **Save**

---

### ✅ Step 9: Get Docker Image URL

Your public Docker image URL:
```
docker.io/yourusername/auditforge:latest
```

**Example**:
```
docker.io/shivamsoni20/auditforge:latest
```

**Copy this URL - you'll need it for NodeOps!**

---

### ✅ Step 10: Test Pull from Docker Hub

```bash
# Remove local image
docker rmi yourusername/auditforge:latest

# Pull from Docker Hub
docker pull yourusername/auditforge:latest

# Run pulled image
docker run -d --name auditforge -p 3000:3000 -p 3001:3001 yourusername/auditforge:latest

# Test it works
curl http://localhost:3001/api/health
```

---

### ✅ Step 11: Submit to NodeOps

1. **Go to NodeOps Template Marketplace**:
   - URL: https://nodeops.xyz/marketplace (or your NodeOps platform)

2. **Click "Submit Template"**

3. **Fill in Template Information**:
   - **Name**: AuditForge
   - **Category**: Development Tools / Security
   - **Docker Image URL**: `docker.io/yourusername/auditforge:latest`
   - **Description**: 
     ```
     AI-powered smart contract security auditor for DePIN and NodeOps. 
     Features multi-layer scanning, code correction, and PDF reports.
     ```

4. **Specify Ports**:
   - Port 3000: Frontend (Web UI)
   - Port 3001: Backend API

5. **Environment Variables**:
   - `AIML_API_KEY` (optional): AI analysis API key

6. **Resource Requirements**:
   - CPU: 1 core minimum
   - RAM: 1GB minimum
   - Storage: 2GB minimum

7. **Health Check**:
   - Endpoint: `http://localhost:3001/api/health`

8. **Documentation** (optional):
   - Upload `NODEOPS_TEMPLATE.md`

9. **Submit for Review**

---

## 🎯 Alternative: Use Automated Script

### For Windows (After Docker is installed):

```powershell
# Run automated build script
.\docker-build.bat
```

### For Linux/Mac (After Docker is installed):

```bash
# Make script executable
chmod +x docker-build.sh

# Run automated build script
./docker-build.sh
```

The script will:
1. ✅ Prompt for Docker Hub username
2. ✅ Build the image
3. ✅ Tag it properly
4. ✅ Push to Docker Hub
5. ✅ Test locally
6. ✅ Provide image URL

---

## 📊 Progress Checklist

Track your progress:

- [ ] Docker Desktop installed
- [ ] Docker Desktop running
- [ ] Docker Hub account created
- [ ] Image built successfully
- [ ] Image tested locally
- [ ] Logged into Docker Hub
- [ ] Image tagged correctly
- [ ] Image pushed to Docker Hub
- [ ] Repository made public
- [ ] Image URL copied
- [ ] Pulled from Docker Hub (verification)
- [ ] NodeOps submission prepared
- [ ] Template submitted to NodeOps

---

## 🐛 Common Issues

### Issue: Docker command not found

**Solution**: Docker Desktop not installed or not running
- Install Docker Desktop
- Start Docker Desktop application
- Wait for green icon in system tray

### Issue: Build fails with "npm install" error

**Solution**: Network or cache issue
```bash
docker build --no-cache -t auditforge:latest .
```

### Issue: Port already in use

**Solution**: Another service using ports 3000/3001
```bash
# Use different ports
docker run -d -p 8000:3000 -p 8001:3001 auditforge:latest
```

### Issue: Push denied

**Solution**: Not logged in or wrong credentials
```bash
docker logout
docker login
# Enter correct credentials
```

### Issue: Image too large

**Solution**: Already optimized with multi-stage build
- Current size: ~500MB (acceptable)
- Uses Alpine Linux (minimal)

---

## 📚 Documentation Reference

- **Quick Start**: `DOCKER_QUICKSTART.md`
- **Complete Guide**: `DOCKER_DEPLOYMENT.md`
- **NodeOps Template**: `NODEOPS_TEMPLATE.md`
- **Main README**: `README.md`

---

## 🎯 Summary

### What You Need to Do:

1. **Install Docker Desktop** (15 minutes)
2. **Build Image** (10 minutes)
3. **Test Locally** (5 minutes)
4. **Push to Docker Hub** (15 minutes)
5. **Submit to NodeOps** (10 minutes)

**Total Time**: ~1 hour

### What You'll Get:

- ✅ Production-ready Docker image
- ✅ Public Docker Hub repository
- ✅ NodeOps marketplace listing
- ✅ Deployable template for users

---

## 🚀 Quick Commands Summary

```bash
# 1. Build
docker build -t auditforge:latest .

# 2. Test
docker run -d --name test -p 3000:3000 -p 3001:3001 auditforge:latest

# 3. Login
docker login

# 4. Tag
docker tag auditforge:latest yourusername/auditforge:latest

# 5. Push
docker push yourusername/auditforge:latest

# 6. Your Image URL
# docker.io/yourusername/auditforge:latest
```

---

## 💡 Pro Tips

1. **Use Automated Script**: `docker-build.bat` or `docker-build.sh`
2. **Test Thoroughly**: Always test locally before pushing
3. **Version Tags**: Use both `latest` and `v1.0.0` tags
4. **Documentation**: Keep `NODEOPS_TEMPLATE.md` updated
5. **Monitor**: Check Docker Hub for download stats

---

## 📞 Need Help?

- **Docker Issues**: https://docs.docker.com/get-started/
- **Docker Hub**: https://docs.docker.com/docker-hub/
- **NodeOps**: Check NodeOps documentation
- **Project Issues**: GitHub Issues

---

**Start with Step 1: Install Docker Desktop! 🐳**

**Download**: https://www.docker.com/get-started
