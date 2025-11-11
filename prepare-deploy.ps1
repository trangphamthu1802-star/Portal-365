# Script chuẩn bị files để deploy Portal-365

Write-Host "=== Portal-365 Deployment Package Builder ===" -ForegroundColor Cyan
Write-Host ""

# Định nghĩa đường dẫn
$rootPath = $PSScriptRoot
$deployPath = Join-Path $rootPath "portal-365-deploy"
$zipPath = Join-Path $rootPath "portal-365-deploy.zip"

# Xóa thư mục deploy cũ nếu có
if (Test-Path $deployPath) {
    Write-Host "Removing old deployment folder..." -ForegroundColor Yellow
    Remove-Item $deployPath -Recurse -Force
}

if (Test-Path $zipPath) {
    Write-Host "Removing old zip file..." -ForegroundColor Yellow
    Remove-Item $zipPath -Force
}

# Tạo thư mục deploy
Write-Host "Creating deployment folder..." -ForegroundColor Green
New-Item -ItemType Directory -Path $deployPath -Force | Out-Null

# Copy server.exe
Write-Host "Copying server.exe..." -ForegroundColor Green
if (Test-Path (Join-Path $rootPath "backend\server.exe")) {
    Copy-Item (Join-Path $rootPath "backend\server.exe") -Destination $deployPath
} else {
    Write-Host "ERROR: server.exe not found! Please build backend first." -ForegroundColor Red
    Write-Host "Run: cd backend; go build -o server.exe .\cmd\server" -ForegroundColor Yellow
    exit 1
}

# Copy .env
Write-Host "Copying .env configuration..." -ForegroundColor Green
if (Test-Path (Join-Path $rootPath "backend\.env")) {
    Copy-Item (Join-Path $rootPath "backend\.env") -Destination $deployPath
} else {
    Write-Host "WARNING: .env not found! Creating from .env.example..." -ForegroundColor Yellow
    if (Test-Path (Join-Path $rootPath "backend\.env.example")) {
        Copy-Item (Join-Path $rootPath "backend\.env.example") -Destination (Join-Path $deployPath ".env")
    }
}

# Copy database (optional - có thể tạo mới trên server)
Write-Host "Copying database..." -ForegroundColor Green
if (Test-Path (Join-Path $rootPath "backend\portal.db")) {
    $response = Read-Host "Include database? (y/n) [Default: n]"
    if ($response -eq "y") {
        Copy-Item (Join-Path $rootPath "backend\portal.db") -Destination $deployPath
        Write-Host "Database included" -ForegroundColor Green
    } else {
        Write-Host "Database skipped - will create new on server" -ForegroundColor Yellow
    }
}

# Copy dist folder (frontend)
Write-Host "Copying frontend files..." -ForegroundColor Green
if (Test-Path (Join-Path $rootPath "backend\dist")) {
    Copy-Item (Join-Path $rootPath "backend\dist") -Destination $deployPath -Recurse
} else {
    Write-Host "ERROR: dist folder not found! Please build frontend first." -ForegroundColor Red
    Write-Host "Run: cd frontend; npm run build" -ForegroundColor Yellow
    exit 1
}

# Copy storage folder (uploads)
Write-Host "Copying storage folder..." -ForegroundColor Green
if (Test-Path (Join-Path $rootPath "backend\storage")) {
    Copy-Item (Join-Path $rootPath "backend\storage") -Destination $deployPath -Recurse
} else {
    Write-Host "Creating empty storage folder..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path (Join-Path $deployPath "storage\uploads\articles") -Force | Out-Null
    New-Item -ItemType Directory -Path (Join-Path $deployPath "storage\uploads\videos") -Force | Out-Null
}

# Tạo file README cho deployment
Write-Host "Creating deployment README..." -ForegroundColor Green
$readmeContent = @"
# Portal-365 Deployment Package

## Quick Start

1. Extract this folder to your server (e.g., C:\portal-365)

2. Update .env file:
   - Change JWT_SECRET to a secure random string
   - Update CORS_ALLOWED_ORIGINS if needed
   - Set APP_ENV=production

3. Run server:
   ```
   cd C:\portal-365
   .\server.exe
   ```

4. Access website:
   - Local: http://localhost:8080
   - Network: http://<server-ip>:8080
   - Swagger: http://localhost:8080/swagger/index.html

## Default Login (if database included)
- Email: admin@portal365.com
- Password: admin123

**IMPORTANT**: Change admin password after first login!

## Files Included
- server.exe: Backend application
- .env: Configuration file
- dist/: Frontend SPA files
- storage/: Upload directory
- portal.db: Database (if included)

## Port Configuration
Default port is 8080. To change:
- Edit PORT in .env file
- Or set environment variable: set PORT=8080

## Running as Windows Service
Use NSSM (https://nssm.cc/):
```
nssm install Portal365 "C:\portal-365\server.exe"
nssm set Portal365 AppDirectory "C:\portal-365"
nssm start Portal365
```

## Firewall
Open port 8080:
```
netsh advfirewall firewall add rule name="Portal-365" dir=in action=allow protocol=TCP localport=8080
```

## Support
For detailed instructions, see DEPLOYMENT_GUIDE.md in source repository.
"@

Set-Content -Path (Join-Path $deployPath "README.txt") -Value $readmeContent

# Tạo file zip
Write-Host ""
Write-Host "Creating deployment package..." -ForegroundColor Green
Compress-Archive -Path "$deployPath\*" -DestinationPath $zipPath -Force

# Hiển thị kết quả
Write-Host ""
Write-Host "=== Deployment Package Created Successfully! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Deployment folder: $deployPath" -ForegroundColor Cyan
Write-Host "Deployment package: $zipPath" -ForegroundColor Cyan
Write-Host ""
Write-Host "Package size:" -ForegroundColor Yellow
Get-Item $zipPath | Select-Object Name, @{Name="Size(MB)";Expression={[math]::Round($_.Length/1MB,2)}}
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Copy $zipPath to your server" -ForegroundColor White
Write-Host "2. Extract and follow instructions in README.txt" -ForegroundColor White
Write-Host "3. Update .env configuration" -ForegroundColor White
Write-Host "4. Run server.exe" -ForegroundColor White
Write-Host ""
