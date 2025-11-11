import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Play, Search, Eye, Clock, Download } from 'lucide-react';
import Header from '../../components/Header';
import DynamicNavbar from '../../components/DynamicNavbar';
import SiteFooter from '../../components/layout/SiteFooter';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import { getBreadcrumbs } from '../../config/navigation';
import { usePublicMediaItems } from '../../hooks/useApi';

const ITEMS_PER_PAGE = 12;

export default function MediaVideos() {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [playingVideo, setPlayingVideo] = useState<any>(null);

  // Fetch videos from API
  const { data, isLoading, error } = usePublicMediaItems({ 
    page: currentPage, 
    page_size: ITEMS_PER_PAGE,
    media_type: 'video'
  });

  const videos = data?.data || [];
  const pagination = data?.pagination || { page: 1, page_size: ITEMS_PER_PAGE, total: 0, total_pages: 1 };

  // Get breadcrumbs from navigation config
  const breadcrumbs = getBreadcrumbs(location.pathname);

  // Filter videos by search
  const filteredVideos = videos.filter((video: any) => 
    !searchQuery || 
    video.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDownloadVideo = (video: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (video.url) {
      const link = document.createElement('a');
      link.href = `http://localhost:8080${video.url}`;
      link.download = video.title || 'video';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <DynamicNavbar />
      <Breadcrumbs items={breadcrumbs} />

      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Thư viện video
          </h1>
          <p className="text-gray-600">
            Video về các hoạt động, sự kiện ({pagination.total} videos)
          </p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm video..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <LoadingSpinner />
            <p className="text-gray-600 mt-4">Đang tải video...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <Play className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <p className="text-red-600">Không thể tải dữ liệu. Vui lòng thử lại.</p>
          </div>
        ) : filteredVideos.length > 0 ? (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredVideos.map((video: any) => (
                <div 
                  key={video.id} 
                  className="group bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden cursor-pointer"
                  onClick={() => setPlayingVideo(video)}
                >
                  <div className="relative aspect-video bg-gray-900">
                    {video.url ? (
                      <>
                        <video
                          src={`http://localhost:8080${video.url}#t=0.1`}
                          className="w-full h-full object-cover"
                          preload="metadata"
                          muted
                          playsInline
                          onLoadedData={(e) => {
                            const videoEl = e.currentTarget as HTMLVideoElement;
                            videoEl.currentTime = 0.1;
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                            <Play className="w-8 h-8 text-green-600 ml-1" fill="currentColor" />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-800">
                        <Play className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    {video.duration && (
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {formatDuration(video.duration)}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {video.title}
                    </h3>
                    {video.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {video.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      {video.view_count !== undefined && (
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {video.view_count.toLocaleString()} lượt xem
                        </span>
                      )}
                      {video.published_at && (
                        <span>
                          {new Date(video.published_at).toLocaleDateString('vi-VN')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {pagination.total_pages > 1 && (
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.total_pages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Play className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {searchQuery ? 'Không tìm thấy video phù hợp' : 'Chưa có video nào'}
            </p>
          </div>
        )}
      </main>

      {/* Video Player Modal */}
      {playingVideo && (
        <Modal
          isOpen={true}
          onClose={() => setPlayingVideo(null)}
          title={playingVideo.title}
        >
          <div className="w-full">
            <div className="aspect-video bg-black">
              {playingVideo.url ? (
                <video
                  src={`http://localhost:8080${playingVideo.url}`}
                  controls
                  autoPlay
                  className="w-full h-full"
                >
                  Trình duyệt của bạn không hỗ trợ phát video.
                </video>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  <p>Video không khả dụng</p>
                </div>
              )}
            </div>
            {playingVideo.description && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Mô tả</h4>
                <p className="text-gray-600">{playingVideo.description}</p>
              </div>
            )}
            {playingVideo.url && (
              <div className="mt-4">
                <button
                  onClick={(e) => handleDownloadVideo(playingVideo, e)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Tải video về
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}

      <SiteFooter />
    </div>
  );
}
