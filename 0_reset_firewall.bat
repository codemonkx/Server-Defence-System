@echo off
title Reset AI Firewall
echo =============================================
echo  🔓 Resetting AI Firewall Block Lists...
echo =============================================
echo [] > %~dp0final-year-pro\blocked_ips.json
echo [] > %~dp0final-year-pro\captcha_required_ips.json
echo.
echo ✅ Done! blocked_ips.json and captcha_required_ips.json cleared.
echo    All previously blocked IPs are now unblocked.
echo    The website and AI agent do NOT need to restart.
echo.
pause
