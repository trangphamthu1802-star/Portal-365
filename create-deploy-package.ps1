# Portal 365 - Deployment Package Creator
# This script creates a deployment package with fixed CORS and API URLs

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Portal 365 Deployment Package" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Remove old deployment folder if exists
if (Test-Path "portal-365-deploy") {
    Write-Host "Removing old deployment folder..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force portal-365-deploy
}

# Create deployment structure
Write-Host "Creating deployment structure..." -ForegroundColor Green
New-Item -ItemType Directory -Path "portal-365-deploy" -Force | Out-Null
New-Item -ItemType Directory -Path "portal-365-deploy/dist" -Force | Out-Null
New-Item -ItemType Directory -Path "portal-365-deploy/storage" -Force | Out-Null
New-Item -ItemType Directory -Path "portal-365-deploy/storage/uploads" -Force | Out-Null

# Copy backend files
Write-Host "Copying backend files..." -ForegroundColor Green
Copy-Item "backend/server.exe" "portal-365-deploy/server.exe"
Copy-Item "backend/.env.production" "portal-365-deploy/.env"
Copy-Item "backend/portal.db" "portal-365-deploy/portal.db" -ErrorAction SilentlyContinue

# Copy frontend dist
Write-Host "Copying frontend build..." -ForegroundColor Green
Copy-Item "frontend/dist/*" "portal-365-deploy/dist/" -Recurse -Force

# Copy storage with data
Write-Host "Copying storage files..." -ForegroundColor Green
if (Test-Path "backend/storage/uploads") {
    Copy-Item "backend/storage/uploads/*" "portal-365-deploy/storage/uploads/" -Recurse -Force
}

# Create README for deployment
Write-Host "Creating deployment README..." -ForegroundColor Green
$readmeContent = @"
# Portal 365 - Production Deployment

## Quick Start

1. **Extract this package** to your server
2. **Edit .env file** and set your JWT_SECRET
3. **Run the server**: 
   - Windows: Double-click \`start-server.bat\` or run \`server.exe\`
   - Linux: \`chmod +x server && ./server\`
4. **Access the application**: Open browser and go to \`http://YOUR-SERVER-IP:8080\`

## What's Included

- \`server.exe\` - Backend server (Go binary)
- \`dist/\` - Frontend application (React build)
- \`storage/\` - Uploaded files (images, videos, documents)
- \`portal.db\` - SQLite database with demo data
- \`.env\` - Configuration file

## Configuration (.env)

Edit the \`.env\` file to configure:

\`\`\`
PORT=8080                    # Server port
APP_ENV=production          # Environment
JWT_SECRET=CHANGE-THIS      # ⚠️ IMPORTANT: Change this!
ACCESS_TOKEN_TTL=15m        # Access token lifetime
REFRESH_TOKEN_TTL=720h      # Refresh token lifetime
\`\`\`

## Default Admin Account

- Email: \`admin@portal365.com\`
- Password: \`admin123\`

⚠️ **Change the password immediately after first login!**

## Network Access

The application will be accessible from any device on your network at:
- \`http://YOUR-SERVER-IP:8080\`
- Example: \`http://192.168.6.41:8080\`

## CORS & API

✅ **FIXED**: This version supports access from any client IP address.
- Backend CORS allows all origins in production
- Frontend uses relative API paths (works with any server IP)

## Troubleshooting

### Port already in use
- Change PORT in .env file to another port (e.g., 8081, 8082)

### Cannot access from other devices
- Check firewall settings on server
- Ensure port 8080 is open
- Try: \`netsh advfirewall firewall add rule name="Portal365" dir=in action=allow protocol=TCP localport=8080\`

### Database locked error
- Make sure only one instance of server.exe is running
- Check if portal.db file has write permissions

## File Structure

\`\`\`
portal-365-deploy/
├── server.exe              # Backend server
├── .env                    # Configuration
├── portal.db               # Database
├── dist/                   # Frontend files
│   ├── index.html
│   └── assets/
└── storage/                # Uploaded media
    └── uploads/
        ├── articles/
        ├── images/
        ├── videos/
        ├── documents/
        └── banners/
\`\`\`

## Support

For issues or questions, check the logs in console output.
"@

Set-Content -Path "portal-365-deploy/README.txt" -Value $readmeContent

# Create start script
Write-Host "Creating start script..." -ForegroundColor Green
$startScript = @"
@echo off
echo ========================================
echo Portal 365 - Starting Server
echo ========================================
echo.
echo Server will start on port 8080
echo Access at: http://localhost:8080
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.
server.exe
pause
"@

Set-Content -Path "portal-365-deploy/start-server.bat" -Value $startScript

# Create zip file
Write-Host ""
Write-Host "Creating ZIP file..." -ForegroundColor Green
if (Test-Path "portal-365-deploy.zip") {
    Remove-Item "portal-365-deploy.zip" -Force
}

Compress-Archive -Path "portal-365-deploy/*" -DestinationPath "portal-365-deploy.zip" -Force

Write-Host ""
Write-Host "==================================" -ForegroundColor Green
Write-Host "✅ Deployment package created!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green
Write-Host ""
Write-Host "Location: portal-365-deploy.zip" -ForegroundColor Cyan
Write-Host "Size: $((Get-Item portal-365-deploy.zip).Length / 1MB | ForEach-Object {$_.ToString('0.00')}) MB" -ForegroundColor Cyan
Write-Host ""
Write-Host "Package includes:" -ForegroundColor Yellow
Write-Host "  - Backend server with CORS fix" -ForegroundColor White
Write-Host "  - Frontend with relative API paths" -ForegroundColor White
Write-Host "  - Database with demo data" -ForegroundColor White
Write-Host "  - All uploaded media files" -ForegroundColor White
Write-Host "  - README.txt with instructions" -ForegroundColor White
Write-Host "  - start-server.bat for easy startup" -ForegroundColor White
Write-Host ""
Write-Host "Ready to deploy to any server!" -ForegroundColor Green
Write-Host ""
