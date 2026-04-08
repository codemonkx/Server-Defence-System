@echo off
setlocal
title Project Defend AI Agent (Term 3)
echo =======================================================
echo 🛡️ Starting Project Defend AI Defense Agent...
echo =======================================================
echo.

set ROOT_DIR=%~dp0
cd /d %ROOT_DIR%final-year-pro

echo [1/1] Launching AI Agent Bridge...
python ml_bridge.py

echo.
pause
