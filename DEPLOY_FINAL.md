# Portal 365 - Hướng Dẫn Deploy Hoàn Chỉnh

## ✅ Package Đã Sẵn Sàng

**File:** `portal-365-deploy.zip` (60.74 MB)

**Bao gồm:**
- ✅ server.exe (Backend với các fix mới nhất)
- ✅ dist/ (Frontend SPA đã build)
- ✅ portal.db (Database với dữ liệu mẫu)
- ✅ storage/ (Thư mục uploads)
- ✅ .env (Configuration template)
- ✅ README.txt (Hướng dẫn nhanh)

---

## 🚀 Các Bước Deploy Trên Máy Server Mới

### **Bước 1: Copy Package**
Copy file `portal-365-deploy.zip` sang máy server (USB, mạng, cloud...)

### **Bước 2: Giải Nén**
```powershell
# Tạo thư mục đích
New-Item -ItemType Directory -Path "D:\portal365" -Force

# Giải nén
Expand-Archive -Path "portal-365-deploy.zip" -DestinationPath "D:\portal365" -Force
```

### **Bước 3: Cấu Hình .env**
```powershell
cd D:\portal365
notepad .env
```

**Sửa các dòng sau:**
```env
# QUAN TRỌNG - Phải đổi trong production
APP_ENV=production
JWT_SECRET=5sytpJYgu4W7xzOS1GTAfwc62ld9qEjDniKVoN8QCRbIF0rkLBXUaPvmM3hZeH

# Port mặc định
PORT=8080

# Database (giữ nguyên)
DATABASE_DSN=file:portal.db?_busy_timeout=5000&_journal_mode=WAL&_foreign_keys=on

# Token expiry (giữ nguyên)
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL=720h

# CORS - Cho phép tất cả nguồn (hoặc chỉ định domain cụ thể)
CORS_ALLOWED_ORIGINS=*
```

### **Bước 4: Mở Firewall**
```powershell
# Mở port 8080
New-NetFirewallRule -DisplayName "Portal 365" -Direction Inbound -LocalPort 8080 -Protocol TCP -Action Allow
```

### **Bước 5: Chạy Server**
```powershell
cd D:\portal365
.\server.exe
```

**Bạn sẽ thấy:**
```
Server starting on :8080
[GIN-debug] Listening and serving HTTP on :8080
```

### **Bước 6: Truy Cập Website**

**Trên chính máy server:**
```
http://localhost:8080
```

**Từ máy khác trong mạng:**
```
http://192.168.1.XXX:8080
```
(Thay XXX bằng IP của máy server)

**Tìm IP máy server:**
```powershell
ipconfig | findstr IPv4
```

---

## 🔍 Kiểm Tra Hoạt Động

### **1. Kiểm tra server đã chạy:**
```powershell
netstat -ano | findstr :8080
```

### **2. Test API:**
Mở browser: `http://localhost:8080/api/v1/healthz`
- Kết quả: `{"status":"ok"}`

### **3. Test Swagger:**
`http://localhost:8080/swagger/index.html`

### **4. Test Frontend:**
`http://localhost:8080`
- Phải thấy giao diện website đầy đủ CSS/JS

---

## ⚠️ Xử Lý Lỗi Thường Gặp

### **Lỗi: Mất CSS (trang trắng, chỉ có text)**

**Nguyên nhân:** Server không chạy đúng thư mục

**Giải pháp:**
```powershell
# Phải CD vào đúng thư mục chứa server.exe
cd D:\portal365
.\server.exe

# KHÔNG chạy từ thư mục khác
# SAI: D:\portal365\server.exe
```

### **Lỗi: Port 8080 đã bị chiếm**

**Kiểm tra:**
```powershell
netstat -ano | findstr :8080
```

**Giải pháp 1:** Dừng process đang dùng port 8080

**Giải pháp 2:** Đổi port trong .env
```env
PORT=8081
```
Và mở firewall cho port mới

### **Lỗi: Database locked**

**Nguyên nhân:** Có process khác đang mở database

**Giải pháp:**
```powershell
# Dừng server cũ
taskkill /F /IM server.exe

# Chạy lại
cd D:\portal365
.\server.exe
```

### **Lỗi: API trả về 404**

**Kiểm tra:**
1. Mở F12 trong Chrome
2. Tab Console - xem lỗi
3. Tab Network - xem request nào bị 404

**Thường gặp:**
- `/api/v1/menus` → Đã fix trong version mới
- `/api/v1/settings/public` → Đã fix trong version mới

---

## 🔐 Bảo Mật

### **1. Đổi JWT_SECRET**
```powershell
# Tạo secret mới
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | % {[char]$_})
```

Copy kết quả vào .env:
```env
JWT_SECRET=<secret-mới-tạo>
```

### **2. Đổi mật khẩu admin mặc định**

**Đăng nhập:**
- URL: `http://localhost:8080/admin/login`
- Email: `admin@portal365.com`
- Password: `admin123`

**Sau khi login → Đổi password ngay!**

### **3. Giới hạn CORS (production)**
```env
# Thay vì CORS_ALLOWED_ORIGINS=*
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

---

## 🔄 Chạy Như Windows Service (Tự Động Khởi Động)

### **Cài NSSM:**
1. Tải: https://nssm.cc/download
2. Giải nén nssm.exe vào C:\nssm\

### **Tạo Service:**
```powershell
cd C:\nssm
.\nssm install Portal365 "D:\portal365\server.exe"
.\nssm set Portal365 AppDirectory "D:\portal365"
.\nssm set Portal365 DisplayName "Portal 365 News"
.\nssm set Portal365 Description "Portal 365 - Cổng thông tin điện tử"
.\nssm start Portal365
```

### **Quản lý Service:**
```powershell
# Start
nssm start Portal365

# Stop
nssm stop Portal365

# Restart
nssm restart Portal365

# Xem status
nssm status Portal365

# Xóa service
nssm remove Portal365 confirm
```

### **Hoặc dùng Windows Services:**
1. Win + R → `services.msc`
2. Tìm "Portal 365 News"
3. Chuột phải → Properties → Startup type: Automatic

---

## 📊 Monitoring

### **Xem Log Server:**
Log được in ra terminal window đang chạy server.exe

### **Lưu Log Ra File:**
```powershell
cd D:\portal365
.\server.exe > server.log 2>&1
```

### **Xem Log Realtime:**
```powershell
Get-Content server.log -Wait -Tail 50
```

---

## 🔄 Update Phiên Bản Mới

1. **Dừng server**
2. **Backup database:**
   ```powershell
   Copy-Item D:\portal365\portal.db D:\backup\portal.db.backup
   ```
3. **Thay server.exe mới**
4. **Thay frontend mới** (thư mục dist/)
5. **Chạy lại server**

---

## 📞 Hỗ Trợ

**Nếu gặp vấn đề:**

1. **Kiểm tra log** trong terminal
2. **Mở F12** trong Chrome → tab Console
3. **Test API** qua Swagger UI
4. **Xem network requests** trong F12 → Network tab

**Các file quan trọng:**
- `server.exe` - Backend executable
- `portal.db` - Database (BACKUP thường xuyên!)
- `.env` - Configuration
- `dist/` - Frontend files
- `storage/` - User uploads

**Liên hệ:** [Thông tin support]

---

## ✅ Checklist Deploy Thành Công

- [ ] Package đã giải nén vào thư mục cố định
- [ ] File .env đã sửa APP_ENV=production
- [ ] JWT_SECRET đã đổi thành giá trị bảo mật
- [ ] Firewall đã mở port 8080
- [ ] Server chạy được (thấy log "Listening on :8080")
- [ ] Truy cập http://localhost:8080 thấy giao diện đầy đủ
- [ ] Login admin được với admin@portal365.com / admin123
- [ ] Đã đổi password admin
- [ ] Database backup được setup

**Chúc bạn deploy thành công! 🚀**
