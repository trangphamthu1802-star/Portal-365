# Test admin articles endpoint

Write-Host "=== Testing Admin Articles Endpoint ===" -ForegroundColor Cyan

# Step 1: Login
Write-Host ""
Write-Host "1. Login as admin..." -ForegroundColor Yellow
$loginBody = @{
    email = "admin@portal365.com"
    password = "admin123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $loginBody
    
    $accessToken = $loginResponse.data.access_token
    Write-Host "   OK: Login successful" -ForegroundColor Green
    Write-Host "   Token: $($accessToken.Substring(0, 20))..." -ForegroundColor Gray
} catch {
    Write-Host "   FAIL: Login failed: $_" -ForegroundColor Red
    exit 1
}

# Step 2: Get user info
Write-Host ""
Write-Host "2. Getting user info..." -ForegroundColor Yellow
try {
    $headers = @{
        Authorization = "Bearer $accessToken"
    }
    $meResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/auth/me" `
        -Method GET `
        -Headers $headers
    
    Write-Host "   OK: User: $($meResponse.data.email)" -ForegroundColor Green
    Write-Host "   Roles: $($meResponse.data.roles -join ', ')" -ForegroundColor Gray
} catch {
    Write-Host "   FAIL: Failed to get user info: $_" -ForegroundColor Red
}

# Step 3: Get admin articles
Write-Host ""
Write-Host "3. Fetching admin articles..." -ForegroundColor Yellow
try {
    $articlesResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/admin/articles?page=1&page_size=10" `
        -Method GET `
        -Headers $headers
    
    $count = $articlesResponse.data.Count
    Write-Host "   OK: Found $count articles" -ForegroundColor Green
    
    if ($count -gt 0) {
        Write-Host ""
        Write-Host "   Articles:" -ForegroundColor Cyan
        foreach ($article in $articlesResponse.data | Select-Object -First 5) {
            Write-Host "   - [$($article.status)] $($article.title)" -ForegroundColor White
        }
    }
    
    if ($articlesResponse.pagination) {
        Write-Host ""
        Write-Host "   Pagination:" -ForegroundColor Cyan
        Write-Host "   Total: $($articlesResponse.pagination.total)" -ForegroundColor Gray
        Write-Host "   Page: $($articlesResponse.pagination.page)/$($articlesResponse.pagination.total_pages)" -ForegroundColor Gray
    }
} catch {
    Write-Host "   FAIL: Failed to fetch articles: $_" -ForegroundColor Red
    Write-Host "   Error details: $($_.Exception.Response)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=== Test Complete ===" -ForegroundColor Green
