import { Play } from 'lucide-react';

interface Video {
  id: number;
  title: string;
  thumbnail_url?: string;
  duration?: number;
  view_count?: number;
  published_at: string;
}

interface VideoCardProps {
  video: Video;
  onClick: () => void;
}

export default function VideoCard({ video, onClick }: VideoCardProps) {
  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
    <button
      onClick={onClick}
      className="group block w-full text-left bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      <div className="relative aspect-video overflow-hidden bg-gray-900">
        <img
          src={video.thumbnail_url || `https://picsum.photos/seed/${video.id}/640/360`}
          alt={video.title}
          loading="lazy"
          width={640}
          height={360}
          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-black/60 flex items-center justify-center group-hover:bg-green-600 group-hover:scale-110 transition-all">
            <Play className="w-8 h-8 text-white fill-current" />
          </div>
        </div>
        {video.duration && (
          <span className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs font-semibold rounded">
            {formatDuration(video.duration)}
          </span>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-2 group-hover:text-green-700 transition-colors">
          {video.title}
        </h3>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{formatDate(video.published_at)}</span>
          {video.view_count !== undefined && (
            <span>{video.view_count.toLocaleString()} lượt xem</span>
          )}
        </div>
      </div>
    </button>
  );
}
