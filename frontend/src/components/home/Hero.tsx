import { Link } from 'react-router-dom';
import type { Article } from '@/hooks/useHome';

interface HeroProps {
  article: Article | null;
}

export default function Hero({ article }: HeroProps) {
  if (!article) {
    return (
      <section className="container mx-auto px-4 md:px-6 lg:px-8 pt-6">
        <div className="relative rounded-xl overflow-hidden shadow-lg h-[52vw] sm:h-[48vw] md:h-[32vw] lg:h-[28vw] min-h-[260px] bg-gray-200 animate-pulse" />
      </section>
    );
  }

  const imageUrl = article.cover_url || article.thumbnail_url;

  return (
    <section className="container mx-auto px-4 md:px-6 lg:px-8 pt-6">
      <div className="relative rounded-xl overflow-hidden shadow-lg h-[52vw] sm:h-[48vw] md:h-[32vw] lg:h-[28vw] min-h-[260px] group">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="eager"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-green-600 to-green-800" />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7 md:p-8 text-white">
          {article.category && (
            <Link 
              to={`/c/${article.category.slug}`} 
              className="inline-block mb-3 text-xs font-semibold tracking-wide uppercase bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full hover:bg-white/25 transition-colors"
            >
              {article.category.name}
            </Link>
          )}
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight drop-shadow-md mb-3">
            <Link 
              to={`/a/${article.slug}`}
              className="hover:text-green-300 transition-colors"
            >
              {article.title}
            </Link>
          </h1>
          
          {article.excerpt && (
            <p className="max-w-2xl text-white/90 line-clamp-2 text-sm sm:text-base">
              {article.excerpt}
            </p>
          )}
          
          {!article.excerpt && (article as any).summary && (
            <p className="max-w-2xl text-white/90 line-clamp-2 text-sm sm:text-base">
              {(article as any).summary}
            </p>
          )}
          
          <div className="flex items-center gap-4 mt-4 text-xs sm:text-sm text-white/80">
            {article.author && <span>{article.author.full_name}</span>}
            <span>•</span>
            <span>{new Date(article.published_at).toLocaleDateString('vi-VN')}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {article.view_count.toLocaleString('vi-VN')}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
