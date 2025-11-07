# Fix: Insufficient Permissions khi truy cập /admin/articles

## Nguyên nhân
Backend endpoint `/admin/articles` yêu cầu user phải có một trong các role:
- **Admin**
- **Editor** 
- **Author**

User hiện tại không có role này hoặc chưa login.

## Giải pháp

### Bước 1: Đảm bảo backend đang chạy
```bash
cd C:\Users\Admin\portal-365\backend
go run cmd/server/main.go
```

### Bước 2: Chạy seed để tạo admin user (nếu chưa có)
```bash
cd C:\Users\Admin\portal-365\backend
go run cmd/seed/main.go
```

Output sẽ hiển thị:
```
Admin credentials: admin@portal365.com / admin123
```

### Bước 3: Login với admin account

1. Mở browser: http://localhost:5173/login
2. Nhập credentials:
   - **Email**: `admin@portal365.com`
   - **Password**: `admin123`
3. Click "Đăng nhập"

### Bước 4: Kiểm tra token trong localStorage

Mở DevTools Console (F12) và chạy:
```javascript
console.log({
  access_token: localStorage.getItem('access_token'),
  refresh_token: localStorage.getItem('refresh_token')
});
```

Nếu có token → Login thành công!

### Bước 5: Truy cập lại /admin/articles

Truy cập: http://localhost:5173/admin/articles

Bây giờ sẽ hiển thị danh sách bài viết (hoặc empty state nếu chưa có bài viết).

## Nếu vẫn lỗi "Insufficient permissions"

### Kiểm tra user role trong database:

```sql
-- SQLite query
sqlite3 backend/portal.db

SELECT u.id, u.email, r.name as role
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.id
WHERE u.email = 'admin@portal365.com';
```

Kết quả mong đợi:
```
id | email                  | role
1  | admin@portal365.com    | Admin
```

### Nếu không có role, assign thủ công:

```sql
-- Get role ID
SELECT id FROM roles WHERE name = 'Admin';
-- Giả sử role_id = 1

-- Get user ID  
SELECT id FROM users WHERE email = 'admin@portal365.com';
-- Giả sử user_id = 1

-- Assign role
INSERT INTO user_roles (user_id, role_id) VALUES (1, 1);
```

### Hoặc chạy lại seed:

```bash
cd backend
rm portal.db  # Xóa DB cũ
go run cmd/seed/main.go  # Tạo lại từ đầu
```

## Test sau khi fix

1. ✅ Login: http://localhost:5173/login
2. ✅ Dashboard: http://localhost:5173/admin
3. ✅ Articles: http://localhost:5173/admin/articles
4. ✅ Create article: http://localhost:5173/admin/articles/create

## Các role và permissions

### Admin
- Toàn quyền trên hệ thống
- Manage users, roles
- Manage tất cả content

### Editor
- Manage articles (create, edit, delete)
- Manage categories, tags
- Approve/reject articles
- Manage media

### Author
- Create articles
- Edit own articles
- Submit for review
- Upload media

### Reviewer (optional)
- Review articles
- Approve/reject

### Moderator (optional)
- Moderate comments
- Basic content management

## Endpoints cần authentication

| Endpoint | Required Roles |
|----------|---------------|
| `/admin/articles` | Admin, Editor, Author |
| `/admin/categories` | Admin, Editor |
| `/admin/tags` | Admin, Editor |
| `/admin/media` | Admin, Editor, Author |
| `/admin/users` | Admin |
| `/admin/roles` | Admin |
| `/admin/pages` | Admin, Editor |
| `/admin/menus` | Admin |
| `/admin/settings` | Admin |

## Debug checklist

- [ ] Backend running on port 8080
- [ ] Frontend running on port 5173
- [ ] Admin user created (email: admin@portal365.com)
- [ ] Admin user has "Admin" role assigned
- [ ] Login successful (có access_token trong localStorage)
- [ ] Request headers có `Authorization: Bearer <token>`
- [ ] Token chưa expired (check /auth/me endpoint)
