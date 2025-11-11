import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ChevronRight, Globe2, Flag, Shield, TrendingUp, Clock, Eye } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { usePublicArticles } from '../hooks/usePublicArticles';
import { getArticleImage } from '../lib/images';

export default function NewsPage() {
  const [latestPage, setLatestPage] = useState(1);

  // Fetch articles for each news category - 10 per category for vertical display
  const { articles: domestic } = usePublicArticles({
    page: 1,
    limit: 10,
    category_slug: 'tin-trong-nuoc',
  });

  const { articles: international } = usePublicArticles({
    page: 1,
    limit: 10,
    category_slug: 'tin-quoc-te',
  });

  const { articles: military } = usePublicArticles({
    page: 1,
    limit: 10,
    category_slug: 'tin-quan-su',
  });

  const { articles: division, isLoading } = usePublicArticles({
    page: 1,
    limit: 10,
    category_slug: 'bao-ve-nen-tang-tu-tuong-cua-dang',
  });

  // Fetch latest articles for bottom section - with pagination
  const { articles: allLatestArticles } = usePublicArticles({
    limit: 50,
    sort: '-published_at',
  });

  // Paginate latest articles (5 per page)
  const latestArticlesPerPage = 5;
  const latestArticles = allLatestArticles.slice(
    (latestPage - 1) * latestArticlesPerPage,
    latestPage * latestArticlesPerPage
  );
  const totalLatestPages = Math.ceil(allLatestArticles.length / latestArticlesPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Category sections
  const newsSections = [
    {
      slug: 'tin-trong-nuoc',
      name: 'Tin trong nước',
      icon: <Flag className="w-6 h-6" />,
      color: 'from-blue-600 to-blue-700',
      articles: domestic,
    },
    {
      slug: 'tin-quoc-te',
      name: 'Tin quốc tế',
      icon: <Globe2 className="w-6 h-6" />,
      color: 'from-purple-600 to-purple-700',
      articles: international,
    },
    {
      slug: 'tin-quan-su',
      name: 'Tin quân sự',
      icon: <Shield className="w-6 h-6" />,
      color: 'from-green-600 to-green-700',
      articles: military,
    },
    {
      slug: 'bao-ve-nen-tang-tu-tuong-cua-dang',
      name: 'Bảo vệ nền tảng tư tưởng của Đảng',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'from-red-600 to-red-700',
      articles: division,
    },
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-blue-50/50 to-white border-b border-blue-100">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center shadow-lg">
                <Globe2 className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Tin tức</h1>
            </div>
            <p className="text-lg text-gray-600">
              Cập nhật tin tức trong nước, quốc tế, quân sự và hoạt động Sư đoàn
            </p>
          </div>
        </div>
      </div>

      {/* Quick Nav */}
      <div className="bg-white border-b sticky top-16 z-30 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
            {newsSections.map((section) => (
              <a
                key={section.slug}
                href={`#${section.slug}`}
                className="px-6 py-2.5 rounded-full whitespace-nowrap font-medium bg-gray-50 text-gray-700 hover:bg-gray-100 transition-all flex items-center gap-2"
              >
                {section.icon}
                <span>{section.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-16">
            {newsSections.map((section) => (
              <section key={section.slug} id={section.slug} className="scroll-mt-32">
                {/* Section Header */}
                <div className={`bg-gradient-to-r ${section.color} text-white rounded-2xl p-6 mb-6 shadow-lg`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        {section.icon}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">{section.name}</h2>
                        <p className="text-white/80 text-sm mt-1">
                          {section.articles.length} bài viết mới nhất
                        </p>
                      </div>
                    </div>
                    <Link
                      to={`/category/${section.slug}`}
                      className="px-5 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-all backdrop-blur-sm flex items-center gap-2"
                    >
                      Xem tất cả
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Articles List - Vertical layout */}
                {section.articles.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <p className="text-gray-500">Chưa có tin tức nào</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {section.articles.map((article) => (
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
                            loading="lazy"
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
                )}
              </section>
            ))}

            {/* Latest Articles Section at Bottom - Horizontal layout */}
            {latestArticles.length > 0 && (
              <div className="mt-16 pt-12 border-t-2 border-gray-100">
                <div className="mb-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
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
                      <div className="aspect-video overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100">
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
                        <h3 className="font-bold text-sm text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
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
                              ? 'bg-orange-600 text-white shadow-md'
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
        )}
      </div>
    </MainLayout>
  );
}
