import { useParams, Link } from 'react-router-dom';
import { useArticleBySlug, useRelatedArticles } from '@/hooks/useApi';
import { LoadingSkeleton } from '@/components/Loading';
import { ErrorState } from '@/components/ErrorState';
import { useEffect } from 'react';
import { Calendar, Eye, User, Share2, Facebook, Twitter, Link as LinkIcon, Tag, Clock } from 'lucide-react';
import Header from '@/components/Header';
import DynamicNavbar from '@/components/DynamicNavbar';
import SiteFooter from '@/components/layout/SiteFooter';

export const ArticleDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: articleResponse, isLoading, error, refetch } = useArticleBySlug(slug!);
  const { data: relatedResponse } = useRelatedArticles(slug!, 6);

  const article = (articleResponse as any)?.data;
  const relatedArticles = (relatedResponse as any)?.data || [];

  // Track view when article loads
  useEffect(() => {
    if (article?.id) {
      // View tracking handled by backend on fetch
    }
  }, [article?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Header />
        <DynamicNavbar />
        <div className="container mx-auto px-4 py-8">
          <LoadingSkeleton type="article" count={1} />
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Header />
        <DynamicNavbar />
        <div className="container mx-auto px-4 py-8">
          <ErrorState
            error={error}
            title="Không tìm thấy bài viết"
            message="Bài viết không tồn tại hoặc đã bị xóa"
            onRetry={() => refetch()}
          />
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      <DynamicNavbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs - Modern Style */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600 bg-white px-4 py-3 rounded-lg shadow-sm">
            <li>
              <Link to="/" className="hover:text-red-600 transition-colors flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/></svg>
                Trang chủ
              </Link>
            </li>
            {article.category && (
              <>
                <li className="text-gray-400">/</li>
                <li>
                  <Link to={`/c/${article.category.slug}`} className="hover:text-red-600 transition-colors">
                    {article.category.name}
                  </Link>
                </li>
              </>
            )}
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium truncate max-w-md">{article.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Premium Design */}
          <article className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Category Badge - Floating */}
              {article.category && (
                <div className="relative">
                  <Link
                    to={`/c/${article.category.slug}`}
                    className="absolute top-6 left-6 z-10 px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-full shadow-lg hover:bg-red-700 transition-all hover:scale-105"
                  >
                    {article.category.name}
                  </Link>
                </div>
              )}

              {/* Featured Image with Gradient Overlay */}
              {article.featured_image_url && (
                <div className="relative h-[400px] overflow-hidden">
                  <img
                    src={article.featured_image_url}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
              )}

              <div className="p-8 md:p-12">
                {/* Title - Bold & Modern */}
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
                  {article.title}
                </h1>

                {/* Meta Info - Icon-based */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-8 pb-8 border-b-2 border-gray-100">
                  <div className="flex items-center gap-2 font-medium">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <span>{article.author?.full_name || 'Biên tập viên'}</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-green-600" />
                    </div>
                    <span>
                      {new Date(article.published_at || article.created_at || '').toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-medium">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Clock className="w-4 h-4 text-purple-600" />
                    </div>
                    <span>
                      {new Date(article.published_at || article.created_at || '').toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  {article.view_count !== undefined && (
                    <div className="flex items-center gap-2 font-medium">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <Eye className="w-4 h-4 text-orange-600" />
                      </div>
                      <span>{article.view_count.toLocaleString()} lượt xem</span>
                    </div>
                  )}
                </div>

                {/* Summary - Highlighted */}
                {article.summary && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600 rounded-r-xl p-6 mb-8">
                    <p className="text-xl text-gray-800 font-semibold leading-relaxed italic">
                      {article.summary}
                    </p>
                  </div>
                )}

                {/* Content - Enhanced Typography */}
                <div
                  className="prose prose-lg prose-slate max-w-none 
                    prose-headings:font-bold prose-headings:text-gray-900
                    prose-p:text-gray-700 prose-p:leading-relaxed
                    prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                    prose-img:rounded-xl prose-img:shadow-lg
                    prose-blockquote:border-l-4 prose-blockquote:border-blue-600 prose-blockquote:bg-blue-50 prose-blockquote:py-2
                    prose-strong:text-gray-900 prose-strong:font-bold
                    prose-ul:list-disc prose-ol:list-decimal"
                  dangerouslySetInnerHTML={{ __html: article.content || '' }}
                />

                {/* Tags - Colorful Pills */}
                {article.tags && article.tags.length > 0 && (
                  <div className="mt-12 pt-8 border-t-2 border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                        <Tag className="w-4 h-4 text-pink-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">Từ khóa</h3>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {article.tags.map((tag: any) => (
                        <Link
                          key={tag.id}
                          to={`/tag/${tag.slug}`}
                          className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-pink-100 to-purple-100 text-gray-800 rounded-full hover:from-pink-200 hover:to-purple-200 transition-all hover:scale-105 shadow-sm"
                        >
                          #{tag.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Share Buttons - Modern Social */}
                <div className="mt-8 pt-8 border-t-2 border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <Share2 className="w-4 h-4 text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Chia sẻ bài viết</h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => {
                        const url = encodeURIComponent(window.location.href);
                        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
                      }}
                      className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all hover:scale-105 shadow-lg font-semibold"
                    >
                      <Facebook className="w-5 h-5" />
                      Facebook
                    </button>
                    <button
                      onClick={() => {
                        const url = encodeURIComponent(window.location.href);
                        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${encodeURIComponent(article.title)}`, '_blank');
                      }}
                      className="flex items-center gap-2 px-5 py-3 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-all hover:scale-105 shadow-lg font-semibold"
                    >
                      <Twitter className="w-5 h-5" />
                      Twitter
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Đã sao chép liên kết!');
                      }}
                      className="flex items-center gap-2 px-5 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-800 transition-all hover:scale-105 shadow-lg font-semibold"
                    >
                      <LinkIcon className="w-5 h-5" />
                      Sao chép link
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Sidebar - Modern Cards */}
          <aside className="space-y-6">
            {/* Related Articles - Enhanced */}
            {relatedArticles.length > 0 && (
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-6 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
                    </svg>
                  </div>
                  Bài viết liên quan
                </h2>
                <div className="space-y-4">
                  {relatedArticles.slice(0, 6).map((related: any, idx: number) => (
                    <Link
                      key={related.id}
                      to={`/a/${related.slug}`}
                      className={`block group ${idx > 0 ? 'pt-4 border-t border-gray-200' : ''}`}
                    >
                      <div className="flex gap-4">
                        {related.featured_image_url && (
                          <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden shadow-md">
                            <img
                              src={related.featured_image_url}
                              alt={related.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-bold text-sm text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 mb-2">
                            {related.title}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {new Date(related.published_at || related.created_at || '').toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
};
