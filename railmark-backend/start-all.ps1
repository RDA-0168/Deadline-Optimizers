# =============================================================================
# RailMark AI — Full-Stack Unified Application Launcher
# Starts Database Persistence + Express REST API Backend + React Frontend
# =============================================================================

Write-Host ""
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "🚄  RAILMARK AI — FULL-STACK UNIFIED APPLICATION LAUNCHER" -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host ""

$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Definition
$PARENT_DIR = Split-Path -Parent $SCRIPT_DIR

$BACKEND_DIR = Join-Path $PARENT_DIR "railmark-backend"
$FRONTEND_DIR = Join-Path $PARENT_DIR "railmark-ai 1st\railmark-ai"
$DB_DIR = Join-Path $PARENT_DIR "database_1st ok"

Write-Host "📁 Database:  $DB_DIR" -ForegroundColor Gray
Write-Host "⚙️  Backend:   $BACKEND_DIR" -ForegroundColor Gray
Write-Host "💻 Frontend:  $FRONTEND_DIR" -ForegroundColor Gray
Write-Host ""

# Ensure Database store exists
$DB_INIT = Join-Path $DB_DIR "db-init.js"
if (Test-Path $DB_INIT) {
    Write-Host "⚡ Checking persistent database storage..." -ForegroundColor Yellow
    node $DB_INIT
}

# Start Backend Server
Write-Host "🚀 Launching Backend REST API on port 5000..." -ForegroundColor Green
$backendJob = Start-Process -FilePath "node" -ArgumentList "dist/server.js" -WorkingDirectory $BACKEND_DIR -PassThru -NoNewWindow

Start-Sleep -Seconds 2

# Start Frontend Dev Server
Write-Host "🌐 Launching Frontend Application on port 5173..." -ForegroundColor Green
Write-Host ""
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "✅ SYSTEM ACTIVE & READY:" -ForegroundColor Green
Write-Host "👉 Frontend Web App:     http://localhost:5173" -ForegroundColor White
Write-Host "👉 Backend REST API:     http://localhost:5000/api" -ForegroundColor White
Write-Host "👉 Swagger API Docs:     http://localhost:5000/api-docs" -ForegroundColor White
Write-Host ""
Write-Host "🔐 Demo Credentials:" -ForegroundColor Yellow
Write-Host "   Admin:      admin@railmark.demo / admin123" -ForegroundColor Gray
Write-Host "   Inspector:  inspector@railmark.demo / demo123" -ForegroundColor Gray
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host ""

Set-Location $FRONTEND_DIR
npm run dev
