# =============================================================================
# RailMark AI — Instant Online Public HTTPS Tunnel Launcher
# =============================================================================

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "🚄  RAILMARK AI — INSTANT LIVE PUBLIC LINK GENERATOR" -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host ""

$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $SCRIPT_DIR

Write-Host "🚀 Launching unified backend + frontend on port 5000..." -ForegroundColor Green
$job = Start-Process -FilePath "node" -ArgumentList "railmark-backend/dist/server.js" -WorkingDirectory $SCRIPT_DIR -PassThru -NoNewWindow

Start-Sleep -Seconds 2

Write-Host "🌐 Creating secure public HTTPS tunnel via Cloudflare..." -ForegroundColor Yellow
Write-Host "👉 Anyone worldwide can open this link on their browser or phone to scan QR codes!" -ForegroundColor White
Write-Host ""

npx -y @cloudflare/cloudflared tunnel --url http://localhost:5000
