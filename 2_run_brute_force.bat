@echo off
title Brute Force Attack Simulator (Project Defend Step 2B)
echo =======================================================
echo  Launching Brute Force Attack Simulator...
echo =======================================================
echo.
echo Stand by. Initiating Brute Force attack against Project Defend Login...
echo This will attempt multiple rapid logins to trigger the AI Defense Agent.
echo.

cd /d %~dp0final-year-pro
python brute_force_attack.py

echo.
echo  Attack simulation finished.
echo.
pause
