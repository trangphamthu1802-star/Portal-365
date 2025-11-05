# Swagger Documentation Generator Script for Portal-365 Backend (PowerShell)
# This script generates Swagger documentation from Go annotations

Write-Host "Generating Swagger documentation..." -ForegroundColor Cyan

# Check if swag is installed
$swagPath = Get-Command swag -ErrorAction SilentlyContinue
if (-not $swagPath) {
    Write-Host "Error: swag command not found" -ForegroundColor Red
    Write-Host "Please install swag first:" -ForegroundColor Yellow
    Write-Host "   go install github.com/swaggo/swag/cmd/swag@latest" -ForegroundColor White
    exit 1
}

# Navigate to backend directory (script location)
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Generate Swagger documentation
Write-Host "Running swag init..." -ForegroundColor Yellow

swag init -g cmd/server/main.go -o docs/swagger --parseDependency --parseInternal

# Check if generation was successful
if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "SUCCESS: Swagger documentation generated!" -ForegroundColor Green
    Write-Host "Output directory: docs/swagger/" -ForegroundColor White
    Write-Host "Files created:" -ForegroundColor White
    Write-Host "   - docs/swagger/docs.go" -ForegroundColor Gray
    Write-Host "   - docs/swagger/swagger.json" -ForegroundColor Gray
    Write-Host "   - docs/swagger/swagger.yaml" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Access Swagger UI at: http://localhost:8080/swagger/index.html" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "FAILED to generate Swagger documentation" -ForegroundColor Red
    exit 1
}
