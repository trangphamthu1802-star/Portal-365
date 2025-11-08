import { Link } from 'react-router-dom';
import { Calendar, Eye } from 'lucide-react';
import SectionHeader from '../common/SectionHeader';
import type { ModelsCategory, ModelsArticle } from '@/api/data-contracts';

interface ActivitiesRailProps {
  category: ModelsCategory;
  articles: ModelsArticle[];
}

export default function ActivitiesRail({
  category,
  articles
}: ActivitiesRailProps) {
  // Don't render if no articles
  if (articles.length === 0) {
    return null;
  }

  // Take first 4 articles (1 large + 3 small)
  const displayArticles = articles.slice(0, 4);
  const mainArticle = displayArticles[0];
  const sideArticles = displayArticles.slice(1, 4);

  const getImageUrl = (article: ModelsArticle) =>
    article.featured_image || `https://picsum.photos/seed/${article.id}/800/600`;

  const getSummary = (article: ModelsArticle) =>
    article.summary || '';

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return '';
    }
  };

  return (
    <section className="mb-8" aria-labelledby={`section-${category.slug}`}>
      <SectionHeader
        title={category?.name || 'Category'}
        viewAllLink={`/c/${category.slug}`}
      />

      <div className="grid md:grid-cols-2 gap-6">
        {/* Main article - Large card */}
        {mainArticle && (
          <Link
            to={`/a/${mainArticle.slug}`}
            className="group block bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <div className="relative aspect-[16/9] overflow-hidden bg-gray-200">
              <img
                src={getImageUrl(mainArticle)}
                alt={mainArticle.title}
                loading="lazy"
                width={800}
                height={450}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-green-700 transition-colors">
                {mainArticle.title}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {getSummary(mainArticle)}
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(mainArticle.published_at || mainArticle.created_at)}
                </span>
                {mainArticle.view_count !== undefined && (
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    {mainArticle.view_count.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </Link>
        )}

        {/* Side articles - 3 small cards */}
        <div className="space-y-4">
          {sideArticles.map((article) => (
            <Link
              key={article.id}
              to={`/a/${article.slug}`}
              className="group flex gap-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden p-3"
            >
              <div className="flex-shrink-0 w-32 h-24 overflow-hidden rounded bg-gray-200">
                <img
                  src={getImageUrl(article)}
                  alt={article.title}
                  loading="lazy"
                  width={128}
                  height={96}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-2 group-hover:text-green-700 transition-colors">
                  {article.title}
                </h4>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(article.published_at || article.created_at)}
                  </span>
                  {article.view_count !== undefined && (
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {article.view_count.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// Skeleton loader component
function ActivitiesRailSkeleton({ title }: { title: string }) {
  return (
    <section className="mb-8 animate-pulse" aria-busy="true" aria-live="polite">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <div className="h-4 w-24 bg-gray-300 rounded"></div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Main skeleton */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="aspect-[16/9] bg-gray-300"></div>
          <div className="p-4 space-y-3">
            <div className="h-6 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="flex gap-4">
              <div className="h-3 bg-gray-200 rounded w-20"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        </div>

        {/* Side skeletons */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3 bg-white rounded-lg shadow-sm p-3">
              <div className="flex-shrink-0 w-32 h-24 bg-gray-300 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-4/5"></div>
                <div className="flex gap-3">
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                  <div className="h-3 bg-gray-200 rounded w-12"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

ActivitiesRail.Skeleton = ActivitiesRailSkeleton;
