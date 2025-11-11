import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import Header from '../components/Header';
import DynamicNavbar from '../components/DynamicNavbar';
import Footer from '../components/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <DynamicNavbar />

      <main className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-gray-300">404</h1>
            <h2 className="text-3xl font-bold text-gray-900 mt-4 mb-2">
              Không tìm thấy trang
            </h2>
            <p className="text-gray-600 text-lg">
              Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              <Home className="w-5 h-5" />
              Về trang chủ
            </Link>
            <Link
              to="/search"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl border border-gray-300"
            >
              <Search className="w-5 h-5" />
              Tìm kiếm
            </Link>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <Link
              to="/gioi-thieu/lich-su-truyen-thong"
              className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200"
            >
              <h3 className="font-bold text-lg text-gray-900 mb-2">Giới thiệu</h3>
              <p className="text-gray-600 text-sm">Tìm hiểu về Sư đoàn 365</p>
            </Link>
            <Link
              to="/activities"
              className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200"
            >
              <h3 className="font-bold text-lg text-gray-900 mb-2">Hoạt động</h3>
              <p className="text-gray-600 text-sm">Các hoạt động nổi bật</p>
            </Link>
            <Link
              to="/news"
              className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200"
            >
              <h3 className="font-bold text-lg text-gray-900 mb-2">Tin tức</h3>
              <p className="text-gray-600 text-sm">Tin tức mới nhất</p>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
