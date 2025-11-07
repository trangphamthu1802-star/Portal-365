import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getArticleImage } from '../lib/images';

interface Article {
  id: number;
  title: string;
  slug: string;
  summary?: string;
  excerpt?: string;
  thumbnail_url?: string;
  featured_image?: string;
  content?: string;
  category?: { name: string };
  published_at: string;
}

interface FeaturedNewsProps {
  articles: Article[];
}

export default function FeaturedNews({ articles }: FeaturedNewsProps) {
  if (!articles || articles.length === 0) return null;

  const [currentIndex, setCurrentIndex] = useState(0);
  const allArticles = articles.slice(0, 5);

  // Auto-rotate every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allArticles.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [allArticles.length]);

  const mainArticle = allArticles[currentIndex];
  const sideArticles = allArticles.filter((_, index) => index !== currentIndex);

  const handleSideArticleClick = (index: number) => {
    const actualIndex = allArticles.findIndex(a => a.id === sideArticles[index].id);
    setCurrentIndex(actualIndex);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="grid md:grid-cols-3 gap-4">
        {/* Main featured banner - Auto-rotating */}
        <div className="md:col-span-2 relative group">
          <Link to={`/a/${mainArticle.slug}`} className="block">
            <div className="relative h-96 md:h-[500px] overflow-hidden">
              <img
                src={getArticleImage(mainArticle)}
                alt={mainArticle.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <h2 className="text-white text-2xl font-bold mb-2">{mainArticle.title}</h2>
                <p className="text-gray-200 text-sm line-clamp-2">{mainArticle.summary || mainArticle.excerpt}</p>
              </div>
            </div>
          </Link>
          
          {/* Navigation dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
            {allArticles.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-white w-6' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Side articles */}
        <div className="space-y-4">
          {sideArticles.map((article, index) => (
            <button
              key={article.id}
              onClick={() => handleSideArticleClick(index)}
              className="block w-full group bg-gray-50 hover:bg-gray-100 rounded-lg overflow-hidden transition-colors shadow-sm hover:shadow-md text-left"
            >
              <div className="flex gap-3 p-3">
                <div className="flex-shrink-0 w-24 h-24 overflow-hidden rounded-md">
                  <img
                    src={getArticleImage(article)}
                    alt={article.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-2 group-hover:text-green-700 transition-colors">
                    {article.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    {article.category && (
                      <span className="text-green-600 font-medium">{article.category.name}</span>
                    )}
                    <span>•</span>
                    <span>{new Date(article.published_at).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
