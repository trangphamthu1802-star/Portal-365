import { useState } from 'react';
import { Upload, Video, Image as ImageIcon, Trash2, Eye, Play, AlertCircle } from 'lucide-react';
import AdminLayout from '../../../components/admin/AdminLayout';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { useAdminMediaList, useUploadMedia, useDeleteMedia } from '../../../hooks/admin/useAdminMedia';
import { AxiosError } from 'axios';

type MediaTab = 'images' | 'videos';

interface MediaItem {
  id: number;
  media_type: 'image' | 'video';
  title: string;
  file_path: string;
  thumbnail_url?: string;
  description?: string;
  width?: number;
  height?: number;
  file_size: number;
  created_at: string;
}

export default function MediaList() {
  const [activeTab, setActiveTab] = useState<MediaTab>('images');
  const [page, setPage] = useState(1);

  // Fetch media items from ADMIN API
  const { data, isLoading, isError, error, refetch } = useAdminMediaList({ 
    page, 
    page_size: 24,
    media_type: activeTab === 'images' ? 'image' : 'video'
  });
  const uploadMutation = useUploadMedia();
  const deleteMutation = useDeleteMedia();

  const mediaItems: MediaItem[] = data?.data || [];
  const pagination = data?.pagination || { page: 1, page_size: 24, total: 0, total_pages: 0 };

  // Debug logging
  console.log('Admin Media Debug:', {
    activeTab,
    isLoading,
    isError,
    error: error ? {
      message: (error as AxiosError).message,
      status: (error as AxiosError).response?.status,
      data: (error as AxiosError).response?.data
    } : null,
    dataReceived: !!data,
    mediaItemsCount: mediaItems.length,
    pagination,
    rawData: data
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = activeTab === 'images';
    const allowedTypes = isImage 
      ? ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
      : ['video/mp4', 'video/webm', 'video/ogg'];
    
    if (!allowedTypes.includes(file.type)) {
      alert(isImage ? 'Chỉ hỗ trợ ảnh JPG, PNG, WebP, GIF' : 'Chỉ hỗ trợ video MP4, WebM, OGG');
      return;
    }

    const maxSize = isImage ? 5 * 1024 * 1024 : 100 * 1024 * 1024;
    if (file.size > maxSize) {
      alert(isImage ? 'Ảnh không được vượt quá 5MB' : 'Video không được vượt quá 100MB');
      return;
    }

    try {
      await uploadMutation.mutateAsync({
        file,
        title: file.name.replace(/\.[^/.]+$/, ''),
        category_id: isImage ? 18 : 19, // 18: Thư viện ảnh, 19: Thư viện video
        media_type: isImage ? 'image' : 'video'
      });
      alert('Upload thành công!');
      e.target.value = '';
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || err.message || 'Upload thất bại';
      alert(`Lỗi: ${errorMessage}`);
      console.error('Upload error:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(`Xóa ${activeTab === 'images' ? 'ảnh' : 'video'} này?`)) return;
    try {
      await deleteMutation.mutateAsync(id);
      alert('Xóa thành công!');
    } catch (err: any) {
      alert(err.message || 'Xóa thất bại');
    }
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
            <p className="text-gray-600 mt-1">Quản lý ảnh và video</p>
          </div>
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
            <Upload className="w-5 h-5" />
            {uploadMutation.isPending ? 'Đang tải lên...' : `Upload ${activeTab === 'images' ? 'ảnh' : 'video'}`}
            <input
              type="file"
              accept={activeTab === 'images' ? 'image/*' : 'video/*'}
              onChange={handleFileUpload}
              disabled={uploadMutation.isPending}
              className="hidden"
            />
          </label>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => {
                setActiveTab('images');
                setPage(1);
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                activeTab === 'images'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <ImageIcon className="w-5 h-5" />
              Ảnh ({pagination.total})
            </button>
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
              Videos ({pagination.total})
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <LoadingSpinner />
            </div>
          ) : isError ? (
            <div className="p-8">
              <div className="max-w-md mx-auto text-center">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Không thể tải dữ liệu
                </h3>
                <p className="text-gray-600 mb-4">
                  {(error as AxiosError)?.response?.status === 401 
                    ? 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
                    : (error as AxiosError)?.response?.status === 403
                    ? 'Bạn không có quyền truy cập trang này.'
                    : 'Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại.'}
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => refetch()}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Thử lại
                  </button>
                  {/* Do not manually redirect to /login. Let axios handle token refresh and redirect. */}
                </div>
              </div>
            </div>
          ) : activeTab === 'videos' ? (
            // Videos Tab
            mediaItems.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Video className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="mb-2">Chưa có video nào</p>
                <p className="text-sm">Upload video đầu tiên của bạn</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {mediaItems.map((video) => (
                  <div key={video.id} className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative aspect-video bg-gray-900">
                      {video.thumbnail_url ? (
                        <img
                          src={`http://localhost:8080${video.thumbnail_url}`}
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
                          href={`http://localhost:8080${video.file_path}`}
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
                      {video.description && (
                        <p className="text-sm text-gray-500 line-clamp-2 mb-2">{video.description}</p>
                      )}
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{formatFileSize(video.file_size)}</span>
                        <span>{new Date(video.created_at).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                        <a
                          href={`http://localhost:8080${video.file_path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 text-center px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                          <Eye className="w-4 h-4 inline mr-1" />
                          Xem
                        </a>
                        <button
                          onClick={() => handleDelete(video.id)}
                          disabled={deleteMutation.isPending}
                          className="flex-1 text-center px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4 inline mr-1" />
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            // Images Tab
            mediaItems.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="mb-2">Chưa có ảnh nào</p>
                <p className="text-sm">Upload ảnh đầu tiên của bạn</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 p-6">
                {mediaItems.map((image) => (
                  <div key={image.id} className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <img
                      src={image.file_path ? `http://localhost:8080${image.file_path}` : 'https://via.placeholder.com/400'}
                      alt={image.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                        <a
                          href={image.file_path ? `http://localhost:8080${image.file_path}` : '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-white rounded-full hover:bg-gray-100"
                          title="Xem"
                        >
                          <Eye className="w-4 h-4 text-gray-700" />
                        </a>
                        <button
                          onClick={() => handleDelete(image.id)}
                          disabled={deleteMutation.isPending}
                          className="p-2 bg-white rounded-full hover:bg-gray-100 disabled:opacity-50"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-xs font-medium truncate">{image.title}</p>
                      <p className="text-white text-xs">{formatFileSize(image.file_size)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.total_pages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 rounded-b-lg">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Trước
              </button>
              <button
                onClick={() => setPage(Math.min(pagination.total_pages, page + 1))}
                disabled={page === pagination.total_pages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Sau
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Hiển thị <span className="font-medium">{(page - 1) * 24 + 1}</span> đến{' '}
                  <span className="font-medium">{Math.min(page * 24, pagination.total)}</span> trong{' '}
                  <span className="font-medium">{pagination.total}</span> {activeTab === 'images' ? 'ảnh' : 'video'}
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Trước
                  </button>
                  <button
                    onClick={() => setPage(Math.min(pagination.total_pages, page + 1))}
                    disabled={page === pagination.total_pages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Sau
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
