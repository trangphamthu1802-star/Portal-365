import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { apiClient } from '../lib/apiClient';

interface Article {
  id: number;
  title: string;
  slug: string;
  summary: string;
  featured_image: string;
  category_name: string;
  published_at: string;
  view_count: number;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  parent_id?: number;
  parent_slug?: string;
}

interface ArticlesResponse {
  data: Article[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
}

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;

      setLoading(true);
      setError(null);

      try {
        // Fetch category info
        const categoryResp = await apiClient.get<{ data: Category }>(`/categories/${slug}`);
        setCategory(categoryResp.data.data);

        // Fetch articles for this category
        const articlesResp = await apiClient.get<ArticlesResponse>('/articles', {
          params: {
            category_slug: slug,
            page,
            page_size: 12,
            sort: '-published_at',
          },
        });

        setArticles(articlesResp.data.data || []);
        setTotalPages(articlesResp.data.pagination?.total_pages || 1);
      } catch (err: any) {
        console.error('Failed to fetch category data:', err);
        setError('Không thể tải dữ liệu chuyên mục');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, page]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getImageUrl = (url?: string) => {
    if (!url) return 'https://via.placeholder.com/400x300?text=No+Image';
    if (url.startsWith('http')) return url;
    return `http://localhost:8080${url}`;
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </MainLayout>
    );
  }

  if (error || !category) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Lỗi</h1>
          <p className="text-gray-600">{error || 'Không tìm thấy chuyên mục'}</p>
          <Link to="/" className="mt-6 inline-block text-red-600 hover:text-red-700">
            ← Về trang chủ
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Category Header */}
      <div className="bg-gradient-to-r from-red-700 to-red-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm mb-3">
            <Link to="/" className="hover:underline">Trang chủ</Link>
            <span>/</span>
            {category.parent_slug && (
              <>
                <Link to={`/c/${category.parent_slug}`} className="hover:underline capitalize">
                  {category.parent_slug.replace(/-/g, ' ')}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-red-200">{category.name}</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">{category.name}</h1>
          {category.description && (
            <p className="text-red-100 text-lg">{category.description}</p>
          )}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Chưa có bài viết nào trong chuyên mục này</p>
          </div>
        ) : (
          <>
            {/* Featured Article - First one larger */}
            {articles.length > 0 && (
              <div className="mb-8 pb-8 border-b border-gray-200">
                <Link
                  to={`/a/${articles[0].slug}`}
                  className="grid md:grid-cols-2 gap-6 group"
                >
                  <div className="relative overflow-hidden rounded-lg aspect-[16/10]">
                    <img
                      src={getImageUrl(articles[0].featured_image)}
                      alt={articles[0].title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-red-600 transition-colors line-clamp-3">
                      {articles[0].title}
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                      {articles[0].summary}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatDate(articles[0].published_at)}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {articles[0].view_count || 0}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Rest of articles in grid */}
            {articles.length > 1 && (
              <div className="grid md:grid-cols-3 gap-6">
                {articles.slice(1).map((article) => (
                  <Link
                    key={article.id}
                    to={`/a/${article.slug}`}
                    className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                  >
                    <div className="relative overflow-hidden aspect-[16/10]">
                      <img
                        src={getImageUrl(article.featured_image)}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                        {article.summary}
                      </p>
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <span className="flex items-center">
                          <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {formatDate(article.published_at)}
                        </span>
                        <span className="flex items-center">
                          <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          {article.view_count || 0}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center space-x-2 mt-12">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  ← Trước
                </button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-4 py-2 rounded-md ${
                          page === pageNum
                            ? 'bg-red-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Sau →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}
