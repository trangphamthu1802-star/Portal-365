import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';

export interface Settings {
  site_title?: string;
  logo_url?: string;
  socials?: {
    facebook?: string;
    youtube?: string;
    zalo?: string;
    tiktok?: string;
    x?: string;
  };
  contact?: {
    address?: string;
    phone?: string;
    email?: string;
  };
  footer_links?: Array<{
    title: string;
    url: string;
  }>;
  copyright?: string;
}

export function useSettings() {
  return useQuery({
    queryKey: ['settings', 'public'],
    queryFn: async () => {
      try {
        const response = await apiClient.get<{ data: Settings }>('/settings/public');
        return response.data.data;
      } catch (error) {
        // Return default settings
        return {
          site_title: 'Sư đoàn 365',
          contact: {
            address: 'Sư đoàn 365 - Quân chủng Phòng không - Không quân',
            phone: '0982983412',
            email: 'f365.qcpkkq@mail.bqp',
          },
          copyright: 'Sư đoàn 365. All rights reserved.',
        } as Settings;
      }
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  });
}
