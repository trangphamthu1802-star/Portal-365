import Header from '../components/Header';
import AuthButton from '../components/AuthButton';
import DynamicNavbar from '../components/DynamicNavbar';
import FeaturedNews from '../components/FeaturedNews';
import NewsGrid from '../components/NewsGrid';
import SiteFooter from '../components/layout/SiteFooter';
import { usePublicArticles } from '../hooks/usePublicArticles';
import { getArticleImage } from '../lib/images';

export default function Home() {
  // Featured articles
  const { articles: featured, isLoading: featuredLoading } = usePublicArticles({
    is_featured: true,
    limit: 5,
    sort: '-published_at',
  });

  // Latest articles
  const { articles: latest, isLoading: latestLoading } = usePublicArticles({
    limit: 9,
    sort: '-published_at',
  });

  // Hoạt động - Sư đoàn
  const { articles: hoatDongSuDoan } = usePublicArticles({
    category_slug: 'su-doan',
    limit: 4,
  });

  // Hoạt động - Đơn vị
  const { articles: hoatDongDonVi } = usePublicArticles({
    category_slug: 'don-vi',
    limit: 4,
  });

  // Hoạt động - Thủ trưởng
  const { articles: hoatDongThuTruong } = usePublicArticles({
    category_slug: 'thu-truong-su-doan',
    limit: 4,
  });

  // Tin tức - Trong nước
  const { articles: tinTrongNuoc } = usePublicArticles({
    category_slug: 'trong-nuoc',
    limit: 6,
  });

  // Tin tức - Quốc tế
  const { articles: tinQuocTe } = usePublicArticles({
    category_slug: 'quoc-te',
    limit: 6,
  });

  // Tin tức - Quân sự
  const { articles: tinQuanSu } = usePublicArticles({
    category_slug: 'quan-su',
    limit: 6,
  });

  // Tin tức - Hoạt động Sư đoàn
  const { articles: tinHoatDongSuDoan } = usePublicArticles({
    category_slug: 'hoat-dong-su-doan',
    limit: 6,
  });

  // Tin tức - Tin đơn vị
  const { articles: tinDonVi } = usePublicArticles({
    category_slug: 'tin-don-vi',
    limit: 6,
  });

  const isLoading = featuredLoading || latestLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <DynamicNavbar />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-96 bg-gray-200 rounded-xl"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <DynamicNavbar />
      <div className="container mx-auto px-4 md:px-6 lg:px-8 mt-4 flex justify-end">
        {/* Hiển thị AuthButton dưới tên người dùng */}
        <AuthButton />
      </div>
      <main className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Featured Banner Section */}
        {featured.length > 0 && (
          <section className="py-8">
            <FeaturedNews articles={featured} />
          </section>
        )}

        {/* Latest News */}
        {latest.length > 0 && (
          <section className="py-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Tin mới nhất</h2>
            </div>
            <NewsGrid articles={latest} columns={3} />
          </section>
        )}

        {/* Hoạt động Section */}
        <section className="py-8 bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-blue-600 pb-2">
            Hoạt động
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Hoạt động Sư đoàn */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Hoạt động của Sư đoàn</h3>
              {hoatDongSuDoan.length > 0 ? (
                <div className="space-y-4">
                  {hoatDongSuDoan.map((article) => (
                    <a
                      key={article.id}
                      href={`/a/${article.slug}`}
                      className="block group"
                    >
                      <div className="flex gap-3">
                        <img
                          src={getArticleImage(article)}
                          alt={article.title}
                          className="w-20 h-20 object-cover rounded"
                          loading="lazy"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm text-gray-900 group-hover:text-blue-600 line-clamp-2">
                            {article.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(article.published_at).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Chưa có bài viết</p>
              )}
            </div>

            {/* Hoạt động Đơn vị */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Hoạt động của các đơn vị</h3>
              {hoatDongDonVi.length > 0 ? (
                <div className="space-y-4">
                  {hoatDongDonVi.map((article) => (
                    <a
                      key={article.id}
                      href={`/a/${article.slug}`}
                      className="block group"
                    >
                      <div className="flex gap-3">
                        <img
                          src={getArticleImage(article)}
                          alt={article.title}
                          className="w-20 h-20 object-cover rounded"
                          loading="lazy"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm text-gray-900 group-hover:text-blue-600 line-clamp-2">
                            {article.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(article.published_at).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Chưa có bài viết</p>
              )}
            </div>

            {/* Hoạt động Thủ trưởng */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Hoạt động của Thủ trưởng Sư đoàn</h3>
              {hoatDongThuTruong.length > 0 ? (
                <div className="space-y-4">
                  {hoatDongThuTruong.map((article) => (
                    <a
                      key={article.id}
                      href={`/a/${article.slug}`}
                      className="block group"
                    >
                      <div className="flex gap-3">
                        <img
                          src={getArticleImage(article)}
                          alt={article.title}
                          className="w-20 h-20 object-cover rounded"
                          loading="lazy"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm text-gray-900 group-hover:text-blue-600 line-clamp-2">
                            {article.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(article.published_at).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Chưa có bài viết</p>
              )}
            </div>
          </div>
        </section>

        {/* Tin tức Section */}
        <section className="py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-red-600 pb-2">
            Tin tức
          </h2>
          
          <div className="space-y-8">
            {/* Tin trong nước */}
            {tinTrongNuoc.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Tin trong nước</h3>
                <NewsGrid articles={tinTrongNuoc.slice(0, 6)} columns={3} />
              </div>
            )}

            {/* Tin quốc tế */}
            {tinQuocTe.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Tin quốc tế</h3>
                <NewsGrid articles={tinQuocTe.slice(0, 6)} columns={3} />
              </div>
            )}

            {/* Tin quân sự */}
            {tinQuanSu.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Tin quân sự</h3>
                <NewsGrid articles={tinQuanSu.slice(0, 6)} columns={3} />
              </div>
            )}

            {/* Tin hoạt động Sư đoàn */}
            {tinHoatDongSuDoan.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Tin hoạt động của Sư đoàn</h3>
                <NewsGrid articles={tinHoatDongSuDoan.slice(0, 6)} columns={3} />
              </div>
            )}

            {/* Tin đơn vị */}
            {tinDonVi.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Tin đơn vị</h3>
                <NewsGrid articles={tinDonVi.slice(0, 6)} columns={3} />
              </div>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
