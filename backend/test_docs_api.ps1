# Test documents API
Write-Host "Testing /api/v1/admin/documents endpoint..." -ForegroundColor Cyan

# Get access token (assuming you're logged in)
$token = $env:ADMIN_TOKEN
if (-not $token) {
    Write-Host "No ADMIN_TOKEN found. Please login first." -ForegroundColor Yellow
    Write-Host "Getting token for admin..." -ForegroundColor Yellow
    
    $loginBody = @{
        email = "admin@portal365.com"
        password = "Admin123!"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/auth/login" `
            -Method Post `
            -Body $loginBody `
            -ContentType "application/json"
        
        $token = $response.data.access_token
        Write-Host "✓ Login successful!" -ForegroundColor Green
    } catch {
        Write-Host "✗ Login failed: $_" -ForegroundColor Red
        exit 1
    }
}

# Test documents endpoint
Write-Host "`nTesting documents list..." -ForegroundColor Cyan
try {
    $url = "http://localhost:8080/api/v1/admin/documents?page=1&page_size=20"
    $response = Invoke-RestMethod -Uri $url `
        -Method Get `
        -Headers @{ Authorization = "Bearer $token" }
    
    Write-Host "✓ API call successful!" -ForegroundColor Green
    Write-Host "`nResponse:" -ForegroundColor White
    $response | ConvertTo-Json -Depth 5
} catch {
    Write-Host "✗ API call failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response body: $responseBody" -ForegroundColor Yellow
    }
}
