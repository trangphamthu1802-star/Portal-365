import { apiClient } from '../lib/apiClient';
import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  Tag,
  CreateTagRequest,
  SuccessResponse,
} from '../types/models';

// Categories API
export const categoriesApi = {
  // List all categories (public)
  list: async () => {
    const response = await apiClient.get<SuccessResponse<Category[]>>('/categories');
    return response.data.data;
  },

  // Get category by slug (public)
  getBySlug: async (slug: string) => {
    const response = await apiClient.get<SuccessResponse<Category>>(`/categories/${slug}`);
    return response.data.data;
  },

  // Create category (admin)
  create: async (data: CreateCategoryRequest) => {
    const response = await apiClient.post<SuccessResponse<Category>>('/admin/categories', data);
    return response.data.data;
  },

  // Update category (admin)
  update: async (id: number, data: UpdateCategoryRequest) => {
    const response = await apiClient.put<SuccessResponse<Category>>(
      `/admin/categories/${id}`,
      data
    );
    return response.data.data;
  },

  // Delete category (admin)
  delete: async (id: number) => {
    await apiClient.delete(`/admin/categories/${id}`);
  },
};

// Tags API
export const tagsApi = {
  // List all tags (public)
  list: async () => {
    const response = await apiClient.get<SuccessResponse<Tag[]>>('/tags');
    return response.data.data;
  },

  // Get tag by slug (public)
  getBySlug: async (slug: string) => {
    const response = await apiClient.get<SuccessResponse<Tag>>(`/tags/${slug}`);
    return response.data.data;
  },

  // Create tag (admin)
  create: async (data: CreateTagRequest) => {
    const response = await apiClient.post<SuccessResponse<Tag>>('/admin/tags', data);
    return response.data.data;
  },

  // Delete tag (admin)
  delete: async (id: number) => {
    await apiClient.delete(`/admin/tags/${id}`);
  },
};
