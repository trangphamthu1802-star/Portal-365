import { useSearchParams, useLocation } from 'react-router-dom';
import Header from '../../components/Header';
import DynamicNavbar from '../../components/DynamicNavbar';
import SiteFooter from '../../components/layout/SiteFooter';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import Tabs, { Tab } from '../../components/common/Tabs';
import Pagination from '../../components/common/Pagination';
import ArticleCardLg from '../../components/cards/ArticleCardLg';
import { useActivities } from '../../hooks/useApi';
import { getBreadcrumbs } from '../../config/navigation';

const TABS: Tab[] = [
  { id: 'hoat-dong-cua-thu-truong', label: 'Hoạt động của Thủ trưởng' },
  { id: 'hoat-dong-cua-su-doan', label: 'Hoạt động của Sư đoàn' },
  { id: 'hoat-dong-cua-cac-don-vi', label: 'Hoạt động của các đơn vị' }
];

const ITEMS_PER_PAGE = 12;

export default function ActivitiesIndex() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const activeTab = searchParams.get('tab') || TABS[0].id;
  const currentPage = Number(searchParams.get('page')) || 1;

  // Get breadcrumbs from navigation config
  const breadcrumbs = getBreadcrumbs(location.pathname);

  // Fetch articles for active tab category
  const { data, isLoading, error } = useActivities({
    page: currentPage,
    page_size: ITEMS_PER_PAGE,
  });

  const articles = (data as any)?.data || [];
  const pagination = (data as any)?.pagination;
  const totalPages = pagination?.total_pages || 0;

  const handleTabChange = (tabId: string) => {
    setSearchParams({ tab: tabId, page: '1' });
  };

  const handlePageChange = (page: number) => {
    setSearchParams({ tab: activeTab, page: page.toString() });
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
            Hoạt động
          </h1>
          <p className="text-gray-600">
            Cập nhật các hoạt động của Thủ trưởng, Sư đoàn và các đơn vị trực thuộc
          </p>
        </div>

        {/* Tabs */}
        <Tabs tabs={TABS} activeTab={activeTab} onTabChange={handleTabChange} className="mb-8" />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Loading State */}
            {isLoading && (
              <div className="grid md:grid-cols-2 gap-6 animate-pulse">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="aspect-[16/9] bg-gray-300"></div>
                    <div className="p-5 space-y-3">
                      <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
                <p className="text-red-600 mb-3">Không thể tải dữ liệu</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Thử lại
                </button>
              </div>
            )}

            {/* Articles Grid */}
            {!isLoading && !error && (
              <>
                {articles.length > 0 ? (
                  <>
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      {articles.map((article: any) => (
                        <ArticleCardLg 
                          key={article.id} 
                          article={{
                            ...article,
                            published_at: article.published_at || article.created_at,
                          }} 
                        />
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                      />
                    )}
                  </>
                ) : (
                  <div className="bg-white rounded-lg shadow p-12 text-center">
                    <div className="text-gray-400 text-5xl mb-4">📄</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Chưa có bài viết
                    </h3>
                    <p className="text-gray-600">
                      Chuyên mục này chưa có bài viết nào được đăng.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Stats Box */}
              {pagination && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Thống kê</h3>
                  <p className="text-gray-600">
                    Tổng số bài viết: <span className="font-semibold text-green-600">{pagination.total}</span>
                  </p>
                  <p className="text-gray-600 mt-2">
                    Trang {currentPage} / {totalPages}
                  </p>
                </div>
              )}
              
              {/* Quick Links */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Liên kết nhanh</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-700 hover:text-green-700 transition-colors">
                      Giới thiệu Sư đoàn
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-700 hover:text-green-700 transition-colors">
                      Lịch sử truyền thống
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-700 hover:text-green-700 transition-colors">
                      Cơ cấu tổ chức
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-700 hover:text-green-700 transition-colors">
                      Liên hệ
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
