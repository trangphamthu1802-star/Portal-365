# Portal 365 - Start All Services
# This script starts both backend and frontend in separate PowerShell windows

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "   Portal 365 - Starting Services   " -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Get the script's directory (project root)
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

# Backend path
$backendPath = Join-Path $projectRoot "backend"
# Frontend path
$frontendPath = Join-Path $projectRoot "frontend"

# Check if backend directory exists
if (-not (Test-Path $backendPath)) {
    Write-Host "[ERROR] Backend directory not found!" -ForegroundColor Red
    Write-Host "   Expected: $backendPath" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if frontend directory exists
if (-not (Test-Path $frontendPath)) {
    Write-Host "[ERROR] Frontend directory not found!" -ForegroundColor Red
    Write-Host "   Expected: $frontendPath" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "[INFO] Project root: $projectRoot" -ForegroundColor Green
Write-Host ""

# Start Backend Server
Write-Host "[STARTING] Backend Server (Go)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "cd '$backendPath'; Write-Host '[BACKEND] Server Starting...' -ForegroundColor Cyan; Write-Host 'API: http://localhost:8080' -ForegroundColor Green; Write-Host 'Swagger: http://localhost:8080/swagger/index.html' -ForegroundColor Green; Write-Host ''; go run cmd/server/main.go"
)

Start-Sleep -Seconds 2

# Start Frontend Server
Write-Host "[STARTING] Frontend Server (React + Vite)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "cd '$frontendPath'; Write-Host '[FRONTEND] Server Starting...' -ForegroundColor Cyan; Write-Host 'App: http://localhost:5173' -ForegroundColor Green; Write-Host ''; npm run dev"
)

Start-Sleep -Seconds 2

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "   Services Started Successfully     " -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "[Frontend]  http://localhost:5173" -ForegroundColor Green
Write-Host "[Backend]   http://localhost:8080" -ForegroundColor Green
Write-Host "[Swagger]   http://localhost:8080/swagger/index.html" -ForegroundColor Green
Write-Host ""
Write-Host "[ADMIN LOGIN]" -ForegroundColor Yellow
Write-Host "   Email:    admin@portal365.com" -ForegroundColor White
Write-Host "   Password: Admin123!" -ForegroundColor White
Write-Host ""
Write-Host "[TIP] Both servers are running in separate windows" -ForegroundColor Cyan
Write-Host "      Close this window safely - servers will keep running" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C in each server window to stop them" -ForegroundColor Yellow
Write-Host ""

Read-Host "Press Enter to close this window"
