@echo off
title XSS Cyber Attack Simulator (Demo Step 2C)
echo =======================================================
echo  XSS CYBER ATTACK SIMULATOR
echo =======================================================
echo.
echo Stand by. Launching XSS attack simulation...
echo.
cd /d %~dp0final-year-pro
python xss_attack.py
echo.
pause
