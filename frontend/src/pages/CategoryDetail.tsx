import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Eye, Grid, List, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import Header from '../components/Header';
import DynamicNavbar from '../components/DynamicNavbar';
import SiteFooter from '../components/layout/SiteFooter';
import { apiClient } from '../lib/apiClient';
import { Article } from '../types/models';
import { getArticleImage } from '../lib/images';

export default function CategoryDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      <DynamicNavbar />

      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
        {/* Category Header - Modern Design */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 md:p-12 shadow-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white">
                {category?.name || slug}
              </h1>
            </div>
            {category?.description && (
              <p className="text-xl text-blue-100 font-medium max-w-3xl">
                {category.description}
              </p>
            )}
            <div className="mt-6 flex items-center gap-4 text-white/90">
              <span className="text-sm font-semibold">{articles.length} bài viết</span>
            </div>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="mb-6 flex justify-end gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all ${
              viewMode === 'grid' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
            title="Lưới"
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all ${
              viewMode === 'list' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
            title="Danh sách"
          >
            <List className="w-5 h-5" />
          </button>
        </div>

        {/* Articles Display */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
          </div>
        ) : articles.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Chưa có bài viết</h3>
            <p className="text-gray-600 text-lg">Chưa có bài viết nào trong danh mục này.</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article: Article) => (
              <Link
                key={article.id}
                to={`/a/${article.slug}`}
                className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={getArticleImage(article)}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full shadow-lg">
                      MỚI
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
                    {article.title}
                  </h3>
                  {article.summary && (
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">
                      {article.summary}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(article.published_at || article.created_at).toLocaleDateString('vi-VN')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {article.view_count}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {articles.map((article: Article) => (
              <Link
                key={article.id}
                to={`/a/${article.slug}`}
                className="group flex gap-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden p-6 hover:-translate-y-0.5"
              >
                <div className="relative w-64 h-40 flex-shrink-0 rounded-lg overflow-hidden">
                  <img
                    src={getArticleImage(article)}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-2xl mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-base line-clamp-2 mb-4">
                    {article.summary || article.content.substring(0, 200).replace(/<[^>]*>/g, '')}...
                  </p>
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(article.published_at || article.created_at).toLocaleDateString('vi-VN')}
                    </span>
                    <span className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      {article.view_count} lượt xem
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
