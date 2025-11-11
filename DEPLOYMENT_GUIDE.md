# Hướng dẫn Deploy Portal-365

## Files cần thiết để chạy trên máy server

### 1. Backend Server
```
portal-365-server/
├── server.exe                    # File thực thi backend (đã build)
├── .env                          # File cấu hình môi trường
├── portal.db                     # Database SQLite (hoặc tạo mới)
├── dist/                         # Frontend đã build
│   ├── index.html
│   ├── assets/
│   │   ├── index-*.css
│   │   ├── index-*.js
│   │   └── *.jfif, *.jpg (images)
│   └── vite.svg
└── storage/                      # Thư mục lưu uploads
    └── uploads/
        ├── articles/
        ├── videos/
        └── ...
```

### 2. File cấu hình .env

```env
# Server Configuration
PORT=8080
APP_ENV=production

# Database
SQLITE_DSN=file:portal.db?_busy_timeout=5000

# JWT Configuration
JWT_SECRET=your-super-secret-key-change-this-in-production
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL=720h

# CORS
CORS_ALLOWED_ORIGINS=*
```

### 3. Các bước Deploy

#### Bước 1: Chuẩn bị files
```powershell
# Tạo thư mục deploy
New-Item -ItemType Directory -Path "C:\portal-365-deploy" -Force

# Copy các file cần thiết
Copy-Item "backend\server.exe" -Destination "C:\portal-365-deploy\"
Copy-Item "backend\.env" -Destination "C:\portal-365-deploy\"
Copy-Item "backend\portal.db" -Destination "C:\portal-365-deploy\"
Copy-Item "backend\dist" -Destination "C:\portal-365-deploy\dist" -Recurse
Copy-Item "backend\storage" -Destination "C:\portal-365-deploy\storage" -Recurse
```

#### Bước 2: Nén thư mục để chuyển sang máy khác
```powershell
Compress-Archive -Path "C:\portal-365-deploy\*" -DestinationPath "C:\portal-365-deploy.zip"
```

#### Bước 3: Trên máy server

1. **Giải nén file**
```powershell
Expand-Archive -Path "portal-365-deploy.zip" -DestinationPath "C:\portal-365"
```

2. **Cấu hình .env (nếu cần)**
   - Mở file `.env` và điều chỉnh các thông số phù hợp
   - Thay đổi `JWT_SECRET` thành giá trị bảo mật
   - Cập nhật `CORS_ALLOWED_ORIGINS` nếu cần

3. **Chạy server**
```powershell
cd C:\portal-365
.\server.exe
```

4. **Chạy server như Windows Service (tùy chọn)**
   - Sử dụng NSSM (Non-Sucking Service Manager)
   ```powershell
   # Download NSSM từ https://nssm.cc/download
   # Cài đặt service
   nssm install Portal365 "C:\portal-365\server.exe"
   nssm set Portal365 AppDirectory "C:\portal-365"
   nssm start Portal365
   ```

### 4. Truy cập website

- Trên máy server: `http://localhost:8080`
- Từ máy khác trong mạng: `http://<IP-máy-server>:8080`
- Swagger API: `http://<IP-máy-server>:8080/swagger/index.html`

### 5. Cấu hình Firewall (nếu cần)

```powershell
# Mở port 8080
New-NetFirewallRule -DisplayName "Portal 365" -Direction Inbound -LocalPort 8080 -Protocol TCP -Action Allow
```

### 6. Cấu hình với Domain/Reverse Proxy (Production)

#### Sử dụng Nginx (khuyến nghị)
```nginx
server {
    listen 80;
    server_name portal365.yourdomain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### Hoặc sử dụng IIS
1. Cài đặt IIS với URL Rewrite và ARR
2. Tạo Reverse Proxy trỏ đến `http://localhost:8080`

### 7. Backup Database

```powershell
# Backup database
Copy-Item "C:\portal-365\portal.db" -Destination "C:\backups\portal-$(Get-Date -Format 'yyyyMMdd-HHmmss').db"

# Hoặc tự động backup hàng ngày
$action = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument '-File C:\portal-365\backup.ps1'
$trigger = New-ScheduledTaskTrigger -Daily -At 2am
Register-ScheduledTask -TaskName "Portal365 Backup" -Action $action -Trigger $trigger
```

### 8. Monitoring & Logs

Server tự động ghi log ra console. Để lưu logs:

```powershell
# Chạy và redirect logs
.\server.exe > logs\server.log 2>&1
```

### 9. Cập nhật phiên bản mới

```powershell
# Dừng server
Stop-Process -Name "server" -Force

# Backup database
Copy-Item "portal.db" -Destination "portal-backup.db"

# Thay thế file server.exe và dist/
# Sau đó khởi động lại
.\server.exe
```

## Troubleshooting

### Port đã được sử dụng
```powershell
# Tìm process đang dùng port 8080
Get-Process -Id (Get-NetTCPConnection -LocalPort 8080).OwningProcess
```

### Database bị lock
```powershell
# Đảm bảo chỉ có 1 instance server đang chạy
Get-Process -Name "server" | Measure-Object
```

### Không truy cập được từ máy khác
- Kiểm tra Firewall
- Kiểm tra CORS_ALLOWED_ORIGINS trong .env
- Đảm bảo máy server và client trong cùng mạng

## Yêu cầu hệ thống

- **OS**: Windows 10/11 hoặc Windows Server 2016+
- **RAM**: Tối thiểu 512MB (khuyến nghị 2GB+)
- **Disk**: 100MB cho app + dung lượng cho uploads
- **Network**: Port 8080 phải available

## Bảo mật

1. **Thay đổi JWT_SECRET** trong production
2. **Không expose port 8080 ra internet** - dùng reverse proxy
3. **Backup database thường xuyên**
4. **Giới hạn CORS** đến domain cụ thể
5. **Sử dụng HTTPS** thông qua reverse proxy
6. **Cập nhật server.exe** khi có phiên bản mới
