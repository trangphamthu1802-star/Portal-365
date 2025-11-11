#!/usr/bin/env pwsh

# Test script to create sample banners for Portal 365

$BackendURL = "http://localhost:8080/api/v1"
$Token = "" # Get from login

# Login first to get token
Write-Host "Logging in..." -ForegroundColor Cyan
$loginResponse = Invoke-RestMethod -Uri "$BackendURL/auth/login" -Method POST `
    -ContentType "application/json" `
    -Body '{"username":"admin","password":"Admin@123"}'

$Token = $loginResponse.data.access_token
Write-Host "Logged in successfully!" -ForegroundColor Green
Write-Host "Token: $Token" -ForegroundColor Gray

# Create banner 1
Write-Host "`nCreating banner 1 (home-middle)..." -ForegroundColor Cyan

# Download sample image or use existing
$SampleImage1 = "C:\Users\Admin\portal-365\test-banner-1.jpg"
$SampleImage2 = "C:\Users\Admin\portal-365\test-banner-2.jpg"

if (-not (Test-Path $SampleImage1)) {
    Write-Host "Creating sample image 1..." -ForegroundColor Yellow
    # Create a simple test image using .NET
    Add-Type -AssemblyName System.Drawing
    $bmp = New-Object System.Drawing.Bitmap(1200, 200)
    $graphics = [System.Drawing.Graphics]::FromImage($bmp)
    $graphics.Clear([System.Drawing.Color]::FromArgb(52, 152, 219)) # Blue background
    $font = New-Object System.Drawing.Font("Arial", 40, [System.Drawing.FontStyle]::Bold)
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $graphics.DrawString("BANNER 1 - PORTAL 365", $font, $brush, 300, 70)
    $bmp.Save($SampleImage1, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $graphics.Dispose()
    $bmp.Dispose()
    Write-Host "Sample image 1 created!" -ForegroundColor Green
}

if (-not (Test-Path $SampleImage2)) {
    Write-Host "Creating sample image 2..." -ForegroundColor Yellow
    Add-Type -AssemblyName System.Drawing
    $bmp = New-Object System.Drawing.Bitmap(1200, 200)
    $graphics = [System.Drawing.Graphics]::FromImage($bmp)
    $graphics.Clear([System.Drawing.Color]::FromArgb(231, 76, 60)) # Red background
    $font = New-Object System.Drawing.Font("Arial", 40, [System.Drawing.FontStyle]::Bold)
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $graphics.DrawString("BANNER 2 - PORTAL 365", $font, $brush, 300, 70)
    $bmp.Save($SampleImage2, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $graphics.Dispose()
    $bmp.Dispose()
    Write-Host "Sample image 2 created!" -ForegroundColor Green
}

# Upload banner 1
$form1 = @{
    file = Get-Item -Path $SampleImage1
    title = "Banner Trang chủ 1"
    placement = "home-middle"
    link_url = "https://www.qdnd.vn"
    is_active = "true"
}

try {
    $response1 = Invoke-RestMethod -Uri "$BackendURL/admin/banners/upload" -Method POST `
        -Headers @{Authorization = "Bearer $Token"} `
        -Form $form1
    
    Write-Host "Banner 1 created successfully!" -ForegroundColor Green
    Write-Host "ID: $($response1.data.id)" -ForegroundColor Gray
    Write-Host "Image URL: $($response1.data.image_url)" -ForegroundColor Gray
} catch {
    Write-Host "Error creating banner 1: $_" -ForegroundColor Red
}

# Upload banner 2
Start-Sleep -Seconds 1

$form2 = @{
    file = Get-Item -Path $SampleImage2
    title = "Banner Trang chủ 2"
    placement = "home-middle"
    link_url = ""
    is_active = "true"
}

try {
    $response2 = Invoke-RestMethod -Uri "$BackendURL/admin/banners/upload" -Method POST `
        -Headers @{Authorization = "Bearer $Token"} `
        -Form $form2
    
    Write-Host "`nBanner 2 created successfully!" -ForegroundColor Green
    Write-Host "ID: $($response2.data.id)" -ForegroundColor Gray
    Write-Host "Image URL: $($response2.data.image_url)" -ForegroundColor Gray
} catch {
    Write-Host "Error creating banner 2: $_" -ForegroundColor Red
}

Write-Host "`nDone! Check http://localhost:5173 to see the banners." -ForegroundColor Cyan
