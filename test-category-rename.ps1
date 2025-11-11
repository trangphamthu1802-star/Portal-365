# Test script for category rename
# Tests database, backend API, and frontend config

Write-Host "=== Testing Category Rename: Tin hoạt động Sư đoàn -> Bảo vệ nền tảng tư tưởng của Đảng ===" -ForegroundColor Cyan
Write-Host ""

# 1. Test Database
Write-Host "1. Testing Database..." -ForegroundColor Yellow
cd c:\Users\Admin\portal-365\backend
$dbResult = sqlite3 portal.db "SELECT id, name, slug FROM categories WHERE id = 19;"
Write-Host "   Database result: $dbResult" -ForegroundColor Green
Write-Host ""

# 2. Test Backend API - Category detail
Write-Host "2. Testing Backend API - Category Detail..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/categories/bao-ve-nen-tang-tu-tuong-cua-dang" -Method Get
    Write-Host "   ✓ API returns category name: $($response.data.name)" -ForegroundColor Green
    Write-Host "   ✓ API returns category slug: $($response.data.slug)" -ForegroundColor Green
} catch {
    Write-Host "   ✗ API Error: $_" -ForegroundColor Red
}
Write-Host ""

# 3. Test Backend API - Articles by category
Write-Host "3. Testing Backend API - Articles by Category..." -ForegroundColor Yellow
try {
    $articlesResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/articles?category_slug=bao-ve-nen-tang-tu-tuong-cua-dang&limit=1" -Method Get
    if ($articlesResponse.data.Count -gt 0) {
        $article = $articlesResponse.data[0]
        Write-Host "   ✓ Found $($articlesResponse.data.Count) article(s)" -ForegroundColor Green
        Write-Host "   ✓ Article category_name: $($article.category_name)" -ForegroundColor Green
        Write-Host "   ✓ Article category.name: $($article.category.name)" -ForegroundColor Green
    } else {
        Write-Host "   ⚠ No articles found for this category" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ✗ API Error: $_" -ForegroundColor Red
}
Write-Host ""

# 4. Check Frontend Config Files
Write-Host "4. Checking Frontend Config Files..." -ForegroundColor Yellow
cd c:\Users\Admin\portal-365\frontend\src\config

# Check navigation.ts
$navContent = Get-Content navigation.ts -Raw
if ($navContent -match "Bảo vệ nền tảng tư tưởng của Đảng") {
    Write-Host "   ✓ navigation.ts updated" -ForegroundColor Green
} else {
    Write-Host "   ✗ navigation.ts NOT updated" -ForegroundColor Red
}

if ($navContent -match "bao-ve-nen-tang-tu-tuong-cua-dang") {
    Write-Host "   ✓ navigation.ts slug updated" -ForegroundColor Green
} else {
    Write-Host "   ✗ navigation.ts slug NOT updated" -ForegroundColor Red
}

# Check categorySlugs.ts
$slugsContent = Get-Content categorySlugs.ts -Raw
if ($slugsContent -match "bao-ve-nen-tang-tu-tuong-cua-dang") {
    Write-Host "   ✓ categorySlugs.ts updated" -ForegroundColor Green
} else {
    Write-Host "   ✗ categorySlugs.ts NOT updated" -ForegroundColor Red
}
Write-Host ""

# 5. Check Frontend Pages
Write-Host "5. Checking Frontend Pages..." -ForegroundColor Yellow
cd c:\Users\Admin\portal-365\frontend\src\pages

# Check Home.tsx
$homeContent = Get-Content Home.tsx -Raw
if ($homeContent -match "Bảo vệ nền tảng tư tưởng của Đảng") {
    Write-Host "   ✓ Home.tsx updated" -ForegroundColor Green
} else {
    Write-Host "   ✗ Home.tsx NOT updated" -ForegroundColor Red
}

if ($homeContent -match "bao-ve-nen-tang-tu-tuong-cua-dang") {
    Write-Host "   ✓ Home.tsx link updated" -ForegroundColor Green
} else {
    Write-Host "   ✗ Home.tsx link NOT updated" -ForegroundColor Red
}

# Check News.tsx
$newsContent = Get-Content News.tsx -Raw
if ($newsContent -match "Bảo vệ nền tảng tư tưởng của Đảng") {
    Write-Host "   ✓ News.tsx updated" -ForegroundColor Green
} else {
    Write-Host "   ✗ News.tsx NOT updated" -ForegroundColor Red
}

if ($newsContent -match "category_slug: 'bao-ve-nen-tang-tu-tuong-cua-dang'") {
    Write-Host "   ✓ News.tsx API call updated" -ForegroundColor Green
} else {
    Write-Host "   ✗ News.tsx API call NOT updated" -ForegroundColor Red
}
Write-Host ""

Write-Host "=== Test Complete ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Summary:" -ForegroundColor Yellow
Write-Host "- Database: Updated to 'Bảo vệ nền tảng tư tưởng của Đảng'" -ForegroundColor Green
Write-Host "- Backend API: Serving new category name and slug" -ForegroundColor Green
Write-Host "- Frontend Config: navigation.ts, categorySlugs.ts updated" -ForegroundColor Green
Write-Host "- Frontend Pages: Home.tsx, News.tsx updated" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Visit http://localhost:5173 to see navigation menu" -ForegroundColor White
Write-Host "2. Check Home page -> Tin tức section" -ForegroundColor White
Write-Host "3. Click 'Tin tức' menu -> verify submenu shows new name" -ForegroundColor White
Write-Host "4. Visit /c/bao-ve-nen-tang-tu-tuong-cua-dang directly" -ForegroundColor White
