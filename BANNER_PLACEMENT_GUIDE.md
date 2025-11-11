# Hướng dẫn vị trí hiển thị Banner

## Hiện trạng

**Backend**: ✅ Đã có đầy đủ API và model cho Banner
- Endpoint: `GET /api/v1/banners?placement=<placement>`
- Model có field `placement` để phân loại vị trí

**Frontend**: ⚠️ CHƯA tích hợp hiển thị banner trên trang chủ

## Các vị trí Banner được đề xuất

### 1. `home_hero` - Banner chính trang chủ
**Vị trí**: Ngay dưới header/navbar, trên phần "Tin nổi bật"
**Kích thước đề xuất**: 1200x400px (Full width responsive)
**Mô tả**: Banner quảng cáo lớn, carousel được, hiển thị nổi bật nhất

### 2. `home_top` - Banner đầu trang
**Vị trí**: Giữa header và nội dung chính
**Kích thước đề xuất**: 970x250px (Leaderboard)
**Mô tả**: Banner ngang, vị trí cao visibility

### 3. `home_sidebar` - Banner sidebar
**Vị trí**: Cột bên phải trang chủ (nếu có layout 2 cột)
**Kích thước đề xuất**: 300x250px hoặc 300x600px
**Mô tả**: Banner dọc, sticky scroll

### 4. `home_middle` - Banner giữa nội dung
**Vị trí**: Giữa các section tin tức (ví dụ: giữa "Hoạt động" và "Tin tức")
**Kích thước đề xuất**: 728x90px (Banner ngang)
**Mô tả**: Không quá phô trương, hòa vào nội dung

### 5. `home_bottom` - Banner cuối trang
**Vị trí**: Trước footer
**Kích thước đề xuất**: 970x250px
**Mô tả**: Banner cuối cùng trước khi rời trang

### 6. `article_top` - Banner đầu bài viết
**Vị trí**: Ngay dưới tiêu đề bài viết chi tiết
**Kích thước đề xuất**: 728x90px

### 7. `article_sidebar` - Banner sidebar bài viết
**Vị trí**: Cột bên phải trang chi tiết bài viết
**Kích thước đề xuất**: 300x250px

## Cách tích hợp vào Frontend

### Bước 1: Tạo component Banner

```tsx
// frontend/src/components/Banner.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';

interface BannerData {
  id: number;
  title: string;
  image_url: string;
  link_url: string;
  placement: string;
}

interface BannerProps {
  placement: string;
  className?: string;
}

export default function Banner({ placement, className = '' }: BannerProps) {
  const [banners, setBanners] = useState<BannerData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`/api/v1/banners?placement=${placement}`)
      .then((res) => {
        setBanners(res.data.data || []);
      })
      .finally(() => setLoading(false));
  }, [placement]);

  if (loading || banners.length === 0) return null;

  // Hiển thị banner đầu tiên (hoặc carousel nếu nhiều)
  const banner = banners[0];

  return (
    <div className={`banner-container ${className}`}>
      <a
        href={banner.link_url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <img
          src={banner.image_url}
          alt={banner.title}
          className="w-full h-auto rounded-lg shadow-sm"
          loading="lazy"
        />
      </a>
    </div>
  );
}
```

### Bước 2: Tích hợp vào trang Home

```tsx
// Trong frontend/src/pages/Home.tsx

import Banner from '../components/Banner';

// Thêm vào các vị trí thích hợp:

<main className="container mx-auto px-4 md:px-6 lg:px-8">
  {/* Banner Hero - Vị trí 1 */}
  <Banner placement="home_hero" className="my-6" />

  {/* Featured News */}
  <FeaturedNews articles={featured} />

  {/* Banner Middle - Vị trí 2 */}
  <Banner placement="home_middle" className="my-8" />

  {/* Tin tức sections... */}
  
  {/* Banner Bottom - Vị trí 3 */}
  <Banner placement="home_bottom" className="my-8" />
</main>
```

### Bước 3: Form tạo Banner trong Admin

Dropdown "Placement" trong form tạo/sửa banner nên có các options:

```tsx
<select name="placement">
  <option value="home_hero">Trang chủ - Banner chính (Hero)</option>
  <option value="home_top">Trang chủ - Đầu trang</option>
  <option value="home_sidebar">Trang chủ - Sidebar</option>
  <option value="home_middle">Trang chủ - Giữa nội dung</option>
  <option value="home_bottom">Trang chủ - Cuối trang</option>
  <option value="article_top">Bài viết - Đầu bài</option>
  <option value="article_sidebar">Bài viết - Sidebar</option>
</select>
```

## Ví dụ sử dụng

### Tạo banner trong Admin:
1. Vào `/admin/banners`
2. Click "Tạo Banner"
3. Upload ảnh (1200x400px cho hero)
4. Nhập link đích
5. Chọn **Placement**: "Trang chủ - Banner chính (Hero)"
6. Đặt thứ tự và active
7. Lưu

### Hiển thị trên trang chủ:
- Banner sẽ tự động xuất hiện ở vị trí "home_hero"
- Nếu có nhiều banner cùng placement, hiển thị theo sort_order
- Chỉ hiển thị banner is_active=true và trong khoảng start_date/end_date

## Tóm tắt

**Placement được đề xuất cho trang chủ**:
1. ✨ `home_hero` - Banner chính, nổi bật nhất (RECOMMENDED)
2. 📌 `home_top` - Banner đầu trang
3. 📊 `home_middle` - Giữa các section (ít phô trương)
4. 🔚 `home_bottom` - Trước footer

**Lưu ý**:
- Hiện tại frontend CHƯA có component Banner
- Cần tạo component và tích hợp vào Home.tsx
- Backend API đã sẵn sàng: `GET /api/v1/banners?placement=xxx`
