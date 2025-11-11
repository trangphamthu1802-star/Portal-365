import { useParams, Link } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { Calendar, Eye, Clock, TrendingUp, ChevronRight } from 'lucide-react';
import { useCategory } from '../../hooks/useCategory';
import { usePublicArticles } from '../../hooks/usePublicArticles';
import CategoryMainList from '../../components/category/CategoryMainList';
import { ALL_CATEGORY_SLUGS, CATEGORY_NAMES, CATEGORY_GROUPS } from '../../config/categorySlugs';
import Header from '../../components/Header';
import DynamicNavbar from '../../components/DynamicNavbar';
import SiteFooter from '../../components/layout/SiteFooter';
import { getArticleImage } from '../../lib/images';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  
  // Check if slug is valid
  const isValidSlug = slug && (ALL_CATEGORY_SLUGS as string[]).includes(slug);

  // Try to get category from API (optional - for dynamic data)
  const { data: category, isLoading: categoryLoading } = useCategory(slug || '', {
    enabled: !!slug,
  });

  // Fetch latest articles for sidebar
  const { articles: latestArticles } = usePublicArticles({
    limit: 10,
    sort: '-published_at',
  });

  // Fetch most viewed articles
  const { articles: mostViewedArticles } = usePublicArticles({
    limit: 5,
    sort: '-view_count',
  });

  // Get category info from static config or API
  const categoryName = category?.name || (slug ? CATEGORY_NAMES[slug] : '');
  const categoryDescription = category?.description;
  const categoryGroup = slug ? CATEGORY_GROUPS[slug] : undefined;

  // SEO
  useEffect(() => {
    if (categoryName) {
      document.title = `${categoryName} - Portal 365`;
      
      const description = categoryDescription || `Tin tức và bài viết về ${categoryName}`;
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', description);

      // Canonical
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.href = window.location.href;
    }

    return () => {
      document.title = 'Portal 365';
    };
  }, [categoryName, categoryDescription]);

  // Loading state
  if (categoryLoading && !categoryName) {
    return (
      <>
        <Header />
        <DynamicNavbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
          <div className="container mx-auto px-4 py-12">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
        <SiteFooter />
      </>
    );
  }

  // 404 - Invalid slug
  if (!isValidSlug) {
    return (
      <>
        <Header />
        <DynamicNavbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="text-9xl mb-6">📰</div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Không tìm thấy chuyên mục</h1>
              <p className="text-gray-600 mb-8">Chuyên mục bạn đang tìm kiếm không tồn tại.</p>
              <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <span>Về trang chủ</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <Header />
      <DynamicNavbar />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6 bg-white px-4 py-3 rounded-lg shadow-sm">
              <Link to="/" className="hover:text-blue-600 flex items-center gap-1 transition-colors">
                <span>🏠</span>
                <span>Trang chủ</span>
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link
                to={categoryGroup === 'activities' ? '/hoat-dong' : '/tin-tuc'}
                className="hover:text-blue-600 transition-colors"
              >
                {categoryGroup === 'activities' ? 'Hoạt động' : 'Tin tức'}
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-400">{categoryName}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Main content - 8 columns */}
              <div className="lg:col-span-8">
                <CategoryMainList
                  slug={slug!}
                  categoryName={categoryName}
                  description={categoryDescription}
                />
              </div>

              {/* Sidebar - 4 columns */}
              <aside className="lg:col-span-4 space-y-6">
                
                {/* Latest News - Tin mới nhất */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Tin mới nhất
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {latestArticles.slice(0, 10).map((art, index) => (
                      <Link
                        key={art.id}
                        to={`/a/${art.slug}`}
                        className="group flex gap-3 p-4 hover:bg-blue-50 transition-colors duration-200"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">
                            {index + 1}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
                            {art.title}
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <time className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(art.published_at).toLocaleDateString('vi-VN', {
                                day: '2-digit',
                                month: '2-digit',
                              })}
                            </time>
                            {art.view_count > 0 && (
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {art.view_count.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                        {art.featured_image && (
                          <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
                            <img
                              src={getArticleImage(art)}
                              alt={art.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              loading="lazy"
                            />
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>

              </aside>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </>
  );
}
