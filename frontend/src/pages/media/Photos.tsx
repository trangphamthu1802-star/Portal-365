import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Images, Search, Eye, X, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import Header from '../../components/Header';
import DynamicNavbar from '../../components/DynamicNavbar';
import SiteFooter from '../../components/layout/SiteFooter';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getBreadcrumbs } from '../../config/navigation';
import { usePublicMediaItems } from '../../hooks/useApi';

const ITEMS_PER_PAGE = 24;

export default function MediaPhotos() {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  // Fetch images from API
  const { data, isLoading, error } = usePublicMediaItems({ 
    page: currentPage, 
    page_size: ITEMS_PER_PAGE,
    media_type: 'image'
  });

  const images = data?.data || [];
  const pagination = data?.pagination || { page: 1, page_size: ITEMS_PER_PAGE, total: 0, total_pages: 1 };

  // Get breadcrumbs from navigation config
  const breadcrumbs = getBreadcrumbs(location.pathname);

  // Filter images by search
  const filteredImages = images.filter((img: any) => 
    !searchQuery || 
    img.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    img.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
  };

  const showPrevious = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const showNext = () => {
    if (selectedImageIndex !== null && selectedImageIndex < filteredImages.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const selectedImage = selectedImageIndex !== null ? filteredImages[selectedImageIndex] : null;

  const handleDownloadImage = (img: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (img.url) {
      const link = document.createElement('a');
      link.href = `http://localhost:8080${img.url}`;
      link.download = img.title || 'image';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <Header />
      <DynamicNavbar />
      <Breadcrumbs items={breadcrumbs} />

      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
        {/* Header - Dark Theme */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <Images className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white">
              Thư viện ảnh
            </h1>
          </div>
          <p className="text-xl text-gray-300">
            Album ảnh các hoạt động, sự kiện • <span className="text-yellow-400 font-bold">{pagination.total} ảnh</span>
          </p>
        </div>

        {/* Search - Modern Design */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm ảnh..."
              className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <LoadingSpinner />
            <p className="text-gray-400 mt-6 text-lg">Đang tải ảnh...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <Images className="w-20 h-20 text-red-400 mx-auto mb-6" />
            <p className="text-red-400 text-lg">Không thể tải dữ liệu. Vui lòng thử lại.</p>
          </div>
        ) : filteredImages.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {filteredImages.map((img: any, index: number) => (
                <div 
                  key={img.id} 
                  className="group relative aspect-square bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <img
                    src={img.url ? `http://localhost:8080${img.url}` : 'https://via.placeholder.com/400'}
                    alt={img.title}
                    className="w-full h-full object-cover cursor-pointer"
                    loading="lazy"
                    onClick={() => openLightbox(index)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h4 className="text-white font-bold text-sm mb-1 line-clamp-2">{img.title}</h4>
                      {img.description && (
                        <p className="text-gray-300 text-xs line-clamp-1 mb-3">{img.description}</p>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => openLightbox(index)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          Xem
                        </button>
                        <button
                          onClick={(e) => handleDownloadImage(img, e)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Tải
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.total_pages}
              onPageChange={setCurrentPage}
            />
          </>
        ) : (
          <div className="text-center py-20">
            <Images className="w-20 h-20 text-gray-600 mx-auto mb-6" />
            <p className="text-gray-400 text-lg mb-2">Không tìm thấy ảnh nào</p>
            <p className="text-gray-500">Thử tìm kiếm với từ khóa khác</p>
          </div>
        )}
      </main>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all z-10"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {selectedImageIndex! > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); showPrevious(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all z-10"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
          )}

          {selectedImageIndex! < filteredImages.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); showNext(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all z-10"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          )}

          <div className="max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage.url ? `http://localhost:8080${selectedImage.url}` : 'https://via.placeholder.com/1200'}
              alt={selectedImage.title}
              className="w-full h-auto max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mt-4">
              <h3 className="text-2xl font-bold text-white mb-2">{selectedImage.title}</h3>
              {selectedImage.description && (
                <p className="text-gray-300 mb-4">{selectedImage.description}</p>
              )}
              <div className="flex items-center gap-4">
                <a
                  href={selectedImage.url ? `http://localhost:8080${selectedImage.url}` : '#'}
                  download
                  className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Download className="w-5 h-5" />
                  Tải xuống
                </a>
                <span className="text-gray-400 text-sm">
                  Ảnh {selectedImageIndex! + 1} / {filteredImages.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}
