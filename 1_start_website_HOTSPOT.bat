@echo off
title Project Defend Web Server - HOTSPOT DEMO MODE
echo ================================================================
echo  🌐  Project Defend Platform - HOTSPOT DEMO MODE
echo ================================================================
echo.
echo  This mode allows your PHONE to view the website!
echo  Your phone must be connected to THIS PC's Mobile Hotspot.
echo.
echo  📱  Open this on your phone:
echo      http://192.168.137.1:3000
echo.
echo ================================================================
echo.

echo [0/3] Resetting AI Firewall for fresh demo...
echo [] > %~dp0final-year-pro\blocked_ips.json

echo [1/3] Opening Firewall for phone access...
netsh advfirewall firewall add rule name="Project Defend Frontend Demo" dir=in action=allow protocol=TCP localport=3000 >nul 2>&1
netsh advfirewall firewall add rule name="Project Defend Backend Demo" dir=in action=allow protocol=TCP localport=8080 >nul 2>&1
echo       Done! Firewall rules set.

echo [2/3] Launching Node.js Backend on Port 8080...
start "Project Defend Backend" cmd /k "cd /d %~dp0Elearning-Platform-Using-MERN\backend && npm run server"

echo [3/3] Launching React Frontend on Port 3000...
start "Project Defend Frontend" cmd /k "cd /d %~dp0Elearning-Platform-Using-MERN\frontend && npm start"

echo.
echo ✅ All servers are spinning up!
echo.
echo ================================================================
echo  📱  ON YOUR PHONE (connected to this PC's hotspot):
echo      Open browser and go to: http://192.168.137.1:3000
echo ================================================================
echo.
pause
