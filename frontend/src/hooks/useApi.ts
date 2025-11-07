/**
 * Centralized hooks using generated API client
 * All hooks follow React Query best practices with typed parameters
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
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
      const response = await api.v1HomeList(params || {});
      return (response.data as any)?.data || response.data;
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
      const response = await api.adminBannersList(params || {});
      return (response.data as any)?.data ? response.data : { data: response.data };
    },
    staleTime: 60000,
  });
};

export const useBannersByPlacement = (placement: string) => {
  return useQuery({
    queryKey: bannerKeys.byPlacement(placement),
    queryFn: async () => {
      const response = await api.bannersList({ placement });
      return (response.data as any)?.data || response.data;
    },
    enabled: !!placement,
    staleTime: 300000, // 5 min for public banners
  });
};

export const useCreateBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await api.adminBannersCreate(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bannerKeys.all });
    },
  });
};

export const useUpdateBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await api.adminBannersUpdate({ id }, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bannerKeys.all });
    },
  });
};

export const useDeleteBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.adminBannersDelete({ id });
      return response.data;
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
};

export const useMediaItems = (params?: { page?: number; page_size?: number; type?: string }) => {
  return useQuery({
    queryKey: mediaKeys.list(params),
    queryFn: async () => {
      const response = await api.mediaList(params || {});
      return (response.data as any)?.data ? response.data : { data: response.data };
    },
    staleTime: 60000,
  });
};

export const useMediaBySlug = (slug: string) => {
  return useQuery({
    queryKey: mediaKeys.detail(slug),
    queryFn: async () => {
      const response = await api.mediaDetail({ slug });
      return (response.data as any)?.data || response.data;
    },
    enabled: !!slug,
    staleTime: 60000,
  });
};

export const useUploadMedia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.adminMediaUploadCreate(formData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.all });
    },
  });
};

export const useDeleteMedia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.adminMediaDelete({ id });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.all });
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

export const useDocuments = (params?: { page?: number; page_size?: number; category?: string; q?: string }) => {
  return useQuery({
    queryKey: documentKeys.list(params),
    queryFn: async () => {
      const response = await api.v1DocumentsList(params || {});
      return (response.data as any)?.data ? response.data : { data: response.data };
    },
    staleTime: 60000,
  });
};

export const useDocumentBySlug = (slug: string) => {
  return useQuery({
    queryKey: documentKeys.detail(slug),
    queryFn: async () => {
      const response = await api.v1DocumentsDetail({ slug });
      return (response.data as any)?.data || response.data;
    },
    enabled: !!slug,
    staleTime: 60000,
  });
};

export const useAdminDocuments = (params?: any) => {
  return useQuery({
    queryKey: documentKeys.admin.list(params),
    queryFn: async () => {
      const response = await api.v1AdminDocumentsList(params || {});
      return (response.data as any)?.data ? response.data : { data: response.data };
    },
    staleTime: 30000,
  });
};

export const useCreateDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await api.v1AdminDocumentsCreate(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.admin.lists() });
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
    },
  });
};

export const useUpdateDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await api.v1AdminDocumentsUpdate({ id }, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.admin.lists() });
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
    },
  });
};

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.v1AdminDocumentsDelete({ id });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.admin.lists() });
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
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
