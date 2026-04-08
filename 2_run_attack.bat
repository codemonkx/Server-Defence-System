@echo off
title Cyber Attack Simulator (Demo Step 2)
echo =======================================================
echo 🌪️ Launching Cyber Attack Simulator...
echo =======================================================
echo.
echo Stand by. Initiating Denial of Service (DoS) attack against Project Defend Backend...
echo Check your Logs Dashboard in the browser to see the CPU and Traffic spike!
echo.

cd /d %~dp0final-year-pro
python simulate_attacks.py --dos

echo.
echo ✅ Attack payload delivered. The logs have been recorded in the database.
echo You may now proceed to Step 3.
echo.
pause
