import { useParams, Link } from 'react-router-dom';
import { useArticleBySlug, useRelatedArticles } from '@/hooks/useApi';
import { LoadingSkeleton } from '@/components/Loading';
import { ErrorState } from '@/components/ErrorState';
import { useEffect } from 'react';

export const ArticleDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: articleResponse, isLoading, error, refetch } = useArticleBySlug(slug!);
  const { data: relatedResponse } = useRelatedArticles(slug!, 5);

  const article = (articleResponse as any)?.data;
  const relatedArticles = (relatedResponse as any)?.data || [];

  // Track view when article loads
  useEffect(() => {
    if (article?.id) {
      // Note: Backend should have POST /api/v1/articles/:id/views endpoint
      // For now, view is tracked on detail fetch
    }
  }, [article?.id]);

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <LoadingSkeleton type="article" count={1} />
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <ErrorState
            error={error}
            title="Không tìm thấy bài viết"
            message="Bài viết không tồn tại hoặc đã bị xóa"
            onRetry={() => refetch()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center space-x-2 text-gray-600">
            <li>
              <Link to="/" className="hover:text-blue-600">
                Trang chủ
              </Link>
            </li>
            {article.category && (
              <>
                <li>›</li>
                <li>
                  <Link to={`/c/${article.category.slug}`} className="hover:text-blue-600">
                    {article.category.name}
                  </Link>
                </li>
              </>
            )}
            <li>›</li>
            <li className="text-gray-900 font-medium truncate">{article.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <article className="lg:col-span-2 bg-white rounded-lg shadow-md p-8">
            {/* Category Badge */}
            {article.category && (
              <Link
                to={`/c/${article.category.slug}`}
                className="inline-block px-3 py-1 text-sm font-semibold text-blue-600 bg-blue-100 rounded mb-4 hover:bg-blue-200"
              >
                {article.category.name}
              </Link>
            )}

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>

            {/* Meta Info */}
            <div className="flex items-center text-sm text-gray-600 mb-6 pb-6 border-b">
              <div className="flex items-center mr-6">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                </svg>
                <span>{article.author?.full_name || 'Biên tập viên'}</span>
              </div>
              <div className="flex items-center mr-6">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
                </svg>
                <span>
                  {new Date(article.published_at || article.created_at || '').toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              {article.view_count !== undefined && (
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{article.view_count.toLocaleString()} lượt xem</span>
                </div>
              )}
            </div>

            {/* Summary */}
            {article.summary && (
              <div className="text-lg text-gray-700 font-medium mb-6 italic">{article.summary}</div>
            )}

            {/* Featured Image */}
            {article.featured_image_url && (
              <div className="mb-6">
                <img
                  src={article.featured_image_url}
                  alt={article.title}
                  className="w-full rounded-lg"
                />
              </div>
            )}

            {/* Content */}
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: article.content || '' }}
            />

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Từ khóa:</h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag: any) => (
                    <Link
                      key={tag.id}
                      to={`/tag/${tag.slug}`}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
                    >
                      #{tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Share Buttons */}
            <div className="mt-8 pt-6 border-t">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Chia sẻ:</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const url = encodeURIComponent(window.location.href);
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Facebook
                </button>
                <button
                  onClick={() => {
                    const url = encodeURIComponent(window.location.href);
                    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${encodeURIComponent(article.title)}`, '_blank');
                  }}
                  className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600"
                >
                  Twitter
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Đã sao chép liên kết');
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Sao chép liên kết
                </button>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Bài viết liên quan</h2>
                <div className="space-y-4">
                  {relatedArticles.slice(0, 5).map((related: any) => (
                    <Link
                      key={related.id}
                      to={`/a/${related.slug}`}
                      className="block group"
                    >
                      <div className="flex gap-3">
                        {related.featured_image_url && (
                          <img
                            src={related.featured_image_url}
                            alt={related.title}
                            className="w-20 h-20 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 line-clamp-2 mb-1">
                            {related.title}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {new Date(related.published_at || related.created_at || '').toLocaleDateString('vi-VN')}
                          </span>
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
    </div>
  );
};
