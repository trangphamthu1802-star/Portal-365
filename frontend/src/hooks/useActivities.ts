import { useQueries } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';

// Activities sections matching Navigation
export const ACTIVITIES_SLUGS = [
  'hoat-dong-cua-thu-truong',
  'hoat-dong-cua-su-doan',
  'hoat-dong-cua-cac-don-vi'
] as const;

export const ACTIVITIES_NAMES: Record<string, string> = {
  'hoat-dong-cua-su-doan': 'Hoạt động của Sư đoàn',
  'hoat-dong-cua-cac-don-vi': 'Hoạt động của các đơn vị',
  'hoat-dong-cua-thu-truong': 'Hoạt động của Thủ trưởng'
};

export interface Article {
  id: number;
  title: string;
  slug: string;
  summary?: string;
  excerpt?: string;
  thumbnail_url?: string;
  cover_url?: string;
  category?: { id?: number; name: string; slug?: string };
  published_at: string;
  view_count?: number;
  author?: { name: string };
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface ActivitiesSection {
  category: Category;
  articles: Article[];
  isLoading: boolean;
  isError: boolean;
}

// Dummy data fallback for each activities section
const getDummyActivitiesData = (slug: string): Article[] => {
  const categoryName = ACTIVITIES_NAMES[slug];
  
  // Import dummy articles if needed
  const baseArticles: Article[] = [
    {
      id: 301,
      title: 'Sư đoàn 365 tổ chức Hội nghị tổng kết công tác năm 2024',
      slug: 'hoi-nghi-tong-ket-2024',
      summary: 'Hội nghị đánh giá toàn diện kết quả thực hiện nhiệm vụ quân sự, chính trị và công tác xây dựng Đảng năm 2024.',
      thumbnail_url: '/placeholder-news.jpg',
      category: { name: categoryName },
      published_at: '2025-01-10T09:00:00Z',
      view_count: 8234
    },
    {
      id: 302,
      title: 'Diễn tập khu vực phòng thủ cấp Sư đoàn thành công tốt đẹp',
      slug: 'dien-tap-phong-thu-su-doan',
      summary: 'Diễn tập quy mô lớn với sự tham gia của nhiều lực lượng, nâng cao khả năng sẵn sàng chiến đấu.',
      thumbnail_url: '/placeholder-news.jpg',
      category: { name: categoryName },
      published_at: '2025-01-09T14:30:00Z',
      view_count: 6543
    },
    {
      id: 303,
      title: 'Tọa đàm kỷ niệm 80 năm ngày thành lập Quân đội nhân dân Việt Nam',
      slug: 'toa-dam-ky-niem-80-nam',
      summary: 'Chương trình nhìn lại truyền thống v光荣 của Quân đội, khẳng định quyết tâm xây dựng lực lượng vững mạnh.',
      thumbnail_url: '/placeholder-news.jpg',
      category: { name: categoryName },
      published_at: '2025-01-08T10:00:00Z',
      view_count: 5432
    },
    {
      id: 304,
      title: 'Phát động phong trào thi đua "Luyện tập giỏi, chiến đấu thắng"',
      slug: 'phong-trao-thi-dua-2025',
      summary: 'Phong trào tập trung nâng cao chất lượng huấn luyện và kỷ luật, kỷ cương trong toàn Sư đoàn.',
      thumbnail_url: '/placeholder-news.jpg',
      category: { name: categoryName },
      published_at: '2025-01-07T08:00:00Z',
      view_count: 4321
    },
    {
      id: 305,
      title: 'Khen thưởng tập thể và cá nhân có thành tích xuất sắc năm 2024',
      slug: 'khen-thuong-xuat-sac-2024',
      summary: 'Lễ khen thưởng ghi nhận những đóng góp xuất sắc của các đơn vị và cá nhân trong năm qua.',
      thumbnail_url: '/placeholder-news.jpg',
      category: { name: categoryName },
      published_at: '2025-01-06T15:00:00Z',
      view_count: 3876
    },
    {
      id: 306,
      title: 'Hội thao quân sự Sư đoàn 365 năm 2025 sôi nổi, hấp dẫn',
      slug: 'hoi-thao-quan-su-2025',
      summary: 'Hội thao thu hút hơn 300 vận động viên tham gia tranh tài các môn bắn súng, chạy địa hình, vượt vật cản.',
      thumbnail_url: '/placeholder-news.jpg',
      category: { name: categoryName },
      published_at: '2025-01-05T11:00:00Z',
      view_count: 5234
    }
  ];

  return baseArticles;
};

/**
 * Concurrent fetching for all activities sections
 * Optimized with React Query: staleTime 60s, cacheTime 5min
 */
export const useActivities = () => {
  const results = useQueries({
    queries: ACTIVITIES_SLUGS.map((slug) => ({
      queryKey: ['activities', slug],
      queryFn: async (): Promise<{ category: Category; articles: Article[] }> => {
        try {
          // Try aggregate endpoint first (preferred)
          const homeResponse = await apiClient.get(`/home?sections=${slug}`);
          if (homeResponse.data?.data?.by_category?.[0]) {
            return homeResponse.data.data.by_category[0];
          }
        } catch (error) {
          console.log(`Aggregate endpoint not available for ${slug}, falling back...`);
        }

        try {
          // Fallback: Get category by slug, then fetch articles
          const categoriesResponse = await apiClient.get('/categories');
          const category = categoriesResponse.data?.data?.find(
            (cat: Category) => cat.slug === slug
          );

          if (!category) {
            throw new Error(`Category not found: ${slug}`);
          }

          const articlesResponse = await apiClient.get('/articles', {
            params: {
              category_id: category.id,
              page_size: 6,
              sort: '-published_at'
            }
          });

          return {
            category,
            articles: articlesResponse.data?.data || []
          };
        } catch (error) {
          console.warn(`Failed to fetch ${slug} from API, using dummy data`, error);
          
          // Dummy data fallback
          return {
            category: {
              id: ACTIVITIES_SLUGS.indexOf(slug) + 100,
              name: ACTIVITIES_NAMES[slug],
              slug
            },
            articles: getDummyActivitiesData(slug)
          };
        }
      },
      staleTime: 60 * 1000, // 60s
      gcTime: 5 * 60 * 1000, // 5min (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false
    }))
  });

  return results.map((result, index) => ({
    category: result.data?.category || {
      id: index + 100,
      name: ACTIVITIES_NAMES[ACTIVITIES_SLUGS[index]],
      slug: ACTIVITIES_SLUGS[index]
    },
    articles: result.data?.articles || [],
    isLoading: result.isLoading,
    isError: result.isError
  })) as ActivitiesSection[];
};

/**
 * Prefetch hook for Navigation hover
 */
export const usePrefetchActivities = () => {
  // Note: Prefetching can be implemented when needed
  // For now, React Query's concurrent fetching provides good performance
  return () => {
    console.log('Prefetch activities on hover');
  };
};
