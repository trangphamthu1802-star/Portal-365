import { apiClient } from '../lib/apiClient';
import type { Page, PageCreateRequest, PageUpdateRequest, PaginatedResponse } from '../types/models';

export interface PageListParams {
  page?: number;
  page_size?: number;
  status?: 'published' | 'draft' | 'hidden';
  q?: string;
}

export const pagesApi = {
  /**
   * List all pages (admin) with pagination and filters
   */
  async list(params?: PageListParams): Promise<PaginatedResponse<Page>> {
    const response = await apiClient.get<PaginatedResponse<Page>>('/pages', { params });
    return response.data;
  },

  /**
   * Get page by ID (admin)
   */
  async getById(id: number): Promise<Page> {
    const response = await apiClient.get<{ data: Page }>(`/pages/${id}`);
    return response.data.data;
  },

  /**
   * Get page by slug (public)
   */
  async getBySlug(slug: string): Promise<Page> {
    const response = await apiClient.get<{ data: Page }>(`/pages/${slug}`);
    return response.data.data;
  },

  /**
   * Create new page (admin)
   */
  async create(data: PageCreateRequest): Promise<Page> {
    const response = await apiClient.post<{ data: Page }>('/pages', data);
    return response.data.data;
  },

  /**
   * Update existing page (admin)
   */
  async update(id: number, data: PageUpdateRequest): Promise<Page> {
    const response = await apiClient.put<{ data: Page }>(`/pages/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete page (admin)
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/pages/${id}`);
  },

  /**
   * Publish page (admin)
   */
  async publish(id: number): Promise<Page> {
    const response = await apiClient.post<{ data: Page }>(`/pages/${id}/publish`);
    return response.data.data;
  },

  /**
   * Unpublish page (admin)
   */
  async unpublish(id: number): Promise<Page> {
    const response = await apiClient.post<{ data: Page }>(`/pages/${id}/unpublish`);
    return response.data.data;
  },
};
