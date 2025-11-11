# Portal 365 - Production Deployment Package

## ✅ Đã Fix: API URLs Tự Động

**Package này đã được cấu hình để tự động sử dụng relative paths trong production.**

### Khi truy cập website qua:
- `http://localhost:8080` → API calls tới `http://localhost:8080/api/v1`
- `http://192.168.1.100:8080` → API calls tới `http://192.168.1.100:8080/api/v1`
- `http://yourdomain.com` → API calls tới `http://yourdomain.com/api/v1`

**Không cần cấu hình thêm!** Frontend tự động gọi đúng domain.

---

## 🚀 Hướng Dẫn Deploy

### **Bước 1: Giải nén**
```powershell
Expand-Archive portal-365-deploy.zip -DestinationPath D:\portal365
```

### **Bước 2: Cấu hình .env**
```powershell
cd D:\portal365
notepad .env
```

**Chỉnh sửa:**
```env
APP_ENV=production
JWT_SECRET=<tạo-secret-mới-64-ký-tự>
CORS_ALLOWED_ORIGINS=*
PORT=8080
```

**Tạo JWT_SECRET:**
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | % {[char]$_})
```

### **Bước 3: Mở Firewall**
```powershell
New-NetFirewallRule -DisplayName "Portal365" -Direction Inbound -LocalPort 8080 -Protocol TCP -Action Allow
```

### **Bước 4: Chạy Server**
```powershell
cd D:\portal365
.\server.exe
```

### **Bước 5: Truy cập**

**Trên chính máy server:**
```
http://localhost:8080
```

**Từ máy khác trong mạng:**
```
http://192.168.1.XXX:8080
```
(Tìm IP: `ipconfig | findstr IPv4`)

---

## 🎯 Cải Tiến Mới

### **1. API URLs Tự Động**
- ✅ Không cần hardcode `localhost:8080`
- ✅ Tự động adapt theo domain truy cập
- ✅ Hoạt động với mọi IP/domain

### **2. Production Ready**
- ✅ Frontend build với mode production
- ✅ Relative paths cho tất cả assets
- ✅ CORS có thể cấu hình linh hoạt

### **3. Deployment Đơn Giản**
- ✅ Chỉ cần giải nén và chạy
- ✅ Không cần rebuild cho từng server
- ✅ Một package chạy mọi môi trường

---

## 📁 Cấu Trúc Package

```
portal365/
├── server.exe          # Backend application
├── .env                # Configuration
├── portal.db           # SQLite database
├── dist/               # Frontend SPA (production build)
│   ├── index.html
│   └── assets/
│       ├── index-*.js  (Relative API paths: /api/v1)
│       └── index-*.css
└── storage/            # Upload directory
    └── uploads/
```

---

## 🔐 Bảo Mật

### **1. Đổi JWT Secret (BẮT BUỘC)**
```env
JWT_SECRET=<64-random-characters>
```

### **2. Đổi Password Admin**
- Login: `http://localhost:8080/admin/login`
- Email: `admin@portal365.com`
- Password: `admin123` (ĐỔI NGAY!)

### **3. Giới Hạn CORS (Khuyến nghị)**
```env
# Thay vì CORS_ALLOWED_ORIGINS=*
CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

---

## 🐛 Troubleshooting

### **Lỗi: Mất CSS**
**Nguyên nhân:** Không chạy server từ đúng thư mục

**Giải pháp:**
```powershell
# Phải CD vào thư mục chứa server.exe
cd D:\portal365
.\server.exe

# KHÔNG chạy từ nơi khác
```

### **Lỗi: API 404**
**Kiểm tra:**
1. F12 → Console → xem lỗi
2. F12 → Network → xem request paths

**Xác nhận API paths đúng:**
- Dev mode: `http://localhost:8080/api/v1/...`
- Production: `/api/v1/...` (relative)

### **Lỗi: CORS**
**Nếu thấy lỗi CORS trong Console:**
```env
# Sửa .env
CORS_ALLOWED_ORIGINS=*
```

---

## 📊 Test Deployment

### **1. Test API**
```
http://localhost:8080/api/v1/healthz
```
Kết quả: `{"status":"ok"}`

### **2. Test Swagger**
```
http://localhost:8080/swagger/index.html
```

### **3. Test Frontend**
```
http://localhost:8080
```
- Phải thấy giao diện đầy đủ
- F12 → Console → không có lỗi
- F12 → Network → API calls tới `/api/v1/*` (relative)

---

## 🔄 Windows Service

### **Cài NSSM:**
```powershell
# Tải: https://nssm.cc/download
# Cài đặt:
nssm install Portal365 "D:\portal365\server.exe"
nssm set Portal365 AppDirectory "D:\portal365"
nssm start Portal365
```

### **Quản lý:**
```powershell
nssm start Portal365    # Start
nssm stop Portal365     # Stop
nssm restart Portal365  # Restart
```

---

## ✅ Checklist

- [ ] Package đã giải nén
- [ ] .env đã sửa APP_ENV=production
- [ ] JWT_SECRET đã đổi
- [ ] Firewall đã mở port 8080
- [ ] Server chạy được
- [ ] Truy cập http://localhost:8080 thấy giao diện
- [ ] F12 → Console không có lỗi
- [ ] F12 → Network thấy API calls dùng relative paths
- [ ] Login admin thành công
- [ ] Password admin đã đổi

---

## 📞 Support

**Files quan trọng:**
- `server.exe` - Backend
- `portal.db` - Database (BACKUP!)
- `.env` - Config
- `dist/` - Frontend

**Log:** Xem terminal đang chạy server.exe

**Backup database:**
```powershell
Copy-Item portal.db portal.db.backup
```

---

**Version:** 2.0 (Relative API Paths)
**Build Date:** 2025-11-11
**Ready for Production!** 🚀
