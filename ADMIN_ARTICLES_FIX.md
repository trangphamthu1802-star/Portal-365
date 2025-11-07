# Fix "Trang trắng" tại /admin/articles

## Vấn đề đã phát hiện và sửa

### 1. Import sai module
**Lỗi**: `List.tsx` và `Form.tsx` gọi các hooks/components không tồn tại
- `useArticles` → phải dùng `useAdminArticles`
- `useArticleMutations` → không tồn tại, phải dùng từng hook riêng
- `useArticle` → phải dùng `useAdminArticleById`
- `CreateArticleRequest` → phải dùng `DtoCreateArticleRequest`

**Đã sửa**:
```typescript
// List.tsx - TRƯỚC
import { useAdminArticles, useDeleteArticle, usePublishArticle, useUnpublishArticle } from '../../../hooks/useApi';

const { data, isLoading } = useArticles({ ... }); // ❌ Sai
const { deleteArticle, publishArticle } = useArticleMutations(); // ❌ Sai

// List.tsx - SAU
const { data, isLoading, isError, error } = useAdminArticles({ ... }); // ✅ Đúng
const deleteArticle = useDeleteArticle(); // ✅ Đúng
const publishArticle = usePublishArticle();
const unpublishArticle = useUnpublishArticle();
```

### 2. Thiếu xử lý trạng thái lỗi
**Lỗi**: Khi API lỗi, component không hiển thị gì → trang trắng

**Đã sửa**: Thêm error state trong List.tsx
```typescript
if (isError) {
  const errMsg = normalizeError(error);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-red-600 text-center mb-4">
        <svg>...</svg>
        <h2>Lỗi tải dữ liệu</h2>
        <p>{errMsg.message}</p>
      </div>
      <button onClick={() => window.location.reload()}>
        Thử lại
      </button>
    </div>
  );
}
```

### 3. Components Common thiếu/sai đường dẫn
**Lỗi**: 
- Có 2 folders: `Common` (uppercase) và `common` (lowercase)
- Windows case-insensitive nhưng TS báo lỗi
- `Toast` component tồn tại trong `common/` chứ không phải `Common/`

**Đã sửa**:
```typescript
// SAU - Import từ common (lowercase)
import Toast from '../../../components/common/Toast';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ConfirmModal from '../../../components/Common'; // ConfirmModal ở Common.tsx
```

### 4. EmptyState props không đúng
**Lỗi**: 
```typescript
<EmptyState
  message="..." // ❌ Sai prop
  action={<button>...</button>} // ❌ Sai kiểu
/>
```

**Đã sửa**:
```typescript
<EmptyState
  title="Chưa có bài viết nào"
  description="Bắt đầu bằng cách tạo bài viết đầu tiên"
  action={{
    label: 'Tạo bài viết mới',
    onClick: () => navigate('/admin/articles/create')
  }}
/>
```

### 5. TypeScript errors
**Đã sửa**:
- Thêm type annotation: `cat: any`, `tag: any`
- Fix nullable check: `formData.summary?.trim()`
- Fix type casting: `formData.scheduled_at as string`
- Thêm interface `Article` và `ArticleStatus` type

## Files đã thay đổi

### Modified Files
1. ✅ `frontend/src/pages/admin/articles/List.tsx`
   - Import đúng hooks từ useApi
   - Thêm error handling với normalizeError
   - Sử dụng từng mutation hook riêng lẻ
   - Fix EmptyState props
   - Import Toast, LoadingSpinner từ common/

2. ✅ `frontend/src/pages/admin/articles/Form.tsx`
   - Import đúng hooks và types
   - Fix useAdminArticleById thay vì useArticle
   - Import Toast, LoadingSpinner, ConfirmModal
   - Fix TypeScript errors
   - Fix DtoCreateArticleRequest type

### Created Files
3. ✅ `frontend/src/components/common/Toast.tsx`
   - Component Toast với animation
   - Support 4 types: success, error, info, warning
   - Auto-close sau 3 giây

## Kết quả

✅ **Không còn "trang trắng"**
- Loading state: Hiển thị spinner
- Error state: Hiển thị thông báo lỗi + nút "Thử lại"
- Empty state: Hiển thị "Chưa có bài viết" + nút "Tạo mới"
- Success state: Hiển thị danh sách bài viết

✅ **Không còn lỗi TypeScript**

✅ **API calls đúng endpoints**
- List: `GET /api/v1/admin/articles`
- Delete: `DELETE /api/v1/admin/articles/:id`
- Publish: `POST /api/v1/admin/articles/:id/publish`
- Unpublish: `POST /api/v1/admin/articles/:id/unpublish`

## Test

Truy cập: http://localhost:5173/admin/articles

**Các trường hợp cần test:**
1. ✅ Loading spinner khi đang tải
2. ✅ Hiển thị danh sách nếu có data
3. ✅ Empty state nếu không có bài viết
4. ✅ Error state nếu API lỗi (VD: tắt backend)
5. ✅ Toast notification khi delete/publish/unpublish
6. ✅ Filters hoạt động (search, category, status)
7. ✅ Pagination hoạt động
