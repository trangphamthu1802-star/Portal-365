import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Header from '../components/Header';
import DynamicNavbar from '../components/DynamicNavbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import { apiClient } from '../lib/apiClient';
import { Page } from '../types/models';
import { Home, ChevronRight, Calendar, Eye, BookOpen } from 'lucide-react';

const INTRO_MENU = [
  { title: 'Lịch sử truyền thống', slug: 'history', key: 'history', icon: '🏛️', color: 'from-blue-600 to-blue-700' },
  { title: 'Tổ chức đơn vị', slug: 'organization', key: 'organization', icon: '🏢', color: 'from-green-600 to-green-700' },
  { title: 'Lãnh đạo Sư đoàn', slug: 'leadership', key: 'leadership', icon: '👥', color: 'from-purple-600 to-purple-700' },
  { title: 'Thành tích đơn vị', slug: 'achievements', key: 'achievements', icon: '🏆', color: 'from-yellow-600 to-yellow-700' },
];

export default function Intro() {
  const { slug } = useParams<{ slug: string }>();
  const currentPage = INTRO_MENU.find(item => item.slug === slug);

  const { data: page, isLoading, error } = useQuery<Page>({
    queryKey: ['intro-page', currentPage?.key],
    queryFn: async () => {
      if (!currentPage?.key) throw new Error('Invalid page');
      const response = await apiClient.get(`/introduction/${currentPage.key}`);
      return response.data.data;
    },
    enabled: !!currentPage?.key,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <DynamicNavbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mb-4"></div>
            <p className="text-gray-600 text-lg font-medium">Đang tải nội dung...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <DynamicNavbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="bg-white rounded-lg shadow-lg p-12">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Không tìm thấy trang</h1>
            <p className="text-gray-600 mb-6">Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-md"
            >
              <Home className="w-5 h-5" />
              Về trang chủ
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <DynamicNavbar />

      {/* Breadcrumb Navigation - Styled like a news portal */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 shadow-md border-b-4 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-white">
            <Link to="/" className="flex items-center hover:text-yellow-300 transition-colors font-medium">
              <Home className="w-4 h-4 mr-1" />
              <span>Trang chủ</span>
            </Link>
            <ChevronRight className="w-4 h-4 text-blue-300" />
            <span className="text-blue-200">Giới thiệu</span>
            <ChevronRight className="w-4 h-4 text-blue-300" />
            <span className="text-yellow-300 font-semibold">{currentPage?.title}</span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Main Content with Sidebar - Layout giống Home */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Area - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Page Header Card */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Colored Header Bar */}
              <div className={`bg-gradient-to-r ${currentPage?.color || 'from-green-600 to-green-700'} px-6 py-5`}>
                <div className="flex items-center gap-4">
                  <span className="text-5xl filter drop-shadow-lg">{currentPage?.icon}</span>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-wide">
                      {page.title}
                    </h1>
                    <p className="text-blue-100 text-sm mt-1">Sư đoàn Phòng không 361</p>
                  </div>
                </div>
              </div>

              {/* Meta Information Bar */}
              <div className="bg-gray-50 px-6 py-3 border-b-2 border-gray-200">
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">
                      Cập nhật: <span className="text-gray-900">{new Date(page.updated_at).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</span>
                    </span>
                  </div>
                  {page.view_count > 0 && (
                    <>
                      <span className="text-gray-300">|</span>
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-green-600" />
                        <span className="font-medium">
                          <span className="text-gray-900">{page.view_count.toLocaleString()}</span> lượt xem
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Main Content Area - Nội dung từ API */}
              <article className="px-6 py-8">
                {/* SEO Description nếu có */}
                {page.seo_description && (
                  <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6 rounded">
                    <p className="text-gray-700 italic text-lg leading-relaxed">
                      {page.seo_description}
                    </p>
                  </div>
                )}

                {/* Nội dung HTML từ backend - Styled với Tailwind Typography */}
                <div 
                  className="prose prose-lg max-w-none
                    prose-headings:text-gray-900 prose-headings:font-bold
                    prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-8 prose-h1:border-b-4 prose-h1:border-green-600 prose-h1:pb-3 prose-h1:uppercase
                    prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-8 prose-h2:text-blue-900 prose-h2:border-l-4 prose-h2:border-blue-600 prose-h2:pl-4
                    prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-6 prose-h3:text-gray-800
                    prose-h4:text-lg prose-h4:mb-2 prose-h4:mt-4 prose-h4:text-gray-700
                    prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4 prose-p:text-justify
                    prose-a:text-blue-600 prose-a:font-medium prose-a:no-underline hover:prose-a:text-blue-800 hover:prose-a:underline
                    prose-strong:text-gray-900 prose-strong:font-bold
                    prose-em:text-gray-800 prose-em:italic
                    prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
                    prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
                    prose-li:text-gray-700 prose-li:mb-2 prose-li:leading-relaxed
                    prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8 prose-img:border-4 prose-img:border-gray-200
                    prose-figcaption:text-center prose-figcaption:text-sm prose-figcaption:text-gray-600 prose-figcaption:mt-2 prose-figcaption:italic
                    prose-blockquote:border-l-4 prose-blockquote:border-green-600 prose-blockquote:pl-6 prose-blockquote:pr-4 prose-blockquote:py-2 prose-blockquote:bg-green-50 prose-blockquote:italic prose-blockquote:text-gray-700 prose-blockquote:rounded-r
                    prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:text-red-600 prose-code:font-mono
                    prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto
                    prose-table:border-collapse prose-table:w-full prose-table:my-6 prose-table:shadow-md
                    prose-thead:bg-gradient-to-r prose-thead:from-green-600 prose-thead:to-green-700
                    prose-th:text-white prose-th:font-bold prose-th:p-3 prose-th:text-left prose-th:border prose-th:border-green-500
                    prose-td:border prose-td:border-gray-300 prose-td:p-3 prose-td:bg-white
                    prose-tr:even:bg-gray-50
                    prose-hr:border-t-2 prose-hr:border-gray-300 prose-hr:my-8
                  "
                  dangerouslySetInnerHTML={{ __html: page.content }}
                />
              </article>
            </div>

            {/* Quick Links Section - Các trang giới thiệu khác */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-6 py-4 border-b-2 border-green-600">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-green-600" />
                  <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">
                    Tìm hiểu thêm về Sư đoàn
                  </h2>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {INTRO_MENU.filter(item => item.slug !== slug).map((item) => (
                    <Link
                      key={item.slug}
                      to={`/intro/${item.slug}`}
                      className="group flex items-start gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-green-600 hover:shadow-md transition-all duration-200"
                    >
                      <span className="text-4xl group-hover:scale-110 transition-transform flex-shrink-0">
                        {item.icon}
                      </span>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors mb-1">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-500 group-hover:text-green-700">
                          Tìm hiểu chi tiết →
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - 1/3 width - Giống như trang Home */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <Sidebar />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

