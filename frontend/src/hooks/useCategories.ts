import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { api } from '@/api/client';
import type {
  DtoCreateCategoryRequest,
  DtoUpdateCategoryRequest,
} from '@/api/data-contracts';

// Query keys
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (params?: any) => [...categoryKeys.lists(), params] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (slug: string) => [...categoryKeys.details(), slug] as const,
  menu: () => [...categoryKeys.all, 'menu'] as const,
};

// Hooks
export const useCategories = (params?: { page?: number; page_size?: number }, options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: async () => {
      const response = await api.v1CategoriesList(params as any);
      return (response.data as any)?.data || response.data;
    },
    staleTime: 60000, // 60s
    refetchOnWindowFocus: false,
    retry: 1,
    ...options,
  });
};

export const useCategoryBySlug = (slug: string, options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: categoryKeys.detail(slug),
    queryFn: async () => {
      const response = await api.v1CategoriesDetail({ slug });
      return (response.data as any)?.data || response.data;
    },
    enabled: !!slug,
    staleTime: 60000,
    refetchOnWindowFocus: false,
    retry: 1,
    ...options,
  });
};

export const useCategoryMenu = (options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: categoryKeys.menu(),
    queryFn: async () => {
      const response = await api.v1CategoriesMenuList();
      return (response.data as any)?.data || response.data;
    },
    staleTime: 300000, // 5 min for menu
    refetchOnWindowFocus: false,
    retry: 1,
    ...options,
  });
};

// Admin mutations
export const useCreateCategory = (options?: UseMutationOptions<any, any, DtoCreateCategoryRequest>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: DtoCreateCategoryRequest) => {
      const response = await api.v1AdminCategoriesCreate(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
    ...options,
  });
};

export const useUpdateCategory = (options?: UseMutationOptions<any, any, { id: number; data: DtoUpdateCategoryRequest }>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: DtoUpdateCategoryRequest }) => {
      const response = await api.v1AdminCategoriesUpdate({ id }, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
    ...options,
  });
};

export const useDeleteCategory = (options?: UseMutationOptions<any, any, number>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.v1AdminCategoriesDelete({ id });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
    ...options,
  });
};
