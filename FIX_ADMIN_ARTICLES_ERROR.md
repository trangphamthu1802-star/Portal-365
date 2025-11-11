# Hướng dẫn fix lỗi "Failed to fetch articles"

## Nguyên nhân
- Chưa đăng nhập hoặc token đã hết hạn
- Backend server có thể không chạy

## Cách fix

### Bước 1: Kiểm tra backend đang chạy
```powershell
# Trong terminal backend (nếu chưa chạy)
cd backend
go run cmd/server/main.go
```

### Bước 2: Kiểm tra frontend đang chạy
```powershell
# Trong terminal frontend (nếu chưa chạy)
cd frontend
npm run dev
```

### Bước 3: Đăng nhập lại
1. Mở trình duyệt: http://localhost:5173/login
2. Nhập:
   - Email: admin@portal365.com
   - Password: admin123
3. Click "Đăng nhập"

### Bước 4: Vào trang articles
- Sau khi đăng nhập thành công
- Vào: http://localhost:5173/admin/articles
- Sẽ thấy danh sách 14 bài viết

## Debug bằng Console (F12)

Nếu vẫn lỗi, mở Console (F12) và chạy:

```javascript
// Kiểm tra token
console.log('Token:', localStorage.getItem('access_token'));
console.log('User:', localStorage.getItem('user'));

// Nếu không có token, đăng nhập:
fetch('http://localhost:8080/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@portal365.com',
    password: 'admin123'
  })
})
.then(r => r.json())
.then(data => {
  localStorage.setItem('access_token', data.data.access_token);
  localStorage.setItem('refresh_token', data.data.refresh_token);
  localStorage.setItem('user', JSON.stringify(data.data.user));
  console.log('Login OK! Refresh trang.');
  location.reload();
});
```

## Hoặc dùng file test

Mở file: c:\Users\Admin\portal-365\test-admin.html

Click các nút theo thứ tự:
1. Test Backend
2. Login
3. Get Articles
