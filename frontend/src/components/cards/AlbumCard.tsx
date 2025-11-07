import { Link } from 'react-router-dom';
import { Images } from 'lucide-react';

interface Album {
  id: number;
  title: string;
  slug: string;
  cover_url?: string;
  photo_count?: number;
  created_at: string;
}

interface AlbumCardProps {
  album: Album;
}

export default function AlbumCard({ album }: AlbumCardProps) {
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return '';
    }
  };

  return (
    <Link
      to={`/media/photos/${album.slug}`}
      className="group block bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
        <img
          src={album.cover_url || `https://picsum.photos/seed/${album.id}/800/600`}
          alt={album.title}
          loading="lazy"
          width={800}
          height={600}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <p className="text-sm font-medium">Xem album</p>
          </div>
        </div>
        {album.photo_count !== undefined && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-black/70 text-white text-xs font-semibold rounded flex items-center gap-1">
            <Images className="w-3 h-3" />
            {album.photo_count}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-green-700 transition-colors">
          {album.title}
        </h3>
        <p className="text-xs text-gray-500">{formatDate(album.created_at)}</p>
      </div>
    </Link>
  );
}
