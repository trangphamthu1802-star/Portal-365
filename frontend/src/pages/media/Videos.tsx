import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Play } from 'lucide-react';
import Header from '../../components/Header';
import DynamicNavbar from '../../components/DynamicNavbar';
import SiteFooter from '../../components/layout/SiteFooter';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import Pagination from '../../components/common/Pagination';
import VideoCard from '../../components/cards/VideoCard';
import Modal from '../../components/common/Modal';
import { getBreadcrumbs } from '../../config/navigation';

// Dummy videos data
const DUMMY_VIDEOS = [
  {
    id: 1,
    title: 'Lễ khai mạc diễn tập khu vực phòng thủ Sư đoàn 365',
    thumbnail_url: 'https://picsum.photos/seed/video1/640/360',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: 1245,
    view_count: 15234,
    published_at: '2025-01-15T09:00:00Z'
  },
  {
    id: 2,
    title: 'Hội thao quân sự Sư đoàn 365 năm 2025',
    thumbnail_url: 'https://picsum.photos/seed/video2/640/360',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: 890,
    view_count: 12567,
    published_at: '2025-01-14T10:00:00Z'
  }
];

const ITEMS_PER_PAGE = 12;

export default function MediaVideos() {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [playingVideo, setPlayingVideo] = useState<typeof DUMMY_VIDEOS[0] | null>(null);

  // Get breadcrumbs from navigation config
  const breadcrumbs = getBreadcrumbs(location.pathname);

  const totalPages = Math.ceil(DUMMY_VIDEOS.length / ITEMS_PER_PAGE);
  const paginatedVideos = DUMMY_VIDEOS.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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
            Video về các hoạt động, sự kiện của Sư đoàn 365
          </p>
        </div>

        {paginatedVideos.length > 0 ? (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {paginatedVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onClick={() => setPlayingVideo(video)}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Play className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Chưa có video nào</p>
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
          <div className="w-full aspect-video">
            <iframe
              src={playingVideo.video_url}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={playingVideo.title}
            />
          </div>
        </Modal>
      )}

      <SiteFooter />
    </div>
  );
}
