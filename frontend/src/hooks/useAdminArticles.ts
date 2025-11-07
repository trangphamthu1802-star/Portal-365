import { useState, useEffect } from 'react';
import { apiClient } from '../lib/apiClient';
import type { Article, ArticlesResponse, Tag, Category } from './usePublicArticles';

export interface UseAdminArticlesOptions {
  category_id?: number;
  category_slug?: string;
  author_id?: number;
  status?: string;
  tag?: string;
  tag_slugs?: string[];
  q?: string;
  page?: number;
  page_size?: number;
  sort?: string;
  enabled?: boolean;
}

export function useAdminArticles(options: UseAdminArticlesOptions = {}) {
  const {
    category_id,
    category_slug,
    author_id,
    status,
    tag,
    tag_slugs,
    q,
    page = 1,
    page_size = 20,
    sort = '-created_at',
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
          page_size: page_size.toString(),
          sort,
        };

        if (category_id) {
          params.category_id = category_id.toString();
        }

        if (category_slug) {
          params.category_slug = category_slug;
        }

        if (author_id) {
          params.author_id = author_id.toString();
        }

        if (status) {
          params.status = status;
        }

        if (tag) {
          params.tag = tag;
        }

        if (tag_slugs && tag_slugs.length > 0) {
          params.tag_slugs = tag_slugs.join(',');
        }

        if (q) {
          params.q = q;
        }

        const response = await apiClient.get<ArticlesResponse>('/admin/articles', { params });

        setData(response.data.data);
        setPagination(response.data.pagination);
      } catch (err: any) {
        console.error('Failed to fetch admin articles:', err);
        setError(err.response?.data?.error?.message || 'Failed to load articles');
        setData([]);
        setPagination(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [
    category_id,
    category_slug,
    author_id,
    status,
    tag,
    tag_slugs?.join(','),
    q,
    page,
    page_size,
    sort,
    enabled,
  ]);

  return {
    articles: data,
    pagination,
    isLoading,
    error,
  };
}

// Hook for fetching categories
export function useCategories(includeInactive = false) {
  const [data, setData] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiClient.get<{ data: Category[] }>('/categories');
        let categories = response.data.data;

        if (!includeInactive) {
          categories = categories.filter((c) => c.is_active);
        }

        setData(categories);
      } catch (err: any) {
        console.error('Failed to fetch categories:', err);
        setError(err.response?.data?.error?.message || 'Failed to load categories');
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [includeInactive]);

  return {
    categories: data,
    isLoading,
    error,
  };
}

// Hook for fetching tags
export function useTags() {
  const [data, setData] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiClient.get<{ data: Tag[] }>('/tags');
        setData(response.data.data);
      } catch (err: any) {
        console.error('Failed to fetch tags:', err);
        setError(err.response?.data?.error?.message || 'Failed to load tags');
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTags();
  }, []);

  return {
    tags: data,
    isLoading,
    error,
  };
}
