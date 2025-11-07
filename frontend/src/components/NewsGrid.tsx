import { Link } from 'react-router-dom';
import { getArticleImage } from '../lib/images';

interface Article {
  id: number;
  title: string;
  slug: string;
  summary: string;
  thumbnail_url?: string;
  featured_image?: string;
  content?: string;
  view_count: number;
  published_at: string;
  category?: { name: string };
}

interface NewsGridProps {
  articles: Article[];
  columns?: 3 | 4;
}

export default function NewsGrid({ articles, columns = 4 }: NewsGridProps) {
  return (
    <div className={`grid gap-6 sm:grid-cols-2 ${columns === 3 ? 'lg:grid-cols-3' : 'md:grid-cols-3 lg:grid-cols-4'}`}>
      {articles.map((article) => (
        <Link
          key={article.id}
          to={`/a/${article.slug}`}
          className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-green-500"
        >
          {/* Thumbnail */}
          <div className="relative h-48 overflow-hidden bg-gray-200">
            <img
              src={getArticleImage(article)}
              alt={article.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {article.category && (
              <div className="absolute top-2 left-2">
                <span className="inline-block bg-blue-900/90 text-white px-3 py-1 rounded text-xs font-semibold uppercase">
                  {article.category.name}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-700 transition-colors leading-tight">
              {article.title}
            </h3>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
              {article.summary}
            </p>

            {/* Metadata */}
            <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{article.view_count.toLocaleString()}</span>
              </div>
              <span>{new Date(article.published_at).toLocaleDateString('vi-VN')}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
