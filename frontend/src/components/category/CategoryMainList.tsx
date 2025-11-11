import { useCategoryArticles } from '../../hooks/useCategoryArticles';
import { usePublicArticles } from '../../hooks/usePublicArticles';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Eye, ChevronRight, TrendingUp } from 'lucide-react';
import { getArticleImage } from '../../lib/images';

interface CategoryMainListProps {
  slug: string;
  categoryName: string;
  description?: string;
}

export default function CategoryMainList({ slug, categoryName, description }: CategoryMainListProps) {
  console.log('🚀 CategoryMainList RENDERED! Slug:', slug, 'Name:', categoryName);
  
  const [page, setPage] = useState(1);
  const [mostViewedPage, setMostViewedPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('-published_at');

  const { data, isLoading, error, refetch } = useCategoryArticles(slug, {
    page,
    page_size: 10,
    sort,
    q: search || undefined,
  });

  // Fetch most viewed articles for bottom section - with pagination
  const { articles: allMostViewedArticles, isLoading: mostViewedLoading, error: mostViewedError } = usePublicArticles({
    limit: 50, // Fetch more to support pagination
    sort: '-view_count', // Sort by view count descending
  });

  console.log('🔥 Most Viewed Debug:');
  console.log('- allMostViewedArticles:', allMostViewedArticles);
  console.log('- count:', allMostViewedArticles.length);
  console.log('- loading:', mostViewedLoading);
  console.log('- error:', mostViewedError);

  // Paginate most viewed articles (5 per page)
  const mostViewedPerPage = 5;
  const mostViewedArticles = allMostViewedArticles.slice(
    (mostViewedPage - 1) * mostViewedPerPage,
    mostViewedPage * mostViewedPerPage
  );
  const totalMostViewedPages = Math.ceil(allMostViewedArticles.length / mostViewedPerPage);

  console.log('- mostViewedArticles (paginated):', mostViewedArticles.length);
  console.log('- totalMostViewedPages:', totalMostViewedPages);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Skeleton loader */}
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
            <div className="aspect-video bg-gray-200"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-800 mb-4">Không thể tải danh sách bài viết</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  const articles = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{categoryName}</h1>
        {description && (
          <p className="text-gray-600">{description}</p>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex-1">
          <input
            type="search"
            placeholder="Tìm kiếm bài viết..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="-published_at">Mới nhất</option>
          <option value="-view_count">Xem nhiều nhất</option>
          <option value="title">Tiêu đề A-Z</option>
        </select>
      </div>

      {/* Articles list - Vertical layout */}
      {articles.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <p className="text-gray-600 text-lg">Chưa có bài viết nào trong chuyên mục này</p>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-8">
            {articles.map((article) => (
              <Link
                key={article.id}
                to={`/a/${article.slug}`}
                className="group flex gap-4 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 p-4"
              >
                {/* Avatar/Image - Left side */}
                <div className="flex-shrink-0 w-48 h-32 overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-gray-50">
                  <img
                    src={getArticleImage(article)}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-article.jpg';
                    }}
                  />
                </div>

                {/* Content - Right side */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {article.title}
                    </h3>
                    
                    {article.summary && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {article.summary}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(article.published_at || article.created_at)}</span>
                    </div>
                    {article.view_count > 0 && (
                      <div className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{article.view_count.toLocaleString()} lượt xem</span>
                      </div>
                    )}
                    <ChevronRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform ml-auto" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.total_pages > 1 && (
            <div className="flex justify-center items-center gap-2 mb-12">
              <button
                onClick={() => {
                  setPage(p => Math.max(1, p - 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                ← Trang trước
              </button>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(7, pagination.total_pages) }, (_, i) => {
                  let pageNum;
                  if (pagination.total_pages <= 7) {
                    pageNum = i + 1;
                  } else {
                    if (page <= 4) {
                      pageNum = i + 1;
                    } else if (page >= pagination.total_pages - 3) {
                      pageNum = pagination.total_pages - 6 + i;
                    } else {
                      pageNum = page - 3 + i;
                    }
                  }
                  
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        setPage(pageNum);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                        page === pageNum
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => {
                  setPage(p => Math.min(pagination.total_pages, p + 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={page === pagination.total_pages}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Trang sau →
              </button>
            </div>
          )}
        </>
      )}

      {/* Most Viewed Articles Section at Bottom - Horizontal layout */}
      <div className="mt-16 pt-12 border-t-2 border-gray-100">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              Bài viết đọc nhiều nhất
            </h2>
            {totalMostViewedPages > 0 && (
              <div className="text-sm text-gray-500">
                Trang {mostViewedPage} / {totalMostViewedPages}
              </div>
            )}
          </div>
          <p className="text-gray-500 mt-1">Những bài viết được quan tâm nhiều nhất</p>
        </div>

        {mostViewedLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 animate-pulse">
                <div className="aspect-video bg-gray-200"></div>
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : mostViewedError ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800">Không thể tải danh sách bài viết đọc nhiều nhất</p>
            <p className="text-sm text-red-600 mt-2">{mostViewedError}</p>
          </div>
        ) : mostViewedArticles.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
            <p className="text-gray-600">Chưa có bài viết nào</p>
          </div>
        ) : (
          <>
            {/* Horizontal scroll grid - 5 items */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-6">
              {mostViewedArticles.map((article) => (
                <Link
                  key={article.id}
                  to={`/a/${article.slug}`}
                  className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  <div className="aspect-video overflow-hidden bg-gradient-to-br from-red-50 to-red-100">
                    <img
                      src={getArticleImage(article)}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-article.jpg';
                      }}
                    />
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-bold text-sm text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                      {article.title}
                    </h3>
                    
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{article.view_count?.toLocaleString() || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(article.published_at || article.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Most Viewed Articles Pagination */}
            {totalMostViewedPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => setMostViewedPage(p => Math.max(1, p - 1))}
                  disabled={mostViewedPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
                >
                  ← Trước
                </button>
                
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalMostViewedPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setMostViewedPage(i + 1)}
                      className={`px-3 py-1.5 rounded-lg transition-colors text-sm font-medium ${
                        mostViewedPage === i + 1
                          ? 'bg-red-600 text-white shadow-md'
                          : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setMostViewedPage(p => Math.min(totalMostViewedPages, p + 1))}
                  disabled={mostViewedPage === totalMostViewedPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
                >
                  Sau →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
