import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';
import Header from '../components/Header';
import DynamicNavbar from '../components/DynamicNavbar';
import SiteFooter from '../components/layout/SiteFooter';

export default function ArticlePage() {
  const { slug } = useParams();

  const { data: article, isLoading } = useQuery({
    queryKey: ['article', slug],
    queryFn: async () => {
      const response = await apiClient.get(`/articles/${slug}`);
      return response.data.data;
    },
  });

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (!article) return <div className="p-8">Article not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <DynamicNavbar />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <article className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
          
          {article.featured_image && (
            <img
              src={article.featured_image}
              alt={article.title}
              className="w-full h-96 object-cover rounded-lg mb-6"
            />
          )}

          <div className="flex items-center text-gray-600 text-sm mb-6">
            <span>{new Date(article.published_at).toLocaleDateString()}</span>
            <span className="mx-2">•</span>
            <span>{article.view_count} views</span>
          </div>

          {article.summary && (
            <p className="text-xl text-gray-700 mb-6 italic">{article.summary}</p>
          )}

          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {article.tags && article.tags.length > 0 && (
            <div className="mt-8 pt-8 border-t">
              <h3 className="font-semibold mb-2">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-200 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
