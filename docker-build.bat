@echo off
REM AuditForge Docker Build and Push Script for Windows
REM This script automates building and pushing Docker images to Docker Hub

setlocal enabledelayedexpansion

echo ========================================
echo    AuditForge Docker Build Script
echo ========================================
echo.

REM Configuration
set IMAGE_NAME=auditforge
set VERSION=v1.0.0

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

REM Get Docker Hub username
set /p DOCKER_USERNAME="Enter your Docker Hub username: "

if "%DOCKER_USERNAME%"=="" (
    echo [ERROR] Docker Hub username is required
    pause
    exit /b 1
)

REM Login to Docker Hub
echo.
echo [INFO] Logging in to Docker Hub...
docker login
if errorlevel 1 (
    echo [ERROR] Docker login failed
    pause
    exit /b 1
)

REM Build the image
echo.
echo [INFO] Building Docker image...
docker build -t %IMAGE_NAME%:latest .
if errorlevel 1 (
    echo [ERROR] Build failed!
    pause
    exit /b 1
)

echo [SUCCESS] Build successful!

REM Tag the image
echo.
echo [INFO] Tagging image...
docker tag %IMAGE_NAME%:latest %DOCKER_USERNAME%/%IMAGE_NAME%:latest
docker tag %IMAGE_NAME%:latest %DOCKER_USERNAME%/%IMAGE_NAME%:%VERSION%

REM Show image info
echo.
echo [INFO] Image Information:
docker images | findstr %IMAGE_NAME%

REM Ask to push
echo.
set /p PUSH_CONFIRM="Push to Docker Hub? (y/n): "

if /i "%PUSH_CONFIRM%"=="y" (
    echo.
    echo [INFO] Pushing to Docker Hub...
    docker push %DOCKER_USERNAME%/%IMAGE_NAME%:latest
    docker push %DOCKER_USERNAME%/%IMAGE_NAME%:%VERSION%
    
    echo.
    echo [SUCCESS] Push successful!
    echo.
    echo Your Docker image is now public!
    echo.
    echo Docker Image URL:
    echo docker.io/%DOCKER_USERNAME%/%IMAGE_NAME%:latest
    echo.
    echo Use this URL for NodeOps Template Marketplace submission
) else (
    echo [INFO] Skipping push
)

REM Test the image
echo.
set /p TEST_CONFIRM="Test the image locally? (y/n): "

if /i "%TEST_CONFIRM%"=="y" (
    echo.
    echo [INFO] Starting test container...
    docker run -d --name auditforge-test -p 3000:3000 -p 3001:3001 %DOCKER_USERNAME%/%IMAGE_NAME%:latest
    
    echo.
    echo [SUCCESS] Container started!
    echo.
    echo Access your application:
    echo   Frontend: http://localhost:3000
    echo   Backend:  http://localhost:3001
    echo.
    echo View logs: docker logs -f auditforge-test
    echo Stop test: docker stop auditforge-test ^&^& docker rm auditforge-test
)

echo.
echo [SUCCESS] Done!
echo.
pause
