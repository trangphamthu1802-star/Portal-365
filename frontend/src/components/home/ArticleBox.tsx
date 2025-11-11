import { Link } from 'react-router-dom';
import { Calendar, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { getArticleImage } from '../../lib/images';

interface Article {
  id: number;
  title: string;
  slug: string;
  featured_image?: string;
  published_at?: string;
  created_at: string;
  view_count?: number;
}

interface ArticleBoxProps {
  title: string;
  categorySlug: string;
  articles: Article[];
  borderColor: string;
  accentColor: string;
  icon?: React.ReactNode;
  currentPage: number;
  onPageChange: (page: number) => void;
  showViewCount?: boolean;
}

const ArticleBox: React.FC<ArticleBoxProps> = ({
  title,
  categorySlug,
  articles,
  borderColor,
  accentColor,
  icon,
  currentPage,
  onPageChange,
  showViewCount = false
}) => {
  const itemsPerPage = 10;
  const totalPages = Math.ceil(articles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedArticles = articles.slice(startIndex, endIndex);

  const isNewArticle = (dateString: string) => {
    const articleDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - articleDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className={`bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-l-4 ${borderColor}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <div className={`w-10 h-10 ${accentColor} rounded-lg flex items-center justify-center`}>
            {icon || <span className={`w-4 h-4 ${borderColor.replace('border-', 'bg-')} rounded-full animate-pulse`}></span>}
          </div>
          <span className="line-clamp-1 flex items-center gap-2">
            {title}
            <span className={`w-2 h-2 ${borderColor.replace('border-', 'bg-')} rounded-full animate-pulse`}></span>
          </span>
        </h3>
        <Link
          to={`/c/${categorySlug}`}
          className={`${accentColor.replace('bg', 'text').replace('-100', '-600')} hover:${accentColor.replace('bg', 'text').replace('-100', '-700')} text-sm font-semibold flex items-center gap-1 group`}
        >
          Xem thêm
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Articles List */}
      <div className="space-y-3">
        {paginatedArticles.map((article, index) => (
          <Link
            key={article.id}
            to={`/a/${article.slug}`}
            className="group flex gap-3 pb-3 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 p-2 rounded-lg transition-all"
          >
            <div className="relative flex-shrink-0 w-24 h-20 rounded-lg overflow-hidden bg-gray-200">
              <img
                src={getArticleImage(article)}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className={`absolute top-1 left-1 w-6 h-6 ${borderColor.replace('border-l-4', 'bg')} text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md`}>
                {startIndex + index + 1}
              </div>
              {isNewArticle(article.published_at || article.created_at) && (
                <div className={`absolute top-1 right-1 ${borderColor.replace('border-l-4', 'bg')} text-white px-2 py-0.5 rounded text-[10px] font-bold animate-pulse shadow-md`}>
                  MỚI
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className={`font-semibold text-gray-900 group-hover:${accentColor.replace('bg', 'text').replace('-100', '-600')} transition-colors line-clamp-2 mb-2 text-sm leading-snug`}>
                {article.title}
              </h4>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(article.published_at || article.created_at)}
                </span>
                {showViewCount && article.view_count !== undefined && (
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {article.view_count}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              currentPage === 1
                ? 'text-gray-400 cursor-not-allowed'
                : `${accentColor.replace('bg', 'text').replace('-100', '-600')} hover:${accentColor.replace('bg', 'bg').replace('-100', '-50')}`
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Trước
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                    currentPage === pageNum
                      ? `${borderColor.replace('border-l-4', 'bg')} text-white`
                      : `text-gray-600 hover:${accentColor.replace('bg', 'bg')}`
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              currentPage === totalPages
                ? 'text-gray-400 cursor-not-allowed'
                : `${accentColor.replace('bg', 'text').replace('-100', '-600')} hover:${accentColor.replace('bg', 'bg').replace('-100', '-50')}`
            }`}
          >
            Sau
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Info Footer */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <span>Trang {currentPage} / {totalPages}</span>
        <span>Tổng {articles.length} bài viết</span>
      </div>
    </div>
  );
};

export default ArticleBox;
