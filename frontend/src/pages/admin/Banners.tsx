import { useState } from 'react';
import { Plus, Edit2, Trash2, ExternalLink, Eye, EyeOff } from 'lucide-react';
import { useAdminBanners, useCreateBanner, useUpdateBanner, useDeleteBanner, type Banner } from '../../hooks/useBanners';

const PLACEMENTS = [
  { value: 'banner-1', label: 'Banner 1' },
  { value: 'banner-2', label: 'Banner 2' },
  { value: 'home-middle', label: 'Trang chủ - Giữa' },
  { value: 'home-bottom', label: 'Trang chủ - Dưới cùng' },
  { value: 'article-top', label: 'Bài viết - Trên cùng' },
  { value: 'article-bottom', label: 'Bài viết - Dưới cùng' },
];

export default function AdminBanners() {
  const [selectedPlacement, setSelectedPlacement] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    placement: 'banner-1',
    link_url: '',
    is_active: true,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const { data, isLoading } = useAdminBanners({ placement: selectedPlacement || undefined });
  const createBanner = useCreateBanner();
  const updateBanner = useUpdateBanner();
  const deleteBanner = useDeleteBanner();

  const banners = data?.data || [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('placement', formData.placement);
    formDataToSend.append('link_url', formData.link_url);
    formDataToSend.append('is_active', formData.is_active.toString());

    if (selectedFile) {
      formDataToSend.append('file', selectedFile);
    }

    try {
      if (editingBanner) {
        await updateBanner.mutateAsync({ id: editingBanner.id, data: formDataToSend });
      } else {
        if (!selectedFile) {
          alert('Vui lòng chọn ảnh banner');
          return;
        }
        await createBanner.mutateAsync(formDataToSend);
      }

      // Reset form
      setFormData({ title: '', placement: 'banner-1', link_url: '', is_active: true });
      setSelectedFile(null);
      setPreviewUrl('');
      setEditingBanner(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error saving banner:', error);
      alert('Có lỗi xảy ra khi lưu banner');
    }
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      placement: banner.placement,
      link_url: banner.link_url || '',
      is_active: banner.is_active,
    });
    setPreviewUrl(banner.image_url);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa banner này?')) {
      try {
        await deleteBanner.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting banner:', error);
        alert('Có lỗi xảy ra khi xóa banner');
      }
    }
  };

  const handleCancel = () => {
    setFormData({ title: '', placement: 'home-middle', link_url: '', is_active: true });
    setSelectedFile(null);
    setPreviewUrl('');
    setEditingBanner(null);
    setShowForm(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý Banners</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Thêm Banner
        </button>
      </div>

      {/* Filter by placement */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Lọc theo vị trí</label>
        <select
          value={selectedPlacement}
          onChange={(e) => setSelectedPlacement(e.target.value)}
          className="w-64 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tất cả</option>
          {PLACEMENTS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            {editingBanner ? 'Chỉnh sửa Banner' : 'Thêm Banner mới'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiêu đề <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vị trí hiển thị <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.placement}
                onChange={(e) => setFormData({ ...formData, placement: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {PLACEMENTS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ảnh banner {!editingBanner && <span className="text-red-500">*</span>}
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                required={!editingBanner}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                Kích thước khuyến nghị: 1200x200px. Ảnh sẽ tự động resize về 1200x200px
              </p>
              {previewUrl && (
                <div className="mt-4">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-full h-auto border border-gray-300 rounded-lg"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Link URL (tùy chọn)</label>
              <input
                type="url"
                value={formData.link_url}
                onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                placeholder="https://example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="is_active" className="ml-2 text-sm font-medium text-gray-700">
                Kích hoạt
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={createBanner.isPending || updateBanner.isPending}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {editingBanner ? 'Cập nhật' : 'Tạo mới'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Banner list */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Đang tải...</div>
        ) : banners.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Chưa có banner nào</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hình ảnh</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tiêu đề</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vị trí</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Link</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {banners.map((banner) => (
                <tr key={banner.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <img
                      src={banner.image_url}
                      alt={banner.title}
                      className="h-16 w-auto object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{banner.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {PLACEMENTS.find((p) => p.value === banner.placement)?.label || banner.placement}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {banner.link_url ? (
                      <a
                        href={banner.link_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Link
                      </a>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {banner.is_active ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        <Eye className="w-3 h-3" />
                        Hiển thị
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                        <EyeOff className="w-3 h-3" />
                        Ẩn
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(banner)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Edit2 className="w-4 h-4 inline" />
                    </button>
                    <button
                      onClick={() => handleDelete(banner.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
