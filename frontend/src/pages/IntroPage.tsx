import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../lib/api';
import { Page } from '../types/api';

export default function IntroPage() {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPage = async () => {
      if (!slug) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await apiClient.v1PagesDetail({ slug });
        setPage(response.data.data);
        
        // Update page title and meta tags
        if (response.data.data.seo_title) {
          document.title = response.data.data.seo_title;
        } else {
          document.title = `${response.data.data.title} - Portal 365`;
        }
        
        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (response.data.data.seo_description) {
          if (metaDescription) {
            metaDescription.setAttribute('content', response.data.data.seo_description);
          } else {
            const meta = document.createElement('meta');
            meta.name = 'description';
            meta.content = response.data.data.seo_description;
            document.head.appendChild(meta);
          }
        }
      } catch (err) {
        console.error('Error fetching page:', err);
        setError('Không thể tải nội dung trang. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error || 'Không tìm thấy trang'}
          </div>
          <Link to="/" className="inline-block mt-4 text-blue-600 hover:underline">
            ← Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-4" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link to="/" className="hover:text-blue-600">Trang chủ</Link>
            </li>
            <li>
              <span className="mx-2">/</span>
            </li>
            <li>
              <Link to="#" className="hover:text-blue-600">Giới thiệu</Link>
            </li>
            <li>
              <span className="mx-2">/</span>
            </li>
            <li className="text-gray-900 font-medium">{page.title}</li>
          </ol>
        </nav>

        {/* Hero Image */}
        {page.hero_image_url && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img 
              src={page.hero_image_url} 
              alt={page.title}
              className="w-full h-auto max-h-96 object-cover"
            />
          </div>
        )}

        {/* Page Header */}
        <header className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {page.title}
          </h1>
          <div className="text-sm text-gray-500">
            Cập nhật: {new Date(page.updated_at).toLocaleDateString('vi-VN')}
          </div>
        </header>

        {/* Page Content */}
        <article className="bg-white rounded-lg shadow-sm p-8">
          <div 
            className="prose prose-lg max-w-none
                       prose-headings:text-gray-900 prose-headings:font-bold
                       prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-6
                       prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-5
                       prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                       prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                       prose-img:rounded-lg prose-img:shadow-md
                       prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4
                       prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4
                       prose-li:mb-2"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </article>

        {/* Back to top button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ↑ Về đầu trang
          </button>
        </div>
      </div>
    </div>
  );
}
