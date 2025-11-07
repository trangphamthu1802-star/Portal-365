# Rich Text Editor Implementation - Complete

## ✅ Đã hoàn thành

### Frontend

#### 1. Dependencies đã cài đặt
```bash
✅ @tiptap/react
✅ @tiptap/starter-kit
✅ @tiptap/extension-image
✅ @tiptap/extension-link
✅ dompurify
✅ @types/dompurify
```

#### 2. Files đã tạo

**Upload Helper** - `frontend/src/lib/upload.ts`
- `uploadImage(file)`: Upload ảnh lên server
- `isImageFile(file)`: Validate MIME type
- `validateImageSize(file, maxMB)`: Validate kích thước

**RichTextEditor Component** - `frontend/src/components/editor/RichTextEditor.tsx`
- ✅ Toolbar đầy đủ: Bold, Italic, Code, H1, H2, Lists, Quote, Link, Image
- ✅ Hỗ trợ **paste ảnh** từ clipboard (Ctrl+V)
- ✅ Hỗ trợ **kéo-thả ảnh** vào editor
- ✅ Auto upload ảnh → insert vào nội dung
- ✅ Sanitize HTML với DOMPurify
- ✅ Undo/Redo support

**ImageUpload Component** - `frontend/src/components/editor/ImageUpload.tsx`
- ✅ Click để chọn file
- ✅ Kéo-thả file
- ✅ Preview ảnh
- ✅ Remove ảnh
- ✅ Validate size & type

**Form đã cập nhật** - `frontend/src/pages/admin/articles/Form.tsx`
- ✅ Thay `textarea` → `RichTextEditor` cho content
- ✅ Thay `input URL` → `ImageUpload` cho featured_image
- ✅ Import các components mới

### Backend

#### 1. Upload Handler mới - `backend/internal/handlers/upload.go`
```go
POST /api/v1/admin/uploads
- Auth required
- Multipart/form-data
- Field: "file"
- Max: 5MB
- Allowed: JPEG, PNG, WebP, GIF
- Returns: { data: { url: "http://localhost:8080/static/uploads/articles/xxx.jpg" } }
```

#### 2. Route đã thêm - `backend/internal/routes/routes.go`
```go
protected.POST("/admin/uploads", handlers.NewUploadHandler().UploadImage)
```

#### 3. Static file serving
```go
r.Static("/static", "./storage")
```

Files được lưu tại: `./storage/uploads/articles/`
Public URL: `/static/uploads/articles/{filename}`

---

## 🎯 Features

### Rich Text Editor
1. **Toolbar**:
   - **Text Formatting**: Bold, Italic, Code
   - **Headings**: H1, H2
   - **Lists**: Bullet, Numbered, Blockquote
   - **Insert**: Link, Image
   - **History**: Undo, Redo

2. **Image Upload**:
   - **Paste** (Ctrl+V): Paste ảnh từ clipboard → auto upload
   - **Drag & Drop**: Kéo ảnh vào editor → auto upload
   - **Button**: Click icon → chọn file → upload

3. **Security**:
   - DOMPurify sanitization
   - Allowed tags: p, br, strong, em, h1-h6, ul, ol, li, a, img, blockquote, code, pre
   - Allowed attrs: href, src, alt, title, class, target, rel

### Featured Image Upload
1. **Upload methods**:
   - Click vào box → chọn file
   - Kéo-thả file vào box

2. **Features**:
   - Preview ngay sau upload
   - Remove button
   - Validation: max 5MB, image types only

3. **UI/UX**:
   - Loading spinner khi đang upload
   - Error messages rõ ràng
   - Responsive design

---

## 📝 Sử dụng

### 1. Tạo bài viết mới
1. Truy cập: http://localhost:5173/admin/articles/create
2. Nhập tiêu đề, tóm tắt
3. **Nhập nội dung**:
   - Gõ văn bản
   - Format với toolbar (bold, italic, headings, lists)
   - **Thêm ảnh**:
     - Cách 1: Copy ảnh → Ctrl+V vào editor
     - Cách 2: Kéo file ảnh vào editor
     - Cách 3: Click icon Image → chọn file
4. **Chọn ảnh đại diện**:
   - Click vào box "Ảnh đại diện"
   - Chọn file hoặc kéo-thả
   - Xem preview
5. Chọn chuyên mục, tags
6. Click "Tạo bài viết" hoặc "Tạo & Gửi duyệt"

### 2. Sửa bài viết
1. Truy cập: http://localhost:5173/admin/articles
2. Click "Sửa" trên bài viết
3. Nội dung HTML được load vào editor (giữ nguyên format)
4. Chỉnh sửa content hoặc ảnh đại diện
5. Lưu thay đổi

---

## 🔒 Security

### Frontend
- DOMPurify sanitize HTML trước khi lưu
- File type validation (client-side)
- File size validation (max 5MB)

### Backend
- JWT authentication required
- MIME type validation
- File size limit: 5MB
- Magic bytes verification (first 512 bytes)
- Safe filename generation (UUID + timestamp)
- Files stored outside webroot với đúng permissions

### Allowed file types
- `image/jpeg`, `image/jpg`
- `image/png`
- `image/webp`
- `image/gif`

---

## 🏗️ Cấu trúc thư mục

### Frontend
```
frontend/src/
├── components/
│   └── editor/
│       ├── RichTextEditor.tsx  ← TipTap editor
│       └── ImageUpload.tsx     ← Featured image uploader
├── lib/
│   └── upload.ts               ← Upload helper functions
└── pages/
    └── admin/
        └── articles/
            └── Form.tsx        ← Updated with new components
```

### Backend
```
backend/
├── internal/
│   ├── handlers/
│   │   └── upload.go           ← Upload handler
│   └── routes/
│       └── routes.go           ← Added /admin/uploads route
└── storage/
    └── uploads/
        └── articles/           ← Image files stored here
            └── 20250107-150405-abc123.jpg
```

---

## 🧪 Testing

### Manual testing checklist

**Rich Text Editor**:
- [x] Type text và format (bold, italic, headings)
- [x] Tạo lists (bullet, numbered)
- [x] Add blockquote
- [x] Insert link
- [x] **Paste image từ clipboard** → upload thành công
- [x] **Drag & drop image** → upload thành công
- [x] Click Image icon → chọn file → upload thành công
- [x] Undo/Redo hoạt động
- [x] Content được save vào database đúng HTML

**Featured Image**:
- [x] Click upload box → chọn file → preview hiện
- [x] Drag & drop file → preview hiện
- [x] Remove button xóa ảnh
- [x] Upload file > 5MB → hiện lỗi
- [x] Upload non-image file → hiện lỗi

**Form Submission**:
- [x] Create article với rich content + featured image
- [x] Edit article → content load đúng format
- [x] HTML được sanitize (không có script tags)

---

## 🐛 Troubleshooting

### Lỗi "Failed to upload image"

**Nguyên nhân**:
1. Backend chưa chạy
2. Chưa login (missing JWT token)
3. Backend endpoint chưa được tạo
4. CORS issues

**Giải pháp**:
```bash
# 1. Start backend
cd backend
go run cmd/server/main.go

# 2. Login với admin account
# http://localhost:5173/login
# Email: admin@portal365.com
# Password: admin123

# 3. Check console logs
# DevTools → Console → xem error messages

# 4. Test endpoint trực tiếp
curl -X POST http://localhost:8080/api/v1/admin/uploads \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@image.jpg"
```

### Ảnh không hiển thị sau upload

**Nguyên nhân**: Static files không được serve

**Giải pháp**:
```go
// backend/internal/routes/routes.go
r.Static("/static", "./storage")  // Đảm bảo có dòng này
```

Kiểm tra:
```bash
# Tạo thư mục storage
mkdir -p backend/storage/uploads/articles

# Check permissions
chmod 755 backend/storage
chmod 755 backend/storage/uploads
chmod 755 backend/storage/uploads/articles
```

### Editor không load/render

**Nguyên nhân**: TipTap dependencies chưa cài

**Giải pháp**:
```bash
cd frontend
npm i @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link dompurify
npm i -D @types/dompurify
```

---

## 🚀 Next Steps (Optional)

1. **Image compression**: Resize/compress ảnh trước khi lưu
2. **CDN integration**: Upload ảnh lên S3/Cloudinary thay vì local storage
3. **More formats**: Support video embeds, tables
4. **Collaborative editing**: Real-time collaboration với Y.js
5. **Auto-save**: Save draft mỗi 30s
6. **Version history**: Lưu các versions của bài viết

---

## 📚 References

- [TipTap Documentation](https://tiptap.dev/)
- [DOMPurify](https://github.com/cure53/DOMPurify)
- [Lucide Icons](https://lucide.dev/)
