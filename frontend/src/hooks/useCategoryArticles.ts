import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';
import type { ArticlesResponse } from './usePublicArticles';

interface UseCategoryArticlesOptions {
  page?: number;
  page_size?: number;
  sort?: string;
  q?: string;
  enabled?: boolean;
}

/**
 * Hook để lấy danh sách bài viết theo category slug (main list)
 */
export function useCategoryArticles(
  slug: string,
  options: UseCategoryArticlesOptions = {}
) {
  const {
    page = 1,
    page_size = 12,
    sort = '-published_at',
    q,
    enabled = true,
  } = options;

  return useQuery({
    queryKey: ['articles', 'list', { slug, page, page_size, sort, q }],
    queryFn: async () => {
      const response = await apiClient.get<ArticlesResponse>('/articles', {
        params: {
          category_slug: slug,
          page,
          page_size,
          sort,
          q: q || undefined,
        },
      });
      return response.data;
    },
    enabled: enabled && !!slug,
    staleTime: 30 * 1000, // 30 giây - cập nhật nhanh
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook để lấy rails (danh sách ngắn) cho nhiều categories
 */
export function useCategoryRails(slugs: string[], limit = 5) {
  return useQuery({
    queryKey: ['category', 'rails', { slugs: slugs.sort().join(','), limit }],
    queryFn: async () => {
      // Gọi song song cho tất cả slugs
      const promises = slugs.map(async (slug) => {
        try {
          const response = await apiClient.get<ArticlesResponse>('/articles', {
            params: {
              category_slug: slug,
              page: 1,
              page_size: limit,
              sort: '-published_at',
            },
          });
          return {
            slug,
            articles: response.data.data,
          };
        } catch (error) {
          console.error(`Failed to load rail for ${slug}:`, error);
          return {
            slug,
            articles: [],
            error: true,
          };
        }
      });

      const results = await Promise.all(promises);
      return results;
    },
    enabled: slugs.length > 0,
    staleTime: 60 * 1000, // 60 giây - cache lâu hơn
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook để lấy single rail cho một category (fallback)
 */
export function useCategoryRail(slug: string, limit = 5) {
  return useQuery({
    queryKey: ['articles', 'list', { slug, page: 1, page_size: limit, rail: true }],
    queryFn: async () => {
      const response = await apiClient.get<ArticlesResponse>('/articles', {
        params: {
          category_slug: slug,
          page: 1,
          page_size: limit,
          sort: '-published_at',
        },
      });
      return response.data.data;
    },
    enabled: !!slug,
    staleTime: 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
