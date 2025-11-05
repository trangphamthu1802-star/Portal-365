import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, normalizeError } from '../lib/apiClient';
import type { 
  Article, 
  Category,
  Tag,
  CreateArticleRequest, 
  UpdateArticleRequest,
  SuccessResponse 
} from '../types/api';

// Query Keys
export const articleKeys = {
  all: ['articles'] as const,
  lists: () => [...articleKeys.all, 'list'] as const,
  list: (filters: string) => [...articleKeys.lists(), { filters }] as const,
  details: () => [...articleKeys.all, 'detail'] as const,
  detail: (id: number) => [...articleKeys.details(), id] as const,
};

export const categoryKeys = {
  all: ['categories'] as const,
};

export const tagKeys = {
  all: ['tags'] as const,
};

// Fetch Articles
export function useArticles(params?: { 
  page?: number; 
  page_size?: number; 
  q?: string; 
  category_id?: number;
  status?: string;
  author_id?: number;
}) {
  return useQuery({
    queryKey: articleKeys.list(JSON.stringify(params || {})),
    queryFn: async () => {
      const response = await apiClient.get<SuccessResponse<Article[]>>('/admin/articles', { params });
      return response.data;
    },
  });
}

// Fetch Single Article
export function useArticle(id: number) {
  return useQuery({
    queryKey: articleKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get<SuccessResponse<Article>>(`/admin/articles/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
}

// Fetch Categories
export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: async () => {
      const response = await apiClient.get<SuccessResponse<Category[]>>('/categories');
      return response.data.data;
    },
  });
}

// Fetch Tags
export function useTags() {
  return useQuery({
    queryKey: tagKeys.all,
    queryFn: async () => {
      const response = await apiClient.get<SuccessResponse<Tag[]>>('/tags');
      return response.data.data;
    },
  });
}

// Article Mutations
export function useArticleMutations() {
  const queryClient = useQueryClient();

  const createArticle = useMutation({
    mutationFn: async (data: CreateArticleRequest) => {
      const response = await apiClient.post<SuccessResponse<Article>>('/admin/articles', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: articleKeys.lists() });
    },
    onError: (error) => {
      throw normalizeError(error);
    },
  });

  const updateArticle = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateArticleRequest }) => {
      const response = await apiClient.put<SuccessResponse<Article>>(`/admin/articles/${id}`, data);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: articleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: articleKeys.detail(variables.id) });
    },
    onError: (error) => {
      throw normalizeError(error);
    },
  });

  const deleteArticle = useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/admin/articles/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: articleKeys.lists() });
    },
    onError: (error) => {
      throw normalizeError(error);
    },
  });

  const publishArticle = useMutation({
    mutationFn: async (id: number) => {
      await apiClient.post(`/admin/articles/${id}/publish`);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: articleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: articleKeys.detail(id) });
    },
    onError: (error) => {
      throw normalizeError(error);
    },
  });

  const unpublishArticle = useMutation({
    mutationFn: async (id: number) => {
      await apiClient.post(`/admin/articles/${id}/unpublish`);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: articleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: articleKeys.detail(id) });
    },
    onError: (error) => {
      throw normalizeError(error);
    },
  });

  const submitForReview = useMutation({
    mutationFn: async (id: number) => {
      await apiClient.post(`/admin/articles/${id}/submit`);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: articleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: articleKeys.detail(id) });
    },
    onError: (error) => {
      throw normalizeError(error);
    },
  });

  return {
    createArticle,
    updateArticle,
    deleteArticle,
    publishArticle,
    unpublishArticle,
    submitForReview,
  };
}
