@echo off
REM Peer2Pool Windows Deployment Script

echo 🚀 Starting Peer2Pool Deployment...

REM Check Node.js installation
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed or not in PATH
    pause
    exit /b 1
)

echo ✅ Node.js found

REM Install dependencies
echo 📦 Installing dependencies...
call npm install
if errorlevel 1 (
    echo ❌ Failed to install root dependencies
    pause
    exit /b 1
)

cd client
call npm install
if errorlevel 1 (
    echo ❌ Failed to install client dependencies
    pause
    exit /b 1
)
cd ..

cd server
call npm install
if errorlevel 1 (
    echo ❌ Failed to install server dependencies
    pause
    exit /b 1
)
cd ..

echo ✅ Dependencies installed

REM Build frontend
echo 🏗️ Building frontend...
cd client
call npm run build
if errorlevel 1 (
    echo ❌ Frontend build failed
    pause
    exit /b 1
)
cd ..

echo ✅ Frontend built successfully

REM Check if build directory exists
if not exist "client\build\index.html" (
    echo ❌ Build verification failed
    pause
    exit /b 1
)

echo ✅ Build verification passed

echo.
echo 🎉 Build completed successfully!
echo.
echo Next steps:
echo 1. Set up environment variables in .env files
echo 2. Deploy frontend to Vercel: npx vercel --prod
echo 3. Deploy backend to Firebase: firebase deploy
echo.
pause