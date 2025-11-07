import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, Calendar, Eye } from 'lucide-react';
import { apiClient } from '../lib/apiClient';
import Header from '../components/Header';
import DynamicNavbar from '../components/DynamicNavbar';
import SiteFooter from '../components/layout/SiteFooter';

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featured_image?: string;
  published_at: string;
  view_count: number;
  author?: {
    full_name: string;
  };
  category?: {
    name: string;
    slug: string;
  };
}

interface SearchResponse {
  data: Article[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
}

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 20,
    total: 0,
    total_pages: 0,
  });

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get<SearchResponse>('/search', {
          params: { q: query, page: 1, page_size: 20 },
        });
        setArticles(response.data.data || []);
        setPagination(response.data.pagination);
      } catch (error) {
        console.error('Search error:', error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <DynamicNavbar />

      {/* Search Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <SearchIcon className="w-8 h-8 text-green-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Kết quả tìm kiếm</h1>
              <p className="text-gray-600 mt-1">
                Tìm kiếm cho: <span className="font-semibold">"{query}"</span>
                {!loading && (
                  <span className="ml-2">
                    ({pagination.total} kết quả)
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20">
            <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Không tìm thấy kết quả
            </h3>
            <p className="text-gray-500">
              Không có bài viết nào phù hợp với từ khóa "{query}"
            </p>
            <p className="text-gray-500 mt-2">
              Vui lòng thử lại với từ khóa khác
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {articles.map((article) => (
              <Link
                key={article.id}
                to={`/a/${article.slug}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-200 group"
              >
                <div className="flex flex-col md:flex-row gap-4 p-4">
                  {/* Featured Image */}
                  {article.featured_image && (
                    <div className="md:w-64 flex-shrink-0">
                      <img
                        src={article.featured_image}
                        alt={article.title}
                        className="w-full h-48 md:h-40 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1">
                    {/* Category */}
                    {article.category && (
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full mb-2">
                        {article.category.name}
                      </span>
                    )}

                    {/* Title */}
                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                      {article.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {article.excerpt}
                    </p>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      {article.author && (
                        <span className="flex items-center gap-1">
                          <span className="font-medium">{article.author.full_name}</span>
                        </span>
                      )}
                      {article.published_at && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(article.published_at)}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {article.view_count.toLocaleString()} lượt xem
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination Info */}
        {!loading && articles.length > 0 && (
          <div className="mt-8 text-center text-gray-600">
            Hiển thị {articles.length} trên tổng số {pagination.total} kết quả
          </div>
        )}
      </div>

      <SiteFooter />
    </div>
  );
}

