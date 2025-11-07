import { Link } from 'react-router-dom';
import { Calendar, Eye } from 'lucide-react';

interface Article {
  id: number;
  title: string;
  slug: string;
  thumbnail_url?: string;
  category?: { name: string };
  published_at: string;
  view_count?: number;
}

interface ArticleCardSmProps {
  article: Article;
}

export default function ArticleCardSm({ article }: ArticleCardSmProps) {
  const imageUrl = article.thumbnail_url || `https://picsum.photos/seed/${article.id}/400/300`;

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
      className="group flex gap-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden p-3"
    >
      <div className="flex-shrink-0 w-28 h-20 overflow-hidden rounded bg-gray-200">
        <img
          src={imageUrl}
          alt={article.title}
          loading="lazy"
          width={112}
          height={80}
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
            {formatDate(article.published_at)}
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
  );
}
