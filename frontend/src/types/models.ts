// Auto-generated types from Swagger API

export type ArticleStatus = 'draft' | 'under_review' | 'published' | 'hidden' | 'rejected';
export type PageStatus = 'draft' | 'published';

export interface Article {
  id: number;
  title: string;
  slug: string;
  summary?: string;
  content: string;
  featured_image?: string;
  author_id: number;
  category_id: number;
  status: ArticleStatus;
  is_featured: boolean;
  view_count: number;
  published_at?: string;
  scheduled_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ArticleResponse extends Article {
  author_name?: string;
  category_name?: string;
  tags?: string[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent_id?: number;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  created_at: string;
}

export interface Page {
  id: number;
  title: string;
  slug: string;
  content: string;
  group: string;
  key: string;  // Added for introduction pages
  hero_image_url?: string;
  seo_title?: string;
  seo_description?: string;
  status: PageStatus;
  is_active: boolean;
  order: number;
  view_count: number;  // Added for tracking views
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  avatar?: string;
  roles: string[];
  is_active: boolean;
  created_at: string;
}

export interface Activity extends Article {
  // Activities use same structure as Articles
}

export interface Banner {
  id: number;
  title: string;
  image_url: string;
  link_url?: string;
  placement: 'home_top' | 'home_sidebar' | 'category_top' | 'article_sidebar';
  is_active: boolean;
  start_date?: string;
  end_date?: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Menu {
  id: number;
  name: string;
  slug: string;
  position: 'header' | 'footer' | 'sidebar';
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface MenuItem {
  id: number;
  menu_id: number;
  title: string;
  url: string;
  parent_id?: number;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Comment {
  id: number;
  article_id: number;
  user_id?: number;
  author_name: string;
  author_email: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface Media {
  id: number;
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
  url: string;
  thumbnail_url?: string;
  uploaded_by: number;
  created_at: string;
}

export interface Setting {
  key: string;
  value: string;
  description?: string;
  is_public: boolean;
}

export interface Role {
  id: number;
  name: string;
  permissions: string[];
}

// Request DTOs
export interface CreateArticleRequest {
  title: string;
  slug: string;
  content: string;
  summary?: string;
  category_id: number;
  featured_image?: string;
  is_featured?: boolean;
  scheduled_at?: string;
  tag_ids?: number[];
}

export interface UpdateArticleRequest extends Partial<CreateArticleRequest> {}

export interface CreateCategoryRequest {
  name: string;
  slug: string;
  description?: string;
  parent_id?: number;
  sort_order?: number;
  is_active?: boolean;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {}

export interface CreateTagRequest {
  name: string;
  slug: string;
}

export interface CreatePageRequest {
  title: string;
  slug: string;
  content: string;
  group?: string;
  hero_image_url?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  status: 'draft' | 'published' | 'hidden';
  is_active?: boolean;
  order?: number;
}

export interface UpdatePageRequest extends Partial<CreatePageRequest> {}

// Alias for backward compatibility
export type PageCreateRequest = CreatePageRequest;
export type PageUpdateRequest = UpdatePageRequest;

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: User;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

// Response wrappers
export interface SuccessResponse<T = any> {
  data: T;
  pagination?: PaginationResponse;
}

export interface PaginationResponse {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

// Alias for paginated responses
export type PaginatedResponse<T = any> = SuccessResponse<T[]>;

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

// Stats
export interface StatsOverview {
  total_articles: number;
  published_articles: number;
  draft_articles: number;
  total_users: number;
  total_views: number;
  total_comments: number;
}

export interface AuditLog {
  id: number;
  user_id: number;
  user_name: string;
  action: string;
  entity_type: string;
  entity_id: number;
  details?: string;
  ip_address?: string;
  created_at: string;
}
