import { Link } from 'react-router-dom';
import type { Article } from '@/hooks/useHome';

interface MostReadProps {
  articles: Article[];
}

export default function MostRead({ articles }: MostReadProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b flex items-center gap-2">
        <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        Đọc nhiều nhất
      </h3>
      
      <div className="space-y-4">
        {articles.slice(0, 10).map((article, index) => (
          <Link
            key={article.id}
            to={`/a/${article.slug}`}
            className="group flex gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
          >
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm">
              {index + 1}
            </span>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1 group-hover:text-green-600 transition-colors">
                {article.title}
              </h4>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{new Date(article.published_at).toLocaleDateString('vi-VN')}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {article.view_count.toLocaleString('vi-VN')}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
