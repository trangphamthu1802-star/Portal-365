/**
 * Centralized hooks using generated API client
 * All hooks follow React Query best practices with typed parameters
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { api } from '@/api/client';
import type {
  DtoCreateArticleRequest,
  DtoUpdateArticleRequest,
} from '@/api/data-contracts';

// ============================================================================
// ARTICLES
// ============================================================================

export const articleKeys = {
  all: ['articles'] as const,
  lists: () => [...articleKeys.all, 'list'] as const,
  list: (params?: any) => [...articleKeys.lists(), params] as const,
  details: () => [...articleKeys.all, 'detail'] as const,
  detail: (slug: string) => [...articleKeys.details(), slug] as const,
  related: (slug: string) => [...articleKeys.all, 'related', slug] as const,
  admin: {
    all: ['articles', 'admin'] as const,
    lists: () => ['articles', 'admin', 'list'] as const,
    list: (params?: any) => ['articles', 'admin', 'list', params] as const,
    detail: (id: number) => ['articles', 'admin', 'detail', id] as const,
  },
};

// Public article hooks
export const useArticles = (params?: any, options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: articleKeys.list(params),
    queryFn: async () => {
      const response = await api.v1ArticlesList(params || {});
      return (response.data as any)?.data ? response.data : { data: response.data };
    },
    staleTime: 30000,
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useArticleBySlug = (slug: string, options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: articleKeys.detail(slug),
    queryFn: async () => {
      const response = await api.v1ArticlesDetail({ slug });
      return (response.data as any)?.data || response.data;
    },
    enabled: !!slug,
    staleTime: 60000,
    ...options,
  });
};

export const useRelatedArticles = (slug: string, limit: number = 5) => {
  return useQuery({
    queryKey: articleKeys.related(slug),
    queryFn: async () => {
      const response = await api.v1ArticlesRelatedList({ slug, limit });
      return (response.data as any)?.data || response.data;
    },
    enabled: !!slug,
    staleTime: 60000,
  });
};

// Admin article hooks
export const useAdminArticles = (params?: any) => {
  return useQuery({
    queryKey: articleKeys.admin.list(params),
    queryFn: async () => {
      const response = await api.v1AdminArticlesList(params || {});
      return (response.data as any)?.data ? response.data : { data: response.data };
    },
    staleTime: 30000,
  });
};

export const useAdminArticleById = (id: number) => {
  return useQuery({
    queryKey: articleKeys.admin.detail(id),
    queryFn: async () => {
      const response = await api.v1AdminArticlesDetail({ id });
      return (response.data as any)?.data || response.data;
    },
    enabled: !!id && id > 0,
  });
};

// Article mutations
export const useCreateArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: DtoCreateArticleRequest) => {
      const response = await api.v1AdminArticlesCreate(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: articleKeys.admin.lists() });
    },
  });
};

export const useUpdateArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: DtoUpdateArticleRequest }) => {
      const response = await api.v1AdminArticlesUpdate({ id }, data);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: articleKeys.admin.detail(id) });
      queryClient.invalidateQueries({ queryKey: articleKeys.admin.lists() });
    },
  });
};

export const usePublishArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.v1AdminArticlesPublishCreate({ id });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: articleKeys.admin.lists() });
      queryClient.invalidateQueries({ queryKey: articleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['home'] });
    },
  });
};

export const useUnpublishArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.v1AdminArticlesUnpublishCreate({ id });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: articleKeys.admin.lists() });
      queryClient.invalidateQueries({ queryKey: articleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['home'] });
    },
  });
};

export const useSubmitArticleForReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.v1AdminArticlesSubmitCreate({ id });
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: articleKeys.admin.detail(id) });
      queryClient.invalidateQueries({ queryKey: articleKeys.admin.lists() });
    },
  });
};

export const useApproveArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.v1AdminArticlesApproveCreate({ id });
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: articleKeys.admin.detail(id) });
      queryClient.invalidateQueries({ queryKey: articleKeys.admin.lists() });
    },
  });
};

export const useRejectArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.v1AdminArticlesRejectCreate({ id });
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: articleKeys.admin.detail(id) });
      queryClient.invalidateQueries({ queryKey: articleKeys.admin.lists() });
    },
  });
};

export const useDeleteArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.v1AdminArticlesDelete({ id });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: articleKeys.admin.lists() });
      queryClient.invalidateQueries({ queryKey: articleKeys.lists() });
    },
  });
};

// ============================================================================
// HOME
// ============================================================================

export const homeKeys = {
  all: ['home'] as const,
  sections: (slugs?: string[]) => [...homeKeys.all, 'sections', slugs] as const,
};

export const useHomeData = (params?: { 
  featured_limit?: number;
  latest_limit?: number;
  per_category_limit?: number;
}) => {
  return useQuery({
    queryKey: homeKeys.sections(params ? Object.values(params).map(String) : []),
    queryFn: async () => {
      // TODO: Implement when backend has home API
      return { featured: [], latest: [], categories: {} };
    },
    staleTime: 30000,
  });
};

// ============================================================================
// BANNERS
// ============================================================================

export const bannerKeys = {
  all: ['banners'] as const,
  lists: () => [...bannerKeys.all, 'list'] as const,
  list: (params?: any) => [...bannerKeys.lists(), params] as const,
  byPlacement: (placement: string) => [...bannerKeys.all, 'placement', placement] as const,
};

export const useBanners = (params?: { placement?: string; active?: boolean; q?: string; page?: number; page_size?: number }) => {
  return useQuery({
    queryKey: bannerKeys.list(params),
    queryFn: async () => {
      // TODO: Implement when backend has banners API
      return { data: [], pagination: { page: 1, page_size: 10, total: 0, total_pages: 1 } };
    },
    staleTime: 60000,
  });
};

export const useBannersByPlacement = (placement: string) => {
  return useQuery({
    queryKey: bannerKeys.byPlacement(placement),
    queryFn: async () => {
      // TODO: Implement when backend has banners API
      return { data: [] };
    },
    enabled: !!placement,
    staleTime: 300000, // 5 min for public banners
  });
};

export const useCreateBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_data: any) => {
      // TODO: Implement when backend has banners API
      throw new Error('Banners API not implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bannerKeys.all });
    },
  });
};

export const useUpdateBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      // TODO: Implement when backend has banners API
      throw new Error('Banners API not implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bannerKeys.all });
    },
  });
};

export const useDeleteBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_id: number) => {
      // TODO: Implement when backend has banners API
      throw new Error('Banners API not implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bannerKeys.all });
    },
  });
};

// ============================================================================
// MEDIA
// ============================================================================

export const mediaKeys = {
  all: ['media'] as const,
  lists: () => [...mediaKeys.all, 'list'] as const,
  list: (params?: any) => [...mediaKeys.lists(), params] as const,
  detail: (slug: string) => [...mediaKeys.all, 'detail', slug] as const,
  admin: {
    all: ['media', 'admin'] as const,
    lists: () => ['media', 'admin', 'list'] as const,
    list: (params?: any) => ['media', 'admin', 'list', params] as const,
  },
};

// Public media items (no auth)
export const usePublicMediaItems = (params?: { page?: number; page_size?: number; media_type?: string; category_id?: number }) => {
  return useQuery({
    queryKey: mediaKeys.list(params),
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
      if (params?.media_type) queryParams.append('media_type', params.media_type);
      if (params?.category_id) queryParams.append('category_id', params.category_id.toString());
      
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE || 'http://localhost:8080/api/v1'}/media-items?${queryParams}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch media items');
      }
      return response.json();
    },
    staleTime: 60000,
  });
};

// Admin media items (with auth)
export const useMediaItems = (params?: { page?: number; page_size?: number; type?: string }) => {
  return useQuery({
    queryKey: mediaKeys.admin.list(params),
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
      if (params?.type) queryParams.append('media_type', params.type); // Changed from 'type' to 'media_type'
      
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE || 'http://localhost:8080/api/v1'}/admin/media?${queryParams}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error('Failed to fetch media items');
      }
      return response.json();
    },
    staleTime: 60000,
  });
};

export const useMediaBySlug = (slug: string) => {
  return useQuery({
    queryKey: mediaKeys.detail(slug),
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE || 'http://localhost:8080/api/v1'}/media/${slug}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch media');
      }
      return response.json();
    },
    enabled: !!slug,
    staleTime: 60000,
  });
};

export const useUploadMedia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE || 'http://localhost:8080/api/v1'}/admin/media/upload`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        }
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Upload failed');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.admin.lists() });
    },
  });
};

export const useDeleteMedia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE || 'http://localhost:8080/api/v1'}/admin/media/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Delete failed');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.admin.lists() });
    },
  });
};

// ============================================================================
// DOCUMENTS
// ============================================================================

export const documentKeys = {
  all: ['documents'] as const,
  lists: () => [...documentKeys.all, 'list'] as const,
  list: (params?: any) => [...documentKeys.lists(), params] as const,
  detail: (slug: string) => [...documentKeys.all, 'detail', slug] as const,
  admin: {
    all: ['documents', 'admin'] as const,
    lists: () => ['documents', 'admin', 'list'] as const,
    list: (params?: any) => ['documents', 'admin', 'list', params] as const,
  },
};

export const useDocuments = (params?: { page?: number; page_size?: number; category_id?: number }) => {
  return useQuery({
    queryKey: documentKeys.list(params),
    queryFn: async () => {
      // Use fetch for documents endpoint
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
      if (params?.category_id) queryParams.append('category_id', params.category_id.toString());
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:8080/api/v1'}/documents?${queryParams}`);
      return response.json();
    },
    staleTime: 60000,
  });
};

export const useAdminDocuments = (params?: { page?: number; page_size?: number; status?: string; category_id?: number }) => {
  return useQuery({
    queryKey: documentKeys.admin.list(params),
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
      if (params?.status) queryParams.append('status', params.status);
      if (params?.category_id) queryParams.append('category_id', params.category_id.toString());
      
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE || 'http://localhost:8080/api/v1'}/admin/documents?${queryParams}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      return response.json();
    },
    staleTime: 30000,
  });
};

export const useUploadDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE || 'http://localhost:8080/api/v1'}/admin/documents/upload`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        }
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Upload failed');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.admin.lists() });
    },
  });
};

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE || 'http://localhost:8080/api/v1'}/admin/documents/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Delete failed');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.admin.lists() });
    },
  });
};

// ============================================================================
// PAGES
// ============================================================================

export const pageKeys = {
  all: ['pages'] as const,
  lists: () => [...pageKeys.all, 'list'] as const,
  list: (params?: any) => [...pageKeys.lists(), params] as const,
  detail: (slug: string) => [...pageKeys.all, 'detail', slug] as const,
};

export const usePages = (params?: { group?: string; status?: string }) => {
  return useQuery({
    queryKey: pageKeys.list(params),
    queryFn: async () => {
      const response = await api.v1PagesList(params || {});
      return (response.data as any)?.data ? response.data : { data: response.data };
    },
    staleTime: 300000, // 5 min
  });
};

export const usePageBySlug = (slug: string) => {
  return useQuery({
    queryKey: pageKeys.detail(slug),
    queryFn: async () => {
      const response = await api.v1PagesDetail({ slug });
      return (response.data as any)?.data || response.data;
    },
    enabled: !!slug,
    staleTime: 300000,
  });
};

export const useCreatePage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await api.v1AdminPagesCreate(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pageKeys.all });
    },
  });
};

export const useUpdatePage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await api.v1AdminPagesUpdate({ id }, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pageKeys.all });
    },
  });
};

export const useDeletePage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.v1AdminPagesDelete({ id });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pageKeys.all });
    },
  });
};

// ============================================================================
// TAGS
// ============================================================================

export const tagKeys = {
  all: ['tags'] as const,
  lists: () => [...tagKeys.all, 'list'] as const,
  detail: (slug: string) => [...tagKeys.all, 'detail', slug] as const,
};

export const useTags = () => {
  return useQuery({
    queryKey: tagKeys.lists(),
    queryFn: async () => {
      const response = await api.v1TagsList();
      return (response.data as any)?.data || response.data;
    },
    staleTime: 300000,
  });
};

export const useTagBySlug = (slug: string) => {
  return useQuery({
    queryKey: tagKeys.detail(slug),
    queryFn: async () => {
      const response = await api.v1TagsDetail({ slug });
      return (response.data as any)?.data || response.data;
    },
    enabled: !!slug,
    staleTime: 300000,
  });
};

export const useCreateTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await api.v1AdminTagsCreate(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.all });
    },
  });
};

export const useDeleteTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.v1AdminTagsDelete({ id });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.all });
    },
  });
};

// ============================================================================
// SEARCH
// ============================================================================

export const searchKeys = {
  all: ['search'] as const,
  query: (q: string, params?: any) => [...searchKeys.all, q, params] as const,
};

export const useSearch = (q: string, params?: { type?: string; page?: number; page_size?: number }) => {
  return useQuery({
    queryKey: searchKeys.query(q, params),
    queryFn: async () => {
      const response = await api.v1SearchList({ q, ...params });
      return (response.data as any)?.data ? response.data : { data: response.data };
    },
    enabled: !!q && q.length > 0,
    staleTime: 30000,
  });
};

// ============================================================================
// ACTIVITIES
// ============================================================================

export const activityKeys = {
  all: ['activities'] as const,
  lists: () => [...activityKeys.all, 'list'] as const,
  list: (params?: any) => [...activityKeys.lists(), params] as const,
  detail: (slug: string) => [...activityKeys.all, 'detail', slug] as const,
  admin: {
    all: ['activities', 'admin'] as const,
    lists: () => ['activities', 'admin', 'list'] as const,
    list: (params?: any) => ['activities', 'admin', 'list', params] as const,
  },
};

export const useActivities = (params?: { page?: number; page_size?: number }) => {
  return useQuery({
    queryKey: activityKeys.list(params),
    queryFn: async () => {
      const response = await api.v1ActivitiesList(params || {});
      return (response.data as any)?.data ? response.data : { data: response.data };
    },
    staleTime: 30000,
  });
};

export const useActivityBySlug = (slug: string) => {
  return useQuery({
    queryKey: activityKeys.detail(slug),
    queryFn: async () => {
      const response = await api.v1ActivitiesDetail({ slug });
      return (response.data as any)?.data || response.data;
    },
    enabled: !!slug,
    staleTime: 60000,
  });
};

export const useCreateActivity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await api.v1AdminActivitiesCreate(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityKeys.admin.lists() });
      queryClient.invalidateQueries({ queryKey: activityKeys.lists() });
    },
  });
};

export const usePublishActivity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.v1AdminActivitiesPublishCreate({ id });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityKeys.all });
      queryClient.invalidateQueries({ queryKey: ['home'] });
    },
  });
};
