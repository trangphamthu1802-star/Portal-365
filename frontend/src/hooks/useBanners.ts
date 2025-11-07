import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';

export interface Banner {
  id: number;
  placement: string;
  image_url: string;
  link_url?: string;
  alt?: string;
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
