import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';
import { dummyArticles } from '@/data/dummyData';

// Home page category sections configuration
export const HOME_CATEGORY_SLUGS = [
  'tin-quoc-te',
  'tin-trong-nuoc', 
  'tin-quan-su',
  'tin-don-vi'
];

export const HOME_CATEGORY_NAMES: Record<string, string> = {
  'tin-quoc-te': 'Tin quốc tế',
  'tin-trong-nuoc': 'Tin trong nước',
  'tin-quan-su': 'Tin quân sự',
  'tin-don-vi': 'Tin đơn vị'
};

export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  summary?: string;
  thumbnail_url?: string;
  cover_url?: string;
  category?: {
    id?: number;
    name: string;
    slug?: string;
  };
  tags?: Array<{ id: number; name: string; slug: string }>;
  author?: {
    id: number;
    full_name: string;
  };
  published_at: string;
  view_count: number;
}

export interface HomeData {
  hero: Article | null;
  breaking: Article[];
  featured: Article[];
  by_category: Array<{
    category: { id: number; name: string; slug: string };
    articles: Article[];
  }>;
  most_read: Article[];
}

function getDummyHomeData(): HomeData {
  const articles = dummyArticles as any[];
  
  // Create sections based on HOME_CATEGORY_SLUGS
  const by_category = HOME_CATEGORY_SLUGS.map((slug, index) => {
    const categoryName = HOME_CATEGORY_NAMES[slug] || slug;
    
    // Filter articles by category name
    const categoryArticles = articles.filter(a => {
      const catName = a.category?.name;
      if (!catName) return false;
      
      // Map category names to slugs
      if (slug === 'tin-quoc-te') return catName === 'Tin quốc tế';
      if (slug === 'tin-trong-nuoc') return catName === 'Tin trong nước';
      if (slug === 'tin-quan-su') return catName === 'Tin quân sự';
      if (slug === 'tin-don-vi') return catName === 'Tin đơn vị';
      
      return false;
    });

    return {
      category: {
        id: index + 1,
        name: categoryName,
        slug,
      },
      articles: categoryArticles.slice(0, 6),
    };
  }).filter(cat => cat.articles.length > 0); // Only include categories with articles

  return {
    hero: articles.find(a => a.thumbnail_url) || articles[0] || null,
    breaking: articles.slice(0, 10),
    featured: articles.slice(0, 6),
    by_category,
    most_read: [...articles].sort((a, b) => b.view_count - a.view_count).slice(0, 10),
  };
}

export function useHome() {
  return useQuery({
    queryKey: ['home'],
    queryFn: async () => {
      try {
        // Try aggregate endpoint first
        const response = await apiClient.get<{ data: HomeData }>('/home');
        const data = response.data.data;
        
        // If API returns empty data, use dummy data
        if (!data.hero && (!data.by_category || data.by_category.length === 0)) {
          console.log('API returned empty data, using dummy data');
          return getDummyHomeData();
        }
        
        return data;
      } catch (error) {
        console.log('API not available, using dummy data');
        // Fallback to dummy data
        return getDummyHomeData();
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
