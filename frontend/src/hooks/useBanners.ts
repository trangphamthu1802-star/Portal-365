import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';

export interface Banner {
  id: number;
  title: string;
  placement: string;
  image_url: string;
  link_url?: string;
  alt?: string;
  is_active: boolean;
  sort_order?: number;
  created_at: string;
  updated_at: string;
}

export function useBanners(placement?: string) {
  return useQuery({
    queryKey: ['banners', placement],
    queryFn: async () => {
      try {
        const url = placement ? `/banners?placement=${placement}` : '/banners';
        const response = await apiClient.get<{ data: Banner[] }>(url);
        return response.data.data || [];
      } catch (error) {
        return [];
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
}

// Admin hooks
export function useAdminBanners(params?: { placement?: string; page?: number; page_size?: number }) {
  return useQuery({
    queryKey: ['admin-banners', params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params?.placement) queryParams.append('placement', params.placement);
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.page_size) queryParams.append('page_size', params.page_size.toString());

      const url = queryParams.toString() ? `/admin/banners?${queryParams}` : '/admin/banners';
      const response = await apiClient.get<{ data: Banner[] }>(url);
      return response.data;
    },
  });
}

export function useCreateBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiClient.post<{ data: Banner }>('/admin/banners/upload', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
    },
  });
}

export function useUpdateBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FormData }) => {
      const response = await apiClient.put<{ data: Banner }>(`/admin/banners/${id}/upload`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
    },
  });
}

export function useDeleteBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/admin/banners/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
    },
  });
}
