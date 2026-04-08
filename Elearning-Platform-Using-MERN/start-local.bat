@echo off
echo ==========================================
echo   Project Defend: Smart Defense Platform Starter
echo ==========================================
echo.

:: Check for node_modules in root
if not exist "node_modules\" (
    echo [1/3] Installing root dependencies...
    call npm install
)

:: Check for node_modules in backend
if not exist "backend\node_modules\" (
    echo [2/3] Installing backend dependencies...
    cd backend
    call npm install
    cd ..
)

:: Check for node_modules in frontend
if not exist "frontend\node_modules\" (
    echo [3/3] Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
)

echo.
echo Cleaning up old processes to prevent conflicts...
taskkill /f /im node.exe /t >nul 2>&1

:: Fix for Node.js 17+ / v25 crypto changes in frontend
set NODE_OPTIONS=--openssl-legacy-provider

echo.
echo Launching Backend and Frontend...
echo.
npm run dev
pause
