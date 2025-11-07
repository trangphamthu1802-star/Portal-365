# Portal 365 Frontend API Client

## Overview

API client được tự động generate từ Swagger/OpenAPI spec của backend. Client sử dụng axios và có TypeScript typings đầy đủ.

## Generated Files

- `api.ts` - Main API class với tất cả endpoints
- `data-contracts.ts` - TypeScript interfaces cho request/response
- `http-client.ts` - HTTP client base class
- `client.ts` - Configured API instance với auth interceptors

## Usage

### Import API Client

```typescript
import { api } from '@/lib/api';
```

### Authentication

```typescript
import { authService } from '@/lib/api';

// Login
const loginData = await authService.login('admin@portal365.com', 'admin123');

// Logout
await authService.logout();

// Check if authenticated
const isAuth = authService.isAuthenticated();

// Get current user
const user = authService.getCurrentUser();
```

### Articles

```typescript
// List published articles
const articles = await api.v1ArticlesList({
  page: 1,
  page_size: 12,
  category_slug: 'hoat-dong-cua-su-doan',
  sort: '-published_at'
});

// Get article by slug
const article = await api.v1ArticlesDetail({ slug: 'my-article' });

// Get related articles
const related = await api.v1ArticlesRelatedList({ 
  slug: 'my-article',
  limit: 5
});

// Admin: Create article
const newArticle = await api.v1AdminArticlesCreate({
  title: 'New Article',
  content: '<p>Content here</p>',
  category_id: 1,
  summary: 'Summary',
  is_featured: false
});

// Admin: Update article
await api.v1AdminArticlesUpdate(
  { id: 1 },
  {
    title: 'Updated Title',
    content: '<p>Updated content</p>',
    category_id: 1
  }
);

// Admin: Publish article
await api.v1AdminArticlesPublishCreate({ id: 1 });

// Admin: Submit for review
await api.v1AdminArticlesSubmitCreate({ id: 1 });

// Admin: Approve
await api.v1AdminArticlesApproveCreate({ id: 1 });

// Admin: Reject
await api.v1AdminArticlesRejectCreate({ id: 1 });
```

### Categories

```typescript
// List all categories
const categories = await api.v1CategoriesList();

// Get category by slug
const category = await api.v1CategoriesDetail({ slug: 'hoat-dong-cua-su-doan' });

// Get menu tree
const menu = await api.v1CategoriesMenuList();

// Admin: Create category
const newCat = await api.v1AdminCategoriesCreate({
  name: 'New Category',
  slug: 'new-category',
  description: 'Description',
  is_active: true,
  sort_order: 1
});

// Admin: Update category
await api.v1AdminCategoriesUpdate(
  { id: 1 },
  {
    name: 'Updated Name',
    slug: 'updated-slug',
    is_active: true
  }
);

// Admin: Delete category
await api.v1AdminCategoriesDelete({ id: 1 });
```

### Tags

```typescript
// List all tags
const tags = await api.v1TagsList();

// Get tag by slug
const tag = await api.v1TagsDetail({ slug: 'my-tag' });

// Admin: Create tag
const newTag = await api.v1AdminTagsCreate({
  name: 'New Tag',
  slug: 'new-tag'
});

// Admin: Delete tag
await api.v1AdminTagsDelete({ id: 1 });
```

### Media

```typescript
// List media items
const mediaItems = await api.mediaList({
  page: 1,
  page_size: 20
});

// Get media by slug
const media = await api.mediaDetail({ slug: 'image-slug' });

// Admin: Upload media
const formData = new FormData();
formData.append('file', file);
formData.append('title', 'My Image');
formData.append('alt', 'Alt text');
formData.append('description', 'Description');

const uploaded = await api.adminMediaUploadCreate(formData);

// Admin: Delete media
await api.adminMediaDelete({ id: 1 });
```

### Banners

```typescript
// List banners by placement
const banners = await api.bannersList({
  placement: 'home_top'
});

// Admin: Create banner
const newBanner = await api.adminBannersCreate({
  title: 'Home Banner',
  media_id: 1,
  placement: 'home_top',
  link_url: 'https://example.com',
  sort_order: 1,
  is_active: true,
  starts_at: '2025-01-01T00:00:00Z',
  ends_at: '2025-12-31T23:59:59Z'
});

// Admin: Update banner
await api.adminBannersUpdate(
  { id: 1 },
  { ...updatedData }
);

// Admin: Delete banner
await api.adminBannersDelete({ id: 1 });
```

### Pages

```typescript
// List pages
const pages = await api.v1PagesList({ 
  group: 'introduction',
  status: 'published'
});

// Get page by slug
const page = await api.v1PagesDetail({ slug: 'about-us' });

// Admin: Create page
const newPage = await api.v1AdminPagesCreate({
  title: 'About Us',
  slug: 'about-us',
  content: '<p>Content</p>',
  group: 'introduction',
  status: 'published',
  order: 1
});
```

### Documents

```typescript
// List documents
const docs = await api.v1DocumentsList({
  page: 1,
  page_size: 20,
  category: 'regulations'
});

// Get document by slug
const doc = await api.v1DocumentsDetail({ slug: 'doc-slug' });

// Admin: Create document
const newDoc = await api.v1AdminDocumentsCreate({
  title: 'Document Title',
  file_url: '/path/to/file.pdf',
  category: 'regulations',
  description: 'Description'
});
```

### Activities

```typescript
// List activities
const activities = await api.v1ActivitiesList({
  page: 1,
  page_size: 12
});

// Get activity by slug
const activity = await api.v1ActivitiesDetail({ slug: 'activity-slug' });

// Admin: Create activity
const newActivity = await api.v1AdminActivitiesCreate({
  title: 'Activity Title',
  content: '<p>Content</p>',
  category_id: 1
});

// Admin: Publish activity
await api.v1AdminActivitiesPublishCreate({ id: 1 });
```

### Home Page

```typescript
// Get home page data (featured articles, category sections, banners)
const homeData = await api.v1HomeList({
  featured_limit: 5,
  latest_limit: 10,
  per_category_limit: 6
});
```

### Search

```typescript
// Search across content
const results = await api.v1SearchList({
  q: 'search query',
  type: 'article',
  page: 1,
  page_size: 20
});
```

### Health Check

```typescript
// Check API health
const health = await api.v1HealthzList();
```

## React Query Hooks Example

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';

// Fetch articles
export const useArticles = (params) => {
  return useQuery({
    queryKey: ['articles', params],
    queryFn: () => api.v1ArticlesList(params)
  });
};

// Create article
export const useCreateArticle = () => {
  return useMutation({
    mutationFn: (data) => api.v1AdminArticlesCreate(data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    }
  });
};
```

## Error Handling

```typescript
try {
  const data = await api.v1ArticlesList({ page: 1 });
  console.log(data);
} catch (error) {
  if (error.response?.status === 401) {
    // Unauthorized - will auto-refresh token
  } else if (error.response?.status === 404) {
    // Not found
  } else {
    // Other errors
    console.error(error.response?.data?.error);
  }
}
```

## Auto Token Refresh

API client tự động refresh access token khi hết hạn (401 response). Nếu refresh thất bại, user sẽ được redirect về `/login`.

## Regenerate API Client

Khi backend API thay đổi:

```bash
cd backend
swag init -g cmd/server/main.go -o docs/swagger

cd ../frontend
npm run generate:api
```
