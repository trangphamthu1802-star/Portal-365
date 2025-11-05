$env:PORT="8080"
$env:JWT_SECRET="portal365-secret-key"
$env:SQLITE_DSN="file:portal.db?_busy_timeout=5000"
$env:ACCESS_TOKEN_TTL="15m"
$env:REFRESH_TOKEN_TTL="720h"
$env:CORS_ALLOWED_ORIGINS="http://localhost:5173"

Write-Host "Starting Portal 365 Backend Server..." -ForegroundColor Green
Write-Host "Swagger UI will be available at: http://localhost:8080/swagger/index.html" -ForegroundColor Cyan

go run .\cmd\server\main.go
