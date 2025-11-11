import { useState, useEffect } from 'react';
import { apiClient } from '../lib/apiClient';

export interface MediaItem {
  id: number;
  title: string;
  slug: string;
  file_path: string;
  thumbnail_url?: string;
  media_type: 'image' | 'video' | 'document';
  file_size: number;
  mime_type: string;
  description?: string;
  category_id?: number;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface MediaResponse {
  data: MediaItem[];
  pagination?: {
    page: number;
    page_size: number;
    total: number;
  };
}

interface UsePublicMediaOptions {
  media_type?: 'image' | 'video' | 'document';
  category_id?: number;
  page?: number;
  page_size?: number;
}

export function usePublicMedia(options: UsePublicMediaOptions = {}) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        
        if (options.media_type) params.append('media_type', options.media_type);
        if (options.category_id) params.append('category_id', options.category_id.toString());
        if (options.page) params.append('page', options.page.toString());
        if (options.page_size) params.append('page_size', options.page_size.toString());

        const response = await apiClient.get(`/media?${params.toString()}`);
        // Handle both wrapped and unwrapped responses
        const mediaData: MediaItem[] = Array.isArray(response) 
          ? response 
          : (response.data && Array.isArray(response.data.data)) 
            ? response.data.data 
            : (Array.isArray(response.data) ? response.data : []);
        setMedia(mediaData);
        setError(null);
      } catch (err) {
        setError(err as Error);
        setMedia([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [options.media_type, options.category_id, options.page, options.page_size]);

  return { media, loading, error };
}
