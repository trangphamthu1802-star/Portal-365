# Portal 365 - CORS & API URL Fix - Deployment Guide

## Vấn đề đã được Fix

### 1. Lỗi CORS
**Trước đây:**
```
Access to fetch at 'http://localhost:8080/api/v1/...' from origin 'http://192.168.6.41:8080' 
has been blocked by CORS policy
```

**Giải pháp:**
- Backend CORS config đã được update để cho phép ALL origins trong production
- File: `backend/cmd/server/main.go` - Line 70-80

### 2. Lỗi Frontend hardcoded localhost
**Trước đây:**
- Frontend gọi API với URL cố định: `http://localhost:8080/api/v1`
- Không hoạt động khi deploy lên server với IP khác

**Giải pháp:**
- Frontend đã được update để dùng relative path: `/api/v1`
- Tự động detect server URL từ window.location.origin
- Files đã fix:
  - `frontend/src/lib/apiClient.ts`
  - `frontend/src/hooks/useApi.ts`
  - `frontend/src/api/http.ts`
  - `frontend/src/api/client.ts`
  - `frontend/src/api/http-client.ts`

## File Deployment Package

**Location:** `C:\Users\Admin\portal-365\portal-365-deploy.zip`
**Size:** ~60MB

### Nội dung Package:
```
portal-365-deploy/
├── server.exe              # Backend với CORS fix
├── .env                    # Config production
├── portal.db               # Database
├── start-server.bat        # Script khởi động
├── README.txt              # Hướng dẫn
├── dist/                   # Frontend với API fix
│   ├── index.html
│   └── assets/
└── storage/                # Media files
    └── uploads/
```

## Hướng dẫn Deploy

### Bước 1: Extract File
```powershell
# Giải nén portal-365-deploy.zip vào thư mục trên server
# Ví dụ: C:\portal-365\ hoặc /opt/portal-365/
```

### Bước 2: Cấu hình .env
```bash
# Mở file .env và thay đổi:
JWT_SECRET=your-super-secret-key-min-32-characters
PORT=8080
APP_ENV=production
```

### Bước 3: Mở Firewall (nếu cần)
```powershell
# Windows: Cho phép port 8080
netsh advfirewall firewall add rule name="Portal365" dir=in action=allow protocol=TCP localport=8080
```

### Bước 4: Khởi động Server
```powershell
# Cách 1: Double-click start-server.bat
# Cách 2: Chạy trực tiếp
cd C:\portal-365-deploy
.\server.exe
```

### Bước 5: Truy cập từ Client
Mở browser trên bất kỳ máy nào trong mạng:
```
http://192.168.6.41:8080        # Thay bằng IP thực tế của server
http://192.168.1.100:8080       # Hoặc IP khác
http://10.0.0.50:8080           # Hoặc IP khác
```

## Test Deploy

### Test 1: Truy cập từ chính server
```
http://localhost:8080
```

### Test 2: Truy cập từ máy khác cùng mạng
```
http://SERVER-IP:8080
```
Ví dụ: `http://192.168.6.41:8080`

### Test 3: Check API
```powershell
# Từ máy client, mở browser console (F12) và chạy:
fetch('http://192.168.6.41:8080/api/v1/healthz')
  .then(r => r.json())
  .then(d => console.log('API OK:', d))
```

Kết quả mong đợi:
```json
{
  "status": "ok",
  "timestamp": "2025-11-11T..."
}
```

## Kiểm tra CORS hoạt động

### Cách 1: Browser Console
```javascript
// Trên trang http://192.168.6.41:8080, mở F12 Console và chạy:
fetch('/api/v1/categories')
  .then(r => r.json())
  .then(d => console.log('Categories:', d))
```

Nếu thành công → CORS OK ✅

### Cách 2: Kiểm tra Network Tab
1. Mở browser trên client
2. Truy cập `http://192.168.6.41:8080`
3. Nhấn F12 → Tab Network
4. Reload trang
5. Tìm các request `/api/v1/...`
6. Check Response Headers có:
   ```
   Access-Control-Allow-Origin: *
   ```

## Default Admin Account
```
Email: admin@portal365.com
Password: admin123
```
⚠️ **Đổi password ngay sau lần login đầu tiên!**

## Troubleshooting

### 1. Vẫn báo lỗi CORS
**Nguyên nhân:** Server chưa chạy hoặc port sai
**Giải pháp:**
- Check server đang chạy: `netstat -an | findstr 8080`
- Check .env file có đúng PORT=8080

### 2. 404 Not Found khi reload trang
**Nguyên nhân:** Normal - server.exe đã handle SPA routing
**Giải pháp:** Không cần làm gì, đây là behavior đúng

### 3. Cannot connect from client
**Nguyên nhân:** Firewall block port
**Giải pháp:**
```powershell
# Windows Server:
New-NetFirewallRule -DisplayName "Portal365" -Direction Inbound -LocalPort 8080 -Protocol TCP -Action Allow

# Hoặc tắt firewall tạm (không khuyến nghị):
# netsh advfirewall set allprofiles state off
```

### 4. Database locked
**Nguyên nhân:** Nhiều instance server.exe chạy cùng lúc
**Giải pháp:**
```powershell
# Tắt tất cả instance cũ
taskkill /F /IM server.exe

# Khởi động lại
.\server.exe
```

## Các thay đổi kỹ thuật

### Backend Changes
**File:** `backend/cmd/server/main.go`
```go
// CORS middleware
corsConfig := cors.DefaultConfig()

// In production, allow all origins for flexibility in deployment
// In development, use configured origins
if cfg.AppEnv == "production" {
    corsConfig.AllowAllOrigins = true
} else {
    corsConfig.AllowOrigins = cfg.CORSAllowedOrigins
}
```

### Frontend Changes
**File:** `frontend/src/lib/apiClient.ts`
```typescript
// Use relative path for production deployment (works with any server IP)
// Or use VITE_API_BASE env variable if provided
const API_BASE_URL = import.meta.env.VITE_API_BASE || '/api/v1';
export const BACKEND_URL = API_BASE_URL === '/api/v1' 
  ? window.location.origin 
  : API_BASE_URL.replace('/api/v1', '');
```

**File:** `frontend/.env.production`
```bash
VITE_API_BASE=/api/v1
```

## Rebuild Instructions (cho developer)

Nếu cần rebuild lại package:

```powershell
# 1. Rebuild frontend
cd frontend
npm run build

# 2. Rebuild backend
cd ../backend
go build -o server.exe cmd/server/main.go

# 3. Create deployment package
cd ..
.\create-deploy-package.ps1
```

## Network Architecture

```
Client Browser (192.168.6.50)
    ↓
    → http://192.168.6.41:8080 (Frontend)
    ↓
    → /api/v1/* (Backend API)
    ↓
Server (192.168.6.41)
    ├── server.exe (Port 8080)
    │   ├── Serve frontend (/dist)
    │   └── Handle API (/api/v1)
    └── portal.db (SQLite)
```

## Production Checklist

- [ ] Extract portal-365-deploy.zip
- [ ] Edit .env and set JWT_SECRET
- [ ] Open firewall port 8080
- [ ] Start server.exe
- [ ] Test access from localhost
- [ ] Test access from other devices
- [ ] Login with admin account
- [ ] Change admin password
- [ ] Verify all features work:
  - [ ] Home page loads
  - [ ] Categories show data
  - [ ] Articles display
  - [ ] Media (photos/videos) work
  - [ ] Documents page works
  - [ ] Admin login works
  - [ ] Admin CRUD operations work

## Support

Nếu gặp vấn đề:
1. Check console output của server.exe
2. Check browser console (F12) cho lỗi frontend
3. Check Network tab để xem API requests
4. Verify .env configuration
5. Check firewall settings

---

**✅ Package này đã fix toàn bộ lỗi CORS và localhost hardcoded.**
**✅ Sẵn sàng deploy lên bất kỳ server nào với bất kỳ IP nào.**
