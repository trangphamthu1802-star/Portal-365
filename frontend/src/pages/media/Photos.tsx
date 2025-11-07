import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Images } from 'lucide-react';
import Header from '../../components/Header';
import DynamicNavbar from '../../components/DynamicNavbar';
import SiteFooter from '../../components/layout/SiteFooter';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import Pagination from '../../components/common/Pagination';
import AlbumCard from '../../components/cards/AlbumCard';
import { getBreadcrumbs } from '../../config/navigation';

// Dummy albums data
const DUMMY_ALBUMS = [
  {
    id: 1,
    title: 'Diễn tập phòng thủ khu vực 2025',
    slug: 'dien-tap-phong-thu-khu-vuc-2025',
    cover_url: 'https://picsum.photos/seed/album1/800/600',
    photo_count: 48,
    created_at: '2025-01-15T09:00:00Z'
  },
  {
    id: 2,
    title: 'Hội thao quân sự Sư đoàn 365',
    slug: 'hoi-thao-quan-su-su-doan-365',
    cover_url: 'https://picsum.photos/seed/album2/800/600',
    photo_count: 32,
    created_at: '2025-01-14T10:00:00Z'
  }
];

const ITEMS_PER_PAGE = 12;

export default function MediaPhotos() {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);

  // Get breadcrumbs from navigation config
  const breadcrumbs = getBreadcrumbs(location.pathname);

  const totalPages = Math.ceil(DUMMY_ALBUMS.length / ITEMS_PER_PAGE);
  const paginatedAlbums = DUMMY_ALBUMS.slice(
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
            Thư viện ảnh
          </h1>
          <p className="text-gray-600">
            Album ảnh các hoạt động, sự kiện của Sư đoàn 365
          </p>
        </div>

        {paginatedAlbums.length > 0 ? (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {paginatedAlbums.map((album) => (
                <AlbumCard key={album.id} album={album} />
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
            <Images className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Chưa có album nào</p>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
