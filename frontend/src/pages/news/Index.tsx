import { useState, useMemo } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import Header from '../../components/Header';
import DynamicNavbar from '../../components/DynamicNavbar';
import SiteFooter from '../../components/layout/SiteFooter';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import Pagination from '../../components/common/Pagination';
import ArticleCardLg from '../../components/cards/ArticleCardLg';
import ArticleCardSm from '../../components/cards/ArticleCardSm';
import { useArticles } from '../../hooks/useApi';
import { getBreadcrumbs } from '../../config/navigation';

const ITEMS_PER_PAGE = 12;

export default function NewsIndex() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const selectedCategory = searchParams.get('category') || 'all';
  const currentPage = Number(searchParams.get('page')) || 1;
  const [localSearch, setLocalSearch] = useState('');

  // Get breadcrumbs from navigation config
  const breadcrumbs = getBreadcrumbs(location.pathname);

  // Build categories for filter
  const CATEGORIES = useMemo(() => [
    { id: 'all', name: 'Tất cả' },
    { id: 'tin-quoc-te', name: 'Tin quốc tế' },
    { id: 'tin-trong-nuoc', name: 'Tin trong nước' },
    { id: 'tin-quan-su', name: 'Tin quân sự' },
    { id: 'tin-don-vi', name: 'Tin đơn vị' }
  ], []);

  // Fetch articles based on selected category
  const { data, isLoading, error } = useArticles({
    page: currentPage,
    page_size: ITEMS_PER_PAGE,
  });

  // For "all" category, we'd need a different approach
  // For now, we'll just show empty state and guide users to select a category
  const articles = (data as any)?.data || [];
  const pagination = (data as any)?.pagination;
  const totalPages = pagination?.total_pages || 0;

  // Featured article (first one)
  const featuredArticle = articles[0];
  const listArticles = articles.slice(1);

  const handleCategoryChange = (categoryId: string) => {
    setSearchParams({ category: categoryId, page: '1' });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search functionality can be implemented later
    console.log('Search:', localSearch);
  };

  const handlePageChange = (page: number) => {
    setSearchParams({ category: selectedCategory, page: page.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <DynamicNavbar />
      <Breadcrumbs items={breadcrumbs} />

      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Tin tức
          </h1>
          <p className="text-gray-600">
            Cập nhật tin tức quốc tế, trong nước, quân sự và hoạt động đơn vị
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Lọc tin tức</h2>
          </div>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Tìm kiếm tin tức..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </form>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Loading */}
            {isLoading && (
              <div className="space-y-6 animate-pulse">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="aspect-[16/9] bg-gray-300"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
                <p className="text-red-600">Không thể tải dữ liệu. Vui lòng thử lại sau.</p>
              </div>
            )}

            {/* Empty state for "all" category */}
            {!isLoading && !error && selectedCategory === 'all' && (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <div className="text-gray-400 text-5xl mb-4">📰</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Vui lòng chọn chuyên mục
                </h3>
                <p className="text-gray-600">
                  Chọn một chuyên mục bên trên để xem tin tức
                </p>
              </div>
            )}

            {/* Articles */}
            {!isLoading && !error && articles.length > 0 && (
              <>
                {/* Featured Article */}
                {featuredArticle && (
                  <div className="mb-8">
                    <ArticleCardLg 
                      article={{
                        ...featuredArticle,
                        published_at: featuredArticle.published_at || featuredArticle.created_at,
                      }} 
                    />
                  </div>
                )}

                {/* Articles List */}
                {listArticles.length > 0 && (
                  <div className="space-y-4 mb-8">
                    {listArticles.map((article: any) => (
                      <ArticleCardSm 
                        key={article.id} 
                        article={{
                          ...article,
                          published_at: article.published_at || article.created_at,
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}

            {/* Empty state for selected category */}
            {!isLoading && !error && selectedCategory !== 'all' && articles.length === 0 && (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <div className="text-gray-400 text-5xl mb-4">📄</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Chưa có tin tức
                </h3>
                <p className="text-gray-600">
                  Chuyên mục này chưa có tin tức nào được đăng
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Stats */}
              {pagination && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Thống kê</h3>
                  <p className="text-gray-600">
                    Tổng số bài viết: <span className="font-semibold text-green-600">{pagination.total}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
