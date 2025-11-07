import { Link } from 'react-router-dom';
import SectionHeader from '../common/SectionHeader';
import type { Article } from '@/hooks/useHome';

interface CategoryRailProps {
  category: { id: number; name: string; slug: string };
  articles: Article[];
}

export default function CategoryRail({ category, articles }: CategoryRailProps) {
  if (!articles || articles.length === 0) return null;

  const mainArticle = articles[0];
  const sideArticles = articles.slice(1, 4);

  return (
    <section className="mb-12">
      <SectionHeader title={category.name} viewAllLink={`/c/${category.slug}`} />
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Main Article */}
        <Link
          to={`/a/${mainArticle.slug}`}
          className="group block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
        >
          <div className="aspect-[16/9] overflow-hidden">
            <img
              src={mainArticle.thumbnail_url || mainArticle.cover_url || 'https://via.placeholder.com/800x450'}
              alt={mainArticle.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          </div>
          <div className="p-5">
            {mainArticle.category && (
              <span className="inline-block text-xs font-semibold text-green-600 uppercase mb-2">
                {mainArticle.category.name}
              </span>
            )}
            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
              {mainArticle.title}
            </h3>
            {mainArticle.excerpt && (
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {mainArticle.excerpt}
              </p>
            )}
            {!mainArticle.excerpt && (mainArticle as any).summary && (
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {(mainArticle as any).summary}
              </p>
            )}
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span>{new Date(mainArticle.published_at).toLocaleDateString('vi-VN')}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {mainArticle.view_count.toLocaleString('vi-VN')}
              </span>
            </div>
          </div>
        </Link>

        {/* Side Articles */}
        <div className="space-y-4">
          {sideArticles.map((article) => (
            <Link
              key={article.id}
              to={`/a/${article.slug}`}
              className="group flex gap-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-3"
            >
              <div className="flex-shrink-0 w-32 h-24 overflow-hidden rounded-md">
                <img
                  src={article.thumbnail_url || article.cover_url || 'https://via.placeholder.com/200x150'}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-2 group-hover:text-green-600 transition-colors">
                  {article.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{new Date(article.published_at).toLocaleDateString('vi-VN')}</span>
                  <span>•</span>
                  <span>{article.view_count.toLocaleString('vi-VN')} lượt xem</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
