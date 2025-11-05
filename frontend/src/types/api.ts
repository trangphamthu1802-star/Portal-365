export interface User {
  id: number;
  email: string;
  full_name: string;
  avatar: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  roles?: Role[];
}

export interface Role {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  featured_image: string;
  author_id: number;
  category_id: number;
  status: ArticleStatus;
  view_count: number;
  is_featured: boolean;
  published_at: string | null;
  scheduled_at: string | null;
  created_at: string;
  updated_at: string;
  tags?: string[];
}

export type ArticleStatus = 'draft' | 'under_review' | 'published' | 'hidden' | 'rejected';

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  parent_id: number | null;
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
  group: string;
  content: string;
  status: 'draft' | 'published';
  order: number;
  hero_image_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaginationResponse {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

export interface SuccessResponse<T> {
  data: T;
  pagination?: PaginationResponse;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  full_name: string;
  role_ids: number[];
}

export interface UpdateUserRequest {
  email: string;
  full_name: string;
  is_active: boolean;
}

export interface ChangePasswordRequest {
  new_password: string;
}

export interface CreateArticleRequest {
  title: string;
  slug?: string;
  summary: string;
  content: string;
  featured_image?: string;
  category_id: number;
  tag_ids?: number[];
  is_featured?: boolean;
  scheduled_at?: string;
}

export interface UpdateArticleRequest extends CreateArticleRequest {}

export interface CreatePageRequest {
  title: string;
  slug: string;
  group: string;
  content: string;
  status: 'draft' | 'published';
  order?: number;
  hero_image_url?: string;
  seo_title?: string;
  seo_description?: string;
}

export interface UpdatePageRequest extends CreatePageRequest {
  is_active?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}
