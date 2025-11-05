import { Link } from 'react-router-dom';

interface Article {
  id: number;
  title: string;
  slug: string;
  summary: string;
  thumbnail_url?: string;
  category?: { name: string };
  published_at: string;
}

interface FeaturedNewsProps {
  articles: Article[];
}

export default function FeaturedNews({ articles }: FeaturedNewsProps) {
  if (!articles || articles.length === 0) return null;

  const mainArticle = articles[0];
  const sideArticles = articles.slice(1, 5);

  // External link for the featured banner
  const externalLink = "https://www.phongkhongkhongquan.vn/02/quan-chung-phong-khong-khong-quan-co-dong-duong-khong-cuu-tro-nhan-dan-tinh-lang-son.html";

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="grid md:grid-cols-3 gap-4">
        {/* Main featured banner - External Link */}
        <div className="md:col-span-2 relative group">
          <a href={externalLink} target="_blank" rel="noopener noreferrer" className="block">
            <div className="relative h-96 md:h-[500px] overflow-hidden">
              <img
                src={mainArticle.thumbnail_url || `https://picsum.photos/seed/${mainArticle.id}/800/500`}
                alt="Featured Banner"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          </a>
        </div>

        {/* Side articles */}
        <div className="space-y-4">
          {sideArticles.map((article) => (
            <Link
              key={article.id}
              to={`/a/${article.slug}`}
              className="block group bg-gray-50 hover:bg-gray-100 rounded-lg overflow-hidden transition-colors shadow-sm hover:shadow-md"
            >
              <div className="flex gap-3 p-3">
                <div className="flex-shrink-0 w-24 h-24 overflow-hidden rounded-md">
                  <img
                    src={article.thumbnail_url || `https://picsum.photos/seed/${article.id}/200/200`}
                    alt={article.title}
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
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
