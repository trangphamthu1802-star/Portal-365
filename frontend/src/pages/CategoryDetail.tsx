import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Header from '../components/Header';
import DynamicNavbar from '../components/DynamicNavbar';
import Footer from '../components/Footer';
import { apiClient } from '../lib/apiClient';
import { Article } from '../types/models';

export default function CategoryDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  // Fetch category info
  const { data: category } = useQuery({
    queryKey: ['category', slug],
    queryFn: async () => {
      const response = await apiClient.get(`/categories/${slug}`);
      return response.data.data;
    },
    enabled: !!slug,
  });

  // Fetch articles in this category
  const { data: articlesData, isLoading } = useQuery({
    queryKey: ['articles', 'category', slug],
    queryFn: async () => {
      const response = await apiClient.get('/articles', {
        params: { category: slug, status: 'published', page: 1, page_size: 20 }
      });
      return response.data;
    },
    enabled: !!slug,
  });

  const articles = articlesData?.data || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <DynamicNavbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {category?.name || slug}
          </h1>
          {category?.description && (
            <p className="text-gray-600 text-lg">{category.description}</p>
          )}
        </div>

        {/* Articles Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : articles.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-600 text-lg">Chưa có bài viết nào trong danh mục này.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article: Article) => (
              <a
                key={article.id}
                href={`/a/${article.slug}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
              >
                {article.featured_image && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={article.featured_image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                    {article.content.substring(0, 150).replace(/<[^>]*>/g, '')}...
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{new Date(article.published_at || article.created_at).toLocaleDateString('vi-VN')}</span>
                    <span>{article.view_count} lượt xem</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
