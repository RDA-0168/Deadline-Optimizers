@echo off
title RailMark AI - Live Online Public Link Generator
echo =========================================================================
echo  RAILMARK AI - INSTANT ONLINE PUBLIC LINK GENERATOR
echo =========================================================================
echo.
echo Starting unified fullstack backend on port 5000...
echo.
start /b node railmark-backend/dist/server.js
timeout /t 2 /nobreak >nul
echo.
echo Creating instant secure HTTPS public tunnel (powered by Cloudflare)...
echo Share the generated HTTPS link with evaluators, teammates or mobile devices!
echo.
npx -y @cloudflare/cloudflared tunnel --url http://localhost:5000
pause
