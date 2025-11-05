# Portal 365 - First Time Setup Script
# This script sets up both backend and frontend for the first time

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "   Portal 365 - First Time Setup    " -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Get the script's directory (project root)
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendPath = Join-Path $projectRoot "backend"
$frontendPath = Join-Path $projectRoot "frontend"

Write-Host "[INFO] Project root: $projectRoot" -ForegroundColor Green
Write-Host ""

# Function to check if a command exists
function Test-Command {
    param([string]$Command)
    $null -ne (Get-Command $Command -ErrorAction SilentlyContinue)
}

# Check prerequisites
Write-Host "[CHECKING] Prerequisites..." -ForegroundColor Yellow
Write-Host ""

$allPrereqsMet = $true

# Check Go
if (Test-Command "go") {
    $goVersion = go version
    Write-Host "[OK] Go installed: $goVersion" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Go not found! Please install Go 1.21 or higher" -ForegroundColor Red
    Write-Host "   Download from: https://golang.org/dl/" -ForegroundColor Yellow
    $allPrereqsMet = $false
}

# Check Node.js
if (Test-Command "node") {
    $nodeVersion = node --version
    Write-Host "[OK] Node.js installed: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Node.js not found! Please install Node.js 18+" -ForegroundColor Red
    Write-Host "   Download from: https://nodejs.org/" -ForegroundColor Yellow
    $allPrereqsMet = $false
}

# Check npm
if (Test-Command "npm") {
    $npmVersion = npm --version
    Write-Host "[OK] npm installed: v$npmVersion" -ForegroundColor Green
} else {
    Write-Host "[ERROR] npm not found! It should come with Node.js" -ForegroundColor Red
    $allPrereqsMet = $false
}

Write-Host ""

if (-not $allPrereqsMet) {
    Write-Host "[WARNING] Please install missing prerequisites and run this script again" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Backend Setup
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "   Setting up Backend (Go)          " -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

Set-Location $backendPath

# Download Go dependencies
Write-Host "[INSTALLING] Downloading Go dependencies..." -ForegroundColor Yellow
go mod download
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Failed to download Go dependencies" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "[OK] Go dependencies downloaded" -ForegroundColor Green
Write-Host ""

# Create .env file if it doesn't exist
$envFile = Join-Path $backendPath ".env"
$envExampleFile = Join-Path $backendPath ".env.example"

if (-not (Test-Path $envFile)) {
    if (Test-Path $envExampleFile) {
        Write-Host "[CREATING] .env file from .env.example..." -ForegroundColor Yellow
        Copy-Item $envExampleFile $envFile
        Write-Host "[OK] .env file created" -ForegroundColor Green
        Write-Host "   You may need to edit backend/.env with your settings" -ForegroundColor Cyan
    } else {
        Write-Host "[WARNING] .env.example not found, creating default .env..." -ForegroundColor Yellow
        @"
APP_ENV=development
PORT=8080
DATABASE_DSN=file:portal.db?_busy_timeout=5000&_journal_mode=WAL&_foreign_keys=on
JWT_SECRET=change-this-secret-key-in-production
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL=720h
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
"@ | Out-File -FilePath $envFile -Encoding UTF8
        Write-Host "[OK] Default .env file created" -ForegroundColor Green
    }
} else {
    Write-Host "[OK] .env file already exists" -ForegroundColor Green
}
Write-Host ""

# Run database migrations and seed
Write-Host "[DATABASE] Setting up database and seeding data..." -ForegroundColor Yellow
go run cmd/seed/main.go
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Failed to seed database" -ForegroundColor Red
    Write-Host "   The database might already be seeded, or there's an error" -ForegroundColor Yellow
} else {
    Write-Host "[OK] Database seeded successfully" -ForegroundColor Green
}
Write-Host ""

# Frontend Setup
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "   Setting up Frontend (React)      " -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

Set-Location $frontendPath

# Install npm dependencies
Write-Host "[INSTALLING] npm dependencies (this may take a few minutes)..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Failed to install npm dependencies" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "[OK] npm dependencies installed" -ForegroundColor Green
Write-Host ""

# Create frontend .env if needed
$frontendEnvFile = Join-Path $frontendPath ".env"
if (-not (Test-Path $frontendEnvFile)) {
    Write-Host "[CREATING] frontend .env file..." -ForegroundColor Yellow
    @"
VITE_API_BASE=http://localhost:8080/api/v1
VITE_SWAGGER_URL=http://localhost:8080/swagger/doc.json
"@ | Out-File -FilePath $frontendEnvFile -Encoding UTF8
    Write-Host "[OK] Frontend .env file created" -ForegroundColor Green
} else {
    Write-Host "[OK] Frontend .env file already exists" -ForegroundColor Green
}
Write-Host ""

# Return to project root
Set-Location $projectRoot

# Summary
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "   Setup Complete!                  " -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "[SUCCESS] Portal 365 is ready to run!" -ForegroundColor Green
Write-Host ""
Write-Host "[NEXT STEPS]" -ForegroundColor Cyan
Write-Host ""
Write-Host "   1. Start the servers:" -ForegroundColor White
Write-Host "      • Run: .\start.ps1" -ForegroundColor Yellow
Write-Host "      • Or manually start:" -ForegroundColor Yellow
Write-Host "        - Backend:  cd backend && go run cmd/server/main.go" -ForegroundColor Gray
Write-Host "        - Frontend: cd frontend && npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "   2. Open your browser:" -ForegroundColor White
Write-Host "      • Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "      • API Docs: http://localhost:8080/swagger/index.html" -ForegroundColor Cyan
Write-Host ""
Write-Host "   3. Login with admin credentials:" -ForegroundColor White
Write-Host "      • Email:    admin@portal365.com" -ForegroundColor Yellow
Write-Host "      • Password: Admin123!" -ForegroundColor Yellow
Write-Host ""
Write-Host "[DOCUMENTATION]" -ForegroundColor Cyan
Write-Host "   • Quick Start: QUICK_START.md" -ForegroundColor White
Write-Host "   • Backend:     backend/README.md" -ForegroundColor White
Write-Host "   • Full Setup:  BACKEND_SETUP.md" -ForegroundColor White
Write-Host ""
Write-Host "[TIP] Run .\start.ps1 to start both servers automatically" -ForegroundColor Green
Write-Host ""

Read-Host "Press Enter to close"
