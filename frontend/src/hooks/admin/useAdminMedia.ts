import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { http } from '@/api/http';
import { AxiosError } from 'axios';

// Types
export interface MediaItem {
  id: number;
  title: string;
  slug: string;
  description?: string;
  url: string;
  file_size: number;
  mime_type: string;
  media_type: 'image' | 'video';
  thumbnail_url?: string;
  duration?: number;
  width?: number;
  height?: number;
  status: 'draft' | 'published' | 'hidden';
  category_id?: number;
  uploaded_by: number;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface MediaListResponse {
  data: MediaItem[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
}

export interface MediaListParams {
  page?: number;
  page_size?: number;
  media_type?: 'image' | 'video';
  status?: string;
  category_id?: number;
  q?: string;
}

// Query keys
export const adminMediaKeys = {
  all: ['admin', 'media'] as const,
  lists: () => [...adminMediaKeys.all, 'list'] as const,
  list: (params: MediaListParams) => [...adminMediaKeys.lists(), params] as const,
  detail: (id: number) => [...adminMediaKeys.all, 'detail', id] as const,
};

// Get admin media list
export function useAdminMediaList(
  params: MediaListParams = {},
  options?: Omit<UseQueryOptions<MediaListResponse, AxiosError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<MediaListResponse, AxiosError>({
    queryKey: adminMediaKeys.list(params),
    queryFn: async () => {
      const response = await http.get<MediaListResponse>('/admin/media', { params });
      return response.data;
    },
    staleTime: 30000,
    ...options,
  });
}

// Get media detail
export function useAdminMediaDetail(id: number) {
  return useQuery<{ data: MediaItem }, AxiosError>({
    queryKey: adminMediaKeys.detail(id),
    queryFn: async () => {
      const response = await http.get(`/admin/media/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

// Upload media
export function useUploadMedia() {
  const queryClient = useQueryClient();

  return useMutation<
    { data: MediaItem },
    AxiosError,
    { file: File; title: string; category_id: number; media_type: 'image' | 'video'; description?: string }
  >({
    mutationFn: async ({ file, title, category_id, media_type, description }) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('category_id', category_id.toString());
      formData.append('media_type', media_type);
      if (description) {
        formData.append('description', description);
      }

      const response = await http.post('/admin/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch media lists
      queryClient.invalidateQueries({ queryKey: adminMediaKeys.lists() });
    },
  });
}

// Delete media
export function useDeleteMedia() {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, number>({
    mutationFn: async (id: number) => {
      await http.delete(`/admin/media/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminMediaKeys.lists() });
    },
  });
}

// Update media
export function useUpdateMedia() {
  const queryClient = useQueryClient();

  return useMutation<
    { data: MediaItem },
    AxiosError,
    { id: number; data: Partial<Omit<MediaItem, 'id' | 'created_at' | 'updated_at'>> }
  >({
    mutationFn: async ({ id, data }) => {
      const response = await http.put(`/admin/media/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminMediaKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminMediaKeys.detail(variables.id) });
    },
  });
}
