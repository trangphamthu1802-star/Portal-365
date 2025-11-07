import { apiClient } from '../lib/apiClient';
import type {
  Article,
  ArticleResponse,
  CreateArticleRequest,
  UpdateArticleRequest,
  SuccessResponse,
  PaginationResponse,
} from '../types/models';

export interface ArticleListParams {
  page?: number;
  page_size?: number;
  category_id?: number;
  tag?: string;
  status?: string;
  author_id?: number;
  from?: string;
  to?: string;
  q?: string;
}

// Public Article APIs
export const articlesApi = {
  // List published articles (public)
  listPublic: async (params?: ArticleListParams) => {
    const response = await apiClient.get<
      SuccessResponse<ArticleResponse[]> & { pagination: PaginationResponse }
    >('/articles', { params });
    return response.data;
  },

  // Get article by slug (public)
  getBySlug: async (slug: string) => {
    const response = await apiClient.get<SuccessResponse<ArticleResponse>>(`/articles/${slug}`);
    return response.data.data;
  },

  // Get related articles
  getRelated: async (slug: string) => {
    const response = await apiClient.get<SuccessResponse<ArticleResponse[]>>(
      `/articles/${slug}/related`
    );
    return response.data.data;
  },

  // Record view
  recordView: async (id: number) => {
    await apiClient.post(`/articles/${id}/views`);
  },
};

// Admin Article APIs
export const articlesAdminApi = {
  // List all articles (admin)
  list: async (params?: ArticleListParams) => {
    const response = await apiClient.get<
      SuccessResponse<ArticleResponse[]> & { pagination: PaginationResponse }
    >('/admin/articles', { params });
    return response.data;
  },

  // Get article by ID (admin)
  getById: async (id: number) => {
    const response = await apiClient.get<SuccessResponse<ArticleResponse>>(`/admin/articles/${id}`);
    return response.data.data;
  },

  // Create article
  create: async (data: CreateArticleRequest) => {
    const response = await apiClient.post<SuccessResponse<Article>>('/admin/articles', data);
    return response.data.data;
  },

  // Update article
  update: async (id: number, data: UpdateArticleRequest) => {
    const response = await apiClient.put<SuccessResponse<Article>>(`/admin/articles/${id}`, data);
    return response.data.data;
  },

  // Delete article
  delete: async (id: number) => {
    await apiClient.delete(`/admin/articles/${id}`);
  },

  // Workflow actions
  submitForReview: async (id: number) => {
    const response = await apiClient.post<SuccessResponse<Article>>(
      `/admin/articles/${id}/submit`
    );
    return response.data.data;
  },

  approve: async (id: number) => {
    const response = await apiClient.post<SuccessResponse<Article>>(`/admin/articles/${id}/approve`);
    return response.data.data;
  },

  reject: async (id: number, reason?: string) => {
    const response = await apiClient.post<SuccessResponse<Article>>(`/admin/articles/${id}/reject`, {
      reason,
    });
    return response.data.data;
  },

  publish: async (id: number) => {
    const response = await apiClient.post<SuccessResponse<Article>>(`/admin/articles/${id}/publish`);
    return response.data.data;
  },

  unpublish: async (id: number) => {
    const response = await apiClient.post<SuccessResponse<Article>>(
      `/admin/articles/${id}/unpublish`
    );
    return response.data.data;
  },

  // Get revisions
  getRevisions: async (id: number) => {
    const response = await apiClient.get<SuccessResponse<Article[]>>(
      `/admin/articles/${id}/revisions`
    );
    return response.data.data;
  },
};
