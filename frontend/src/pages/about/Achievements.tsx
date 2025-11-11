import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import DynamicNavbar from '../../components/DynamicNavbar';
import SiteFooter from '../../components/layout/SiteFooter';
import { apiClient } from '../../lib/apiClient';

interface IntroductionPage {
  key: string;
  title: string;
  content: string;
  group: string;
  sort_order: number;
  is_active: boolean;
  updated_at: string;
}

export default function Achievements() {
  const navigate = useNavigate();
  const [page, setPage] = useState<IntroductionPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get('/introduction/thanh-tich-don-vi')
      .then((res) => {
        setPage(res.data.data);
      })
      .catch((err) => {
        console.error('Error loading page:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <DynamicNavbar />
        <main className="container mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded w-2/3 mb-8"></div>
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <DynamicNavbar />
        <main className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Không tìm thấy trang</h1>
            <button
              onClick={() => navigate('/')}
              className="text-blue-600 hover:text-blue-700 underline"
            >
              Quay về trang chủ
            </button>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <DynamicNavbar />

      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-amber-600 to-yellow-600 rounded-2xl overflow-hidden mb-8 shadow-xl">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative px-8 py-16 md:py-20">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block mb-4">
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-red-600 text-white text-sm font-semibold">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Vinh quang Sư đoàn
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {page.title}
              </h1>
              <p className="text-xl text-yellow-100">
                Những thành tích vẻ vang trong sự nghiệp bảo vệ Tổ quốc
              </p>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F9FAFB"/>
            </svg>
          </div>
        </div>

        {/* Timeline Navigation */}
        <div className="mb-8 bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-center space-x-2 overflow-x-auto">
            <button 
              onClick={() => navigate('/gioi-thieu/lich-su-truyen-thong')}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 whitespace-nowrap"
            >
              Lịch sử hình thành
            </button>
            <span className="text-gray-300">→</span>
            <button 
              onClick={() => navigate('/gioi-thieu/to-chuc-don-vi')}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 whitespace-nowrap"
            >
              Tổ chức
            </button>
            <span className="text-gray-300">→</span>
            <button 
              onClick={() => navigate('/gioi-thieu/lanh-dao-su-doan')}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 whitespace-nowrap"
            >
              Lãnh đạo
            </button>
            <span className="text-gray-300">→</span>
            <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg font-medium whitespace-nowrap">
              Thành tích
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Content Column */}
          <div className="lg:col-span-2">
            <article className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-8 md:p-12">
                {/* Achievement Icon */}
                <div className="flex justify-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>

                {/* Content */}
                <div 
                  className="prose prose-lg max-w-none
                    prose-headings:text-gray-900 prose-headings:font-bold
                    prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-l-4 prose-h2:border-yellow-500 prose-h2:pl-4
                    prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-amber-800
                    prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                    prose-strong:text-gray-900 prose-strong:font-semibold
                    prose-ul:my-4
                    prose-ol:my-4
                    prose-li:text-gray-700 prose-li:my-2
                    prose-a:text-yellow-600 prose-a:no-underline hover:prose-a:underline
                    prose-blockquote:border-l-4 prose-blockquote:border-yellow-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600
                    prose-img:rounded-xl prose-img:shadow-lg prose-img:mx-auto
                    prose-table:border-collapse prose-table:w-full prose-table:my-8
                    prose-th:bg-yellow-50 prose-th:p-4 prose-th:text-left prose-th:font-bold prose-th:border prose-th:border-gray-300
                    prose-td:p-4 prose-td:border prose-td:border-gray-300 prose-td:align-top"
                  dangerouslySetInnerHTML={{ __html: page.content }}
                />
              </div>
            </article>

            {/* Last Updated */}
            <div className="mt-6 text-center text-sm text-gray-500">
              Cập nhật lần cuối: {new Date(page.updated_at).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Quick Links */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                  </svg>
                  Giới thiệu
                </h3>
                <nav className="space-y-2">
                  <a
                    href="/gioi-thieu/lich-su-truyen-thong"
                    className="block px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Lịch sử truyền thống
                  </a>
                  <a
                    href="/gioi-thieu/to-chuc-don-vi"
                    className="block px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cơ cấu tổ chức
                  </a>
                  <a
                    href="/gioi-thieu/lanh-dao-su-doan"
                    className="block px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Lãnh đạo chỉ huy Sư đoàn
                  </a>
                  <a
                    href="/gioi-thieu/thanh-tich-don-vi"
                    className="block px-4 py-3 bg-yellow-50 text-yellow-700 rounded-lg font-medium"
                  >
                    Thành tích đơn vị
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
