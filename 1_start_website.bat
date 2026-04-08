@echo off
setlocal
title Project Defend Web Server (Demo Step 1)
echo =======================================================
echo 🌐 Starting Project Defend Platform...
echo =======================================================
echo.

set ROOT_DIR=%~dp0
echo [0/2] Resetting AI Firewall rules for fresh demo...
echo [] > "%ROOT_DIR%final-year-pro\blocked_ips.json"
echo [] > "%ROOT_DIR%final-year-pro\captcha_required_ips.json"

echo [1/2] Launching Node.js Backend on Port 8081...
start "Project Defend Backend" cmd /k "cd /d %ROOT_DIR%Elearning-Platform-Using-MERN\backend && npm run server"

echo [2/2] Launching React Frontend on Port 3000...
start "Project Defend Frontend" cmd /k "cd /d %ROOT_DIR%Elearning-Platform-Using-MERN\frontend && npm start"

echo.
echo ✅ Both servers are spinning up in new windows.
echo Please wait for the browser to open localhost:3000 before proceeding to Step 2.
echo.
pause
