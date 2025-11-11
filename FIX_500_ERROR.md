# Hướng dẫn khắc phục lỗi 500 - Admin Articles

## Vấn đề
- Backend server không chạy ổn định
- Lỗi 500 khi gọi API `/admin/articles`

## Giải pháp: Khởi động đúng cách

### Cách 1: Sử dụng script có sẵn (KHUYẾN NGHỊ)

**Terminal 1 - Backend:**
```powershell
# Mở PowerShell terminal mới
cd C:\Users\Admin\portal-365\backend
.\start.ps1
```

**Terminal 2 - Frontend:**
```powershell
# Mở PowerShell terminal thứ 2
cd C:\Users\Admin\portal-365\frontend
npm run dev
```

### Cách 2: Chạy thủ công

**Terminal Backend:**
```powershell
cd C:\Users\Admin\portal-365\backend
$env:PORT="8080"
$env:JWT_SECRET="change-me-in-production"
$env:SQLITE_DSN="file:portal.db?_busy_timeout=5000"
$env:CORS_ALLOWED_ORIGINS="http://localhost:5173"
go run ./cmd/server
```

**Terminal Frontend:**
```powershell
cd C:\Users\Admin\portal-365\frontend
npm run dev
```

## Sau khi chạy thành công

1. **Đăng nhập tại:** `http://localhost:5173/login`
   - Email: `admin@portal365.com`
   - Password: `admin123`

2. **Vào trang articles:** `http://localhost:5173/admin/articles`

3. **Xem log backend** để check lỗi 500 cụ thể (nếu vẫn bị lỗi)

## Nếu vẫn bị lỗi 500

Kiểm tra log trong terminal backend, thường sẽ thấy:
- SQL errors
- Nil pointer errors  
- Data format errors

Copy lỗi đó và báo cho tôi để fix tiếp.

## Lưu ý

- **KHÔNG** đóng 2 terminal đang chạy server
- Backend phải chạy trước Frontend
- Nếu backend crash, refresh lại frontend sẽ bị lỗi
