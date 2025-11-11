# Simple test for admin articles endpoint

Write-Host "Testing Admin Articles Endpoint" -ForegroundColor Cyan
Write-Host ""

# Login
Write-Host "1. Login..." -ForegroundColor Yellow
$loginData = '{"email":"admin@portal365.com","password":"admin123"}'

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/auth/login" -Method POST -Body $loginData -ContentType "application/json"
    $token = $response.data.access_token
    Write-Host "   Success! Token: $($token.Substring(0,20))..." -ForegroundColor Green
} catch {
    Write-Host "   Failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Get articles
Write-Host ""
Write-Host "2. Get articles..." -ForegroundColor Yellow
try {
    $headers = @{ "Authorization" = "Bearer $token" }
    $articles = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/admin/articles" -Method GET -Headers $headers
    Write-Host "   Success! Found $($articles.data.Count) articles" -ForegroundColor Green
    
    foreach ($art in $articles.data | Select-Object -First 3) {
        Write-Host "   - $($art.title)" -ForegroundColor Gray
    }
} catch {
    Write-Host "   Failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Test Complete!" -ForegroundColor Green
