import { useState, useEffect } from 'react';
import { apiClient } from '../lib/apiClient';

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent_id?: number;
  parent_slug?: string;
  sort_order: number;
  is_active: boolean;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  featured_image: string;
  thumbnail_url?: string;
  author_id: number;
  author_name?: string;
  category_id: number;
  category_name?: string;
  category?: Category;
  status: string;
  view_count: number;
  is_featured: boolean;
  tags?: Tag[];
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface ArticlesResponse {
  data: Article[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
}

export interface UsePublicArticlesOptions {
  category_slug?: string;
  tag_slugs?: string[];
  is_featured?: boolean;
  limit?: number;
  page?: number;
  sort?: string;
  q?: string;
  enabled?: boolean;
}

export function usePublicArticles(options: UsePublicArticlesOptions = {}) {
  const {
    category_slug,
    tag_slugs,
    is_featured,
    limit = 20,
    page = 1,
    sort = '-published_at',
    q,
    enabled = true,
  } = options;

  const [data, setData] = useState<Article[]>([]);
  const [pagination, setPagination] = useState<ArticlesResponse['pagination'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const fetchArticles = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const params: Record<string, string> = {
          page: page.toString(),
          page_size: limit.toString(),
          sort,
        };

        if (category_slug) {
          params.category_slug = category_slug;
        }

        if (tag_slugs && tag_slugs.length > 0) {
          params.tag_slugs = tag_slugs.join(',');
        }

        if (is_featured !== undefined) {
          params.is_featured = is_featured.toString();
        }

        if (q) {
          params.q = q;
        }

        const response = await apiClient.get<ArticlesResponse>('/articles', { params });

        setData(response.data.data);
        setPagination(response.data.pagination);
      } catch (err: any) {
        console.error('Failed to fetch articles:', err);
        setError(err.response?.data?.error?.message || 'Failed to load articles');
        setData([]);
        setPagination(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [category_slug, tag_slugs?.join(','), is_featured, limit, page, sort, q, enabled]);

  return {
    articles: data,
    pagination,
    isLoading,
    error,
    refetch: () => {
      // Trigger re-fetch by updating a dependency
    },
  };
}

// Hook for single article by slug
export function usePublicArticle(slug: string, enabled = true) {
  const [data, setData] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !slug) return;

    const fetchArticle = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiClient.get<{ data: Article }>(`/articles/${slug}`);
        setData(response.data.data);
      } catch (err: any) {
        console.error('Failed to fetch article:', err);
        setError(err.response?.data?.error?.message || 'Failed to load article');
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [slug, enabled]);

  return {
    article: data,
    isLoading,
    error,
  };
}
