import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import type { Article } from '@/hooks/useHome';

interface BreakingBarProps {
  articles: Article[];
}

export default function BreakingBar({ articles }: BreakingBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollAmount = 0;
    const scrollSpeed = 1;

    const scroll = () => {
      scrollAmount += scrollSpeed;
      if (scrollContainer.scrollWidth <= scrollAmount) {
        scrollAmount = 0;
      }
      scrollContainer.scrollLeft = scrollAmount;
    };

    const interval = setInterval(scroll, 30);
    return () => clearInterval(interval);
  }, []);

  if (!articles || articles.length === 0) return null;

  return (
    <div className="bg-red-600 text-white py-3 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 flex-shrink-0 font-bold uppercase text-sm">
            <svg className="w-5 h-5 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            Tin nóng
          </div>
          
          <div ref={scrollRef} className="overflow-hidden flex-1">
            <div className="flex gap-8 whitespace-nowrap">
              {[...articles, ...articles].map((article, index) => (
                <Link
                  key={`${article.id}-${index}`}
                  to={`/a/${article.slug}`}
                  className="hover:text-yellow-300 transition-colors"
                >
                  {article.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
