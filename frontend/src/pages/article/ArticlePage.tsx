import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { Calendar, Eye, Clock, Tag, Share2, ChevronRight, TrendingUp, FileText, Image, Play } from 'lucide-react';
import { useArticle, useRelatedArticles, estimateReadingTime } from '../../hooks/useArticle';
import { usePublicArticles } from '../../hooks/usePublicArticles';
import { usePublicMediaItems } from '../../hooks/useApi';
import Header from '../../components/Header';
import DynamicNavbar from '../../components/DynamicNavbar';
import SiteFooter from '../../components/layout/SiteFooter';
import ReadingProgress from '../../components/article/ReadingProgress';
import ShareBar from '../../components/article/ShareBar';
import AuthorBox from '../../components/article/AuthorBox';
import { setArticleSEO, clearSEO } from '../../utils/seo';
import { useBanners } from '../../hooks/useBanners';
import { getFullImageUrl } from '../../lib/apiClient';
import { getArticleImage } from '../../lib/images';

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading, error } = useArticle(slug || '');
  const { data: relatedArticles } = useRelatedArticles(
    article?.category?.slug || '',
    article?.id || 0
  );

  // Fetch banners
  const { data: topBanners = [] } = useBanners('article-top');
  const { data: bottomBanners = [] } = useBanners('article-bottom');

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

  // Fetch media for gallery and videos - giống như trang Home
  const { data: mediaData } = usePublicMediaItems({ 
    page: 1, 
    page_size: 4,
    media_type: 'image'
  });

  const { data: videoData } = usePublicMediaItems({ 
    page: 1, 
    page_size: 4,
    media_type: 'video'
  });

  const galleryImages = mediaData?.data || [];
  const videoItems = videoData?.data || [];

  const [readingTime, setReadingTime] = useState(0);

  useEffect(() => {
    if (article) {
      setArticleSEO({
        title: article.title,
        excerpt: article.summary || article.excerpt,
        cover_url: article.featured_image || article.cover_url,
        published_at: article.published_at,
        updated_at: article.updated_at,
        category: article.category,
        author: article.author,
        slug: article.slug,
      });
      setReadingTime(estimateReadingTime(article.content));
    }

    return () => clearSEO();
  }, [article]);

  // Loading state
  if (isLoading) {
    return (
      <>
        <Header />
        <DynamicNavbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-7xl mx-auto">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-96 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
        <SiteFooter />
      </>
    );
  }

  // Error state - 404
  if (error || !article) {
    return (
      <>
        <Header />
        <DynamicNavbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="text-9xl mb-6">📰</div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Không tìm thấy bài viết</h1>
              <p className="text-gray-600 mb-8">Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
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

  const content = article.content || article.content_html || '';
  const sanitizedContent = DOMPurify.sanitize(content, {
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'],
  });

  return (
    <>
      <ReadingProgress />
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
              {article.category && (
                <>
                  <Link to={`/c/${article.category.slug}`} className="hover:text-blue-600 transition-colors">
                    {article.category.name}
                  </Link>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
              <span className="text-gray-400 truncate max-w-md">{article.title}</span>
            </nav>

            {/* Banner - Article Top */}
            {topBanners.length > 0 && (
              <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {topBanners.slice(0, 2).map((banner) => (
                    <a
                      key={banner.id}
                      href={banner.link_url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <img
                        src={getFullImageUrl(banner.image_url)}
                        alt={banner.alt || banner.title}
                        className="w-full h-auto"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Main content - 8 columns */}
              <div className="lg:col-span-8">
                <article className="bg-white rounded-xl shadow-lg overflow-hidden">
                  
                  {/* Article Header */}
                  <div className="p-6 md:p-8 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
                    {/* Category chip */}
                    {article.category && (
                      <Link
                        to={`/c/${article.category.slug}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-full mb-4 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      >
                        <Tag className="w-4 h-4" />
                        {article.category.name}
                      </Link>
                    )}

                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                      {article.title}
                    </h1>

                    {/* Meta info */}
                    <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-gray-600">
                      {article.author && (
                        <div className="flex items-center gap-2">
                          <img
                            src={article.author.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(article.author.name)}&background=0D8ABC&color=fff`}
                            alt={article.author.name}
                            className="w-10 h-10 rounded-full border-2 border-blue-200"
                          />
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-900">{article.author.name}</span>
                            <span className="text-xs text-gray-500">Tác giả</span>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 rounded-full">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <time dateTime={article.published_at} className="text-blue-900 font-medium">
                          {new Date(article.published_at).toLocaleDateString('vi-VN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </time>
                      </div>
                      
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 rounded-full">
                        <Clock className="w-4 h-4 text-green-600" />
                        <span className="text-green-900 font-medium">{readingTime} phút đọc</span>
                      </div>
                      
                      {article.view_count > 0 && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-100 rounded-full">
                          <Eye className="w-4 h-4 text-orange-600" />
                          <span className="text-orange-900 font-medium">{article.view_count.toLocaleString()} lượt xem</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Featured Image */}
                  {article.featured_image && (
                    <figure className="relative overflow-hidden bg-gray-100">
                      <img
                        src={article.featured_image}
                        alt={article.title}
                        className="w-full h-auto object-cover"
                        loading="eager"
                        decoding="async"
                      />
                    </figure>
                  )}

                  {/* Article Body */}
                  <div className="p-6 md:p-8 lg:p-10">
                    
                    {/* Summary/Excerpt */}
                    {article.summary && (
                      <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600 rounded-r-lg shadow-sm">
                        <p className="text-lg md:text-xl text-gray-800 font-medium leading-relaxed italic">
                          {article.summary}
                        </p>
                      </div>
                    )}

                    {/* Article content */}
                    <div
                      id="article-content"
                      className="prose prose-lg max-w-none
                        prose-headings:font-bold prose-headings:text-gray-900
                        prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-5 prose-h2:pb-3 prose-h2:border-b-2 prose-h2:border-blue-200
                        prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
                        prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-5 prose-p:text-justify
                        prose-a:text-blue-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline hover:prose-a:text-blue-800
                        prose-img:rounded-xl prose-img:shadow-lg prose-img:my-6
                        prose-blockquote:border-l-4 prose-blockquote:border-blue-600 prose-blockquote:bg-gray-50 prose-blockquote:py-3 prose-blockquote:px-6 prose-blockquote:my-6 prose-blockquote:italic
                        prose-ul:list-disc prose-ul:my-4 prose-ol:list-decimal prose-ol:my-4
                        prose-li:text-gray-700 prose-li:my-2
                        prose-strong:text-gray-900 prose-strong:font-bold
                        prose-em:text-gray-800 prose-em:italic
                        prose-code:text-pink-600 prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                        prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:my-6
                        prose-table:border-collapse prose-table:my-6 prose-th:border prose-th:border-gray-300 prose-th:bg-gray-100 prose-th:p-3 prose-td:border prose-td:border-gray-300 prose-td:p-3
                        [&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:rounded-xl [&_iframe]:shadow-lg [&_iframe]:my-6"
                      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                    />

                    {/* Tags */}
                    {article.tags && article.tags.length > 0 && (
                      <div className="mt-10 pt-6 border-t border-gray-200">
                        <div className="flex items-start gap-3">
                          <div className="flex items-center gap-2 text-gray-600 font-semibold">
                            <Tag className="w-5 h-5" />
                            <span>Tags:</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {article.tags.map((tag) => (
                              <Link
                                key={tag.id}
                                to={`/tag/${tag.slug}`}
                                className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-sm font-medium rounded-full hover:from-blue-100 hover:to-blue-200 hover:text-blue-700 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                              >
                                #{tag.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Share bar */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <div className="flex items-center gap-3 mb-4">
                        <Share2 className="w-5 h-5 text-gray-600" />
                        <h3 className="text-lg font-bold text-gray-900">Chia sẻ bài viết</h3>
                      </div>
                      <ShareBar title={article.title} />
                    </div>

                    {/* Author box */}
                    {article.author && (
                      <div className="mt-8 pt-6 border-t border-gray-200">
                        <AuthorBox author={article.author} />
                      </div>
                    )}
                  </div>
                </article>

                {/* Banner - Article Bottom */}
                {bottomBanners.length > 0 && (
                  <div className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {bottomBanners.slice(0, 2).map((banner) => (
                        <a
                          key={banner.id}
                          href={banner.link_url || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                          <img
                            src={getFullImageUrl(banner.image_url)}
                            alt={banner.alt || banner.title}
                            className="w-full h-auto"
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Related articles */}
                {relatedArticles && relatedArticles.length > 0 && (
                  <div className="mt-8">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <ChevronRight className="w-6 h-6 text-blue-600" />
                        Bài viết liên quan
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {relatedArticles.slice(0, 6).map((related) => (
                          <Link
                            key={related.id}
                            to={`/a/${related.slug}`}
                            className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 hover:shadow-lg transition-all duration-300"
                          >
                            {related.featured_image && (
                              <div className="relative overflow-hidden h-48">
                                <img
                                  src={related.featured_image}
                                  alt={related.title}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              </div>
                            )}
                            <div className="p-4">
                              <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                {related.title}
                              </h3>
                              {related.summary && (
                                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                                  {related.summary}
                                </p>
                              )}
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <time className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(related.published_at).toLocaleDateString('vi-VN')}
                                </time>
                                {related.view_count > 0 && (
                                  <span className="flex items-center gap-1">
                                    <Eye className="w-3 h-3" />
                                    {related.view_count.toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
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

                {/* Most Viewed - Xem nhiều nhất */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      Xem nhiều nhất
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {mostViewedArticles.slice(0, 5).map((art, index) => (
                      <Link
                        key={art.id}
                        to={`/a/${art.slug}`}
                        className="group block p-4 hover:bg-orange-50 transition-colors duration-200"
                      >
                        {art.featured_image && (
                          <div className="relative overflow-hidden rounded-lg mb-3 h-32">
                            <img
                              src={getArticleImage(art)}
                              alt={art.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              loading="lazy"
                            />
                            <div className="absolute top-2 left-2 w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                              {index + 1}
                            </div>
                          </div>
                        )}
                        <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2 group-hover:text-orange-600 transition-colors">
                          {art.title}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {art.view_count.toLocaleString()} lượt xem
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

              </aside>
            </div>
          </div>
        </div>
      </div>

      {/* Kho văn bản, Thư viện ảnh, Thư viện video */}
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Kho văn bản */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-300">
              <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-white" />
                  <h3 className="text-xl font-bold text-white">Kho văn bản</h3>
                </div>
                <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  1 văn bản
                </span>
              </div>
              <div className="p-5">
                <Link 
                  to="/documents/5067" 
                  className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group border border-gray-200"
                >
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 group-hover:text-slate-700 line-clamp-2 text-sm leading-tight mb-2">
                      5067- Quy định quan ly va bao dam ATTT, ANM
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        08/11/2025
                      </span>
                      <span className="flex items-center gap-1 text-orange-600 font-medium">
                        2.5 MB
                      </span>
                    </div>
                  </div>
                </Link>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Link 
                    to="/docs" 
                    className="flex items-center justify-center gap-2 text-slate-700 hover:text-slate-900 font-semibold text-sm transition-colors"
                  >
                    Xem tất cả
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Thư viện ảnh */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-300">
              <div className="bg-gradient-to-r from-purple-700 to-purple-800 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image className="w-6 h-6 text-white" />
                  <h3 className="text-xl font-bold text-white">Thư viện ảnh</h3>
                </div>
                <span className="bg-white text-purple-700 text-xs font-bold px-3 py-1 rounded-full">
                  {galleryImages.length}
                </span>
              </div>
              <div className="p-5">
                {galleryImages.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {galleryImages.slice(0, 2).map((photo: any, idx: number) => (
                        <Link
                          key={photo.id}
                          to={`/media?type=image`}
                          className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer border-2 border-gray-200"
                        >
                          {photo.url && (
                            <img 
                              src={`http://localhost:8080${photo.url}`}
                              alt={photo.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                              }}
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                            <div className="text-white text-xs font-semibold line-clamp-2">
                              {photo.title}
                            </div>
                          </div>
                          <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {idx + 1}
                          </div>
                        </Link>
                      ))}
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <Link 
                        to="/media/photos" 
                        className="flex items-center justify-center gap-2 text-purple-700 hover:text-purple-900 font-semibold text-sm transition-colors"
                      >
                        Xem tất cả
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Image className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Chưa có ảnh</p>
                  </div>
                )}
              </div>
            </div>

            {/* Thư viện video */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-300">
              <div className="bg-gradient-to-r from-pink-600 to-pink-700 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Play className="w-6 h-6 text-white" />
                  <h3 className="text-xl font-bold text-white">Thư viện video</h3>
                </div>
                <span className="bg-white text-pink-600 text-xs font-bold px-3 py-1 rounded-full">
                  {videoItems.length}
                </span>
              </div>
              <div className="p-5">
                {videoItems.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {videoItems.slice(0, 2).map((video: any, idx: number) => (
                        <Link
                          key={video.id}
                          to={`/media?type=video`}
                          className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer border-2 border-gray-200"
                        >
                          {video.url && (
                            <video
                              src={`http://localhost:8080${video.url}#t=0.1`}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              preload="metadata"
                              muted
                              playsInline
                            />
                          )}
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors flex items-center justify-center">
                            <div className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Play className="w-6 h-6 text-white ml-1" fill="white" />
                            </div>
                          </div>
                          <div className="absolute bottom-2 left-2 right-2 text-white text-xs font-semibold bg-black/70 px-2 py-1 rounded line-clamp-1">
                            {video.title}
                          </div>
                          <div className="absolute top-2 right-2 bg-pink-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {idx + 1}
                          </div>
                        </Link>
                      ))}
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <Link 
                        to="/media/videos" 
                        className="flex items-center justify-center gap-2 text-pink-600 hover:text-pink-800 font-semibold text-sm transition-colors"
                      >
                        Xem tất cả
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Play className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Chưa có video</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      <SiteFooter />
    </>
  );
}
