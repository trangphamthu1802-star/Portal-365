import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Upload, Video, Image as ImageIcon, Trash2, Edit, Eye, Play } from 'lucide-react';
import AdminLayout from '../../../components/admin/AdminLayout';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

type MediaTab = 'videos' | 'albums';

interface MediaItem {
  id: number;
  type: 'image' | 'video';
  title: string;
  url: string;
  thumbnail_url?: string;
  caption?: string;
  width?: number;
  height?: number;
  size: number;
  created_at: string;
}

interface Album {
  id: number;
  slug: string;
  title: string;
  description?: string;
  cover_media_id?: number;
  cover_url?: string;
  photo_count: number;
  created_at: string;
}

export default function MediaList() {
  const [activeTab, setActiveTab] = useState<MediaTab>('videos');
  const [isUploading, setIsUploading] = useState(false);
  const [page, setPage] = useState(1);

  // TODO: Replace with actual API calls
  const isLoading = false;
  const error = null;
  const videos: MediaItem[] = [];
  const albums: Album[] = [];

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    if (!allowedTypes.includes(file.type)) {
      alert('Chỉ hỗ trợ video MP4, WebM, OGG');
      return;
    }

    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      alert('Video không được vượt quá 100MB');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'video');
      formData.append('title', file.name);
      
      // TODO: Implement upload API call
      console.log('Uploading video:', file.name);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Upload thành công!');
    } catch (err) {
      alert('Upload thất bại');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(`Xóa ${activeTab === 'videos' ? 'video' : 'album'} này?`)) return;
    // TODO: Implement delete
    console.log('Delete', id);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <AdminLayout title="Quản lý Media">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Thư viện Media</h1>
            <p className="text-gray-600 mt-1">Quản lý video và album ảnh</p>
          </div>
          {activeTab === 'videos' ? (
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
              <Upload className="w-5 h-5" />
              {isUploading ? 'Đang tải lên...' : 'Upload video'}
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>
          ) : (
            <Link
              to="/admin/media/albums/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <ImageIcon className="w-5 h-5" />
              Tạo album mới
            </Link>
          )}
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => {
                setActiveTab('videos');
                setPage(1);
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                activeTab === 'videos'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Video className="w-5 h-5" />
              Videos
            </button>
            <button
              onClick={() => {
                setActiveTab('albums');
                setPage(1);
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                activeTab === 'albums'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <ImageIcon className="w-5 h-5" />
              Albums
            </button>
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'videos' ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center">
                <LoadingSpinner />
              </div>
            ) : error ? (
              <div className="p-8 text-center text-red-600">
                Không thể tải dữ liệu. Vui lòng thử lại.
              </div>
            ) : videos.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Video className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="mb-2">Chưa có video nào</p>
                <p className="text-sm">Upload video đầu tiên của bạn</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {videos.map((video) => (
                  <div key={video.id} className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative aspect-video bg-gray-900">
                      {video.thumbnail_url ? (
                        <img
                          src={video.thumbnail_url}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Play className="w-16 h-16 text-white opacity-50" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all flex items-center justify-center">
                        <a
                          href={video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="opacity-0 hover:opacity-100 transition-opacity"
                        >
                          <Play className="w-12 h-12 text-white" />
                        </a>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 truncate mb-1">{video.title}</h3>
                      {video.caption && (
                        <p className="text-sm text-gray-500 line-clamp-2 mb-2">{video.caption}</p>
                      )}
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{formatFileSize(video.size)}</span>
                        <span>{new Date(video.created_at).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                        <Link
                          to={`/admin/media/videos/${video.id}/edit`}
                          className="flex-1 text-center px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded transition-colors"
                        >
                          <Edit className="w-4 h-4 inline mr-1" />
                          Sửa
                        </Link>
                        <button
                          onClick={() => handleDelete(video.id)}
                          className="flex-1 text-center px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4 inline mr-1" />
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center">
                <LoadingSpinner />
              </div>
            ) : error ? (
              <div className="p-8 text-center text-red-600">
                Không thể tải dữ liệu. Vui lòng thử lại.
              </div>
            ) : albums.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="mb-2">Chưa có album nào</p>
                <p className="text-sm">Tạo album đầu tiên của bạn</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {albums.map((album) => (
                  <div key={album.id} className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <Link to={`/admin/media/albums/${album.id}`}>
                      <div className="relative aspect-video bg-gray-200">
                        {album.cover_url ? (
                          <img
                            src={album.cover_url}
                            alt={album.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-16 h-16 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                          <p className="text-white text-sm font-medium">
                            {album.photo_count} ảnh
                          </p>
                        </div>
                      </div>
                    </Link>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 truncate mb-1">{album.title}</h3>
                      {album.description && (
                        <p className="text-sm text-gray-500 line-clamp-2 mb-2">{album.description}</p>
                      )}
                      <div className="text-xs text-gray-400 mb-3">
                        {new Date(album.created_at).toLocaleDateString('vi-VN')}
                      </div>
                      <div className="flex items-center gap-2 pt-3 border-t">
                        <Link
                          to={`/admin/media/albums/${album.id}`}
                          className="flex-1 text-center px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                          <Eye className="w-4 h-4 inline mr-1" />
                          Xem
                        </Link>
                        <Link
                          to={`/admin/media/albums/${album.id}/edit`}
                          className="flex-1 text-center px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded transition-colors"
                        >
                          <Edit className="w-4 h-4 inline mr-1" />
                          Sửa
                        </Link>
                        <button
                          onClick={() => handleDelete(album.id)}
                          className="flex-1 text-center px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4 inline mr-1" />
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
