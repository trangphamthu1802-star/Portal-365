import { Link } from 'react-router-dom';
import { Calendar, Eye, User } from 'lucide-react';

interface Article {
  id: number;
  title: string;
  slug: string;
  summary?: string;
  excerpt?: string;
  thumbnail_url?: string;
  cover_url?: string;
  category?: { name: string; slug?: string };
  author?: { name: string };
  published_at: string;
  view_count?: number;
}

interface ArticleCardLgProps {
  article: Article;
}

export default function ArticleCardLg({ article }: ArticleCardLgProps) {
  const imageUrl = article.cover_url || article.thumbnail_url || `https://picsum.photos/seed/${article.id}/800/600`;
  const summary = article.summary || article.excerpt || '';

  const formatDate = (dateStr: string) => {
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
    <Link
      to={`/a/${article.slug}`}
      className="group block bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-gray-200">
        <img
          src={imageUrl}
          alt={article.title}
          loading="lazy"
          width={800}
          height={450}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {article.category && (
          <span className="absolute top-3 left-3 px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-full">
            {article.category.name}
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-green-700 transition-colors">
          {article.title}
        </h3>
        {summary && (
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {summary}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(article.published_at)}
          </span>
          {article.author && (
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              {article.author.name}
            </span>
          )}
          {article.view_count !== undefined && (
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {article.view_count.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
