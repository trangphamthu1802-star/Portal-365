import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ChevronRight, Newspaper, Eye, Clock } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { usePublicArticles } from '../hooks/usePublicArticles';
import { getArticleImage } from '../lib/images';

export default function ActivitiesPage() {
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const [page, setPage] = useState(1);
  const [latestPage, setLatestPage] = useState(1);

  // Category navigation items
  const categories = [
    { slug: 'hoat-dong-su-doan', name: 'Hoạt động của Sư đoàn', icon: '🎖️', color: 'red' },
    { slug: 'hoat-dong-cac-don-vi', name: 'Hoạt động của các đơn vị', icon: '🪖', color: 'green' },
    { slug: 'hoat-dong-thu-truong', name: 'Hoạt động của Thủ trưởng', icon: '👔', color: 'yellow' },
  ];

  // Fetch articles based on category selection
  // If no category selected (main /hoat-dong page), fetch from all 3 categories
  const isMainPage = !categorySlug;
  
  // Fetch from specific category - 10 per page
  const { articles: categoryArticles, pagination: categoryPagination, isLoading: categoryLoading } = usePublicArticles({
    page,
    limit: 10,
    category_slug: categorySlug,
    enabled: !!categorySlug, // Only fetch if category is specified
  });

  // Fetch ALL articles from all 3 categories for main page (no limit)
  const { articles: suDoanArticles, isLoading: suDoanLoading } = usePublicArticles({
    limit: 1000, // Large number to get all
    category_slug: 'hoat-dong-su-doan',
    enabled: isMainPage,
  });

  const { articles: donViArticles, isLoading: donViLoading } = usePublicArticles({
    limit: 1000,
    category_slug: 'hoat-dong-cac-don-vi',
    enabled: isMainPage,
  });

  const { articles: thuTruongArticles, isLoading: thuTruongLoading } = usePublicArticles({
    limit: 1000,
    category_slug: 'hoat-dong-thu-truong',
    enabled: isMainPage,
  });

  // Combine all articles for main page, sorted by published date
  const allActivitiesArticles = isMainPage 
    ? [...suDoanArticles, ...donViArticles, ...thuTruongArticles]
        .sort((a, b) => new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime())
    : [];

  // Paginate combined articles for "Tất cả" tab (10 per page)
  const itemsPerPage = 10;
  const totalPages = Math.ceil(allActivitiesArticles.length / itemsPerPage);
  const paginatedActivitiesArticles = allActivitiesArticles.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const articles = isMainPage ? paginatedActivitiesArticles : categoryArticles;
  const pagination = isMainPage 
    ? { total: allActivitiesArticles.length, page, page_size: itemsPerPage, total_pages: totalPages }
    : categoryPagination;
  const isLoading = isMainPage ? (suDoanLoading || donViLoading || thuTruongLoading) : categoryLoading;

  // Fetch latest articles for bottom section - with pagination
  const { articles: allLatestArticles } = usePublicArticles({
    limit: 50, // Fetch more to support pagination
    sort: '-published_at',
  });

  // Paginate latest articles (5 per page)
  const latestArticlesPerPage = 5;
  const latestArticles = allLatestArticles.slice(
    (latestPage - 1) * latestArticlesPerPage,
    latestPage * latestArticlesPerPage
  );
  const totalLatestPages = Math.ceil(allLatestArticles.length / latestArticlesPerPage);

  const currentCategory = categories.find(c => c.slug === categorySlug) || {
    slug: 'hoat-dong',
    name: 'Tất cả hoạt động',
    icon: '📰',
    color: 'purple'
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const dateStr = date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    const timeStr = date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return `${dateStr}, ${timeStr}`;
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-50 via-purple-50/50 to-white border-b border-purple-100">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center shadow-lg">
                <Newspaper className="w-8 h-8 text-purple-600" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Hoạt động</h1>
            </div>
            <p className="text-lg text-gray-600">
              Cập nhật các hoạt động của Sư đoàn, đơn vị và Thủ trưởng
            </p>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="bg-white border-b sticky top-16 z-30 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
            <Link
              to="/hoat-dong"
              className={`px-6 py-2.5 rounded-full whitespace-nowrap font-medium transition-all ${
                !categorySlug
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              📰 Tất cả
            </Link>
            {categories.map((category) => (
              <Link
                key={category.slug}
                to={`/hoat-dong/${category.slug}`}
                className={`px-6 py-2.5 rounded-full whitespace-nowrap font-medium transition-all ${
                  categorySlug === category.slug
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.icon} {category.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            {currentCategory.icon} {currentCategory.name}
          </h2>
          <p className="text-gray-600 mt-1">
            {isMainPage ? `${articles.length} bài viết` : `${pagination?.total || 0} bài viết`}
          </p>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : articles.length === 0 ? (
          <div className="text-center py-16">
            <Newspaper className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">Chưa có hoạt động nào</p>
          </div>
        ) : (
          <>
            {/* Articles List - Vertical layout */}
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
                      <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
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
                      <ChevronRight className="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition-transform ml-auto" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination - Only show for subcategory pages */}
            {!isMainPage && pagination && pagination.total_pages > 1 && (
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
                            ? 'bg-purple-600 text-white shadow-md'
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

            {/* Show "View More" button for main page */}
            {isMainPage && articles.length >= 10 && (
              <div className="flex justify-center mb-12">
                <p className="text-gray-500 text-sm">
                  Chọn một danh mục cụ thể để xem thêm bài viết
                </p>
              </div>
            )}
          </>
        )}

        {/* Latest Articles Section at Bottom - Horizontal layout */}
        {latestArticles.length > 0 && (
          <div className="mt-16 pt-12 border-t-2 border-gray-100">
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  Tin mới nhất
                </h2>
                <div className="text-sm text-gray-500">
                  Trang {latestPage} / {totalLatestPages}
                </div>
              </div>
              <p className="text-gray-500 mt-1">Cập nhật tin tức mới nhất từ Sư đoàn 365</p>
            </div>

            {/* Horizontal scroll grid - 5 items */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-6">
              {latestArticles.map((article) => (
                <Link
                  key={article.id}
                  to={`/a/${article.slug}`}
                  className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  <div className="aspect-video overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100">
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
                    <h3 className="font-bold text-sm text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {article.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(article.published_at || article.created_at)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Latest Articles Pagination */}
            {totalLatestPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => setLatestPage(p => Math.max(1, p - 1))}
                  disabled={latestPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
                >
                  ← Trước
                </button>
                
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalLatestPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setLatestPage(i + 1)}
                      className={`px-3 py-1.5 rounded-lg transition-colors text-sm font-medium ${
                        latestPage === i + 1
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setLatestPage(p => Math.min(totalLatestPages, p + 1))}
                  disabled={latestPage === totalLatestPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
                >
                  Sau →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
