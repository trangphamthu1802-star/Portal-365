import { Link } from 'react-router-dom';

interface Article {
  id: string;
  slug: string;
  title: string;
  summary?: string;
  thumbnail_url?: string;
  view_count?: number;
}

interface NewsHeroProps {
  featuredArticle?: Article;
  sideArticles?: Article[];
}

export default function NewsHero({ featuredArticle, sideArticles = [] }: NewsHeroProps) {
  if (!featuredArticle) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gray-200 h-96 animate-pulse rounded"></div>
      </div>
    );
  }

  return (
    <section className="bg-white py-6">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-green-800 mb-4 border-l-4 border-green-600 pl-3">
          TIN NỔI BẬT
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Featured Article */}
          <div className="md:col-span-2">
            <Link to={`/a/${featuredArticle.slug}`} className="group block relative overflow-hidden rounded-lg shadow-lg h-96">
              <img
                src={featuredArticle.thumbnail_url || 'https://via.placeholder.com/800x600?text=No+Image'}
                alt={featuredArticle.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-green-300 transition-colors">
                  {featuredArticle.title}
                </h3>
                {featuredArticle.summary && (
                  <p className="text-gray-200 line-clamp-2">{featuredArticle.summary}</p>
                )}
              </div>
            </Link>
          </div>

          {/* Side Articles */}
          <div className="space-y-4">
            {sideArticles.slice(0, 4).map((article) => (
              <Link
                key={article.id}
                to={`/a/${article.slug}`}
                className="block group border-b pb-3 last:border-b-0"
              >
                <div className="flex gap-3">
                  <img
                    src={article.thumbnail_url || 'https://via.placeholder.com/120x80?text=No+Image'}
                    alt={article.title}
                    className="w-24 h-16 object-cover rounded flex-shrink-0"
                  />
                  <h4 className="text-sm font-semibold text-gray-800 group-hover:text-green-700 line-clamp-3 transition-colors">
                    {article.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
