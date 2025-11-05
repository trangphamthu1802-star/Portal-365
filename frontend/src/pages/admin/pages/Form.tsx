import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../lib/api';
import type { Page, SuccessResponse, CreatePageRequest, UpdatePageRequest } from '../../../types/api';

export default function PageForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    group: 'introduction',
    content: '',
    status: 'draft' as 'draft' | 'published',
    order: 1,
    hero_image_url: '',
    seo_title: '',
    seo_description: '',
    is_active: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Fetch page if editing
  const { data: pageData } = useQuery({
    queryKey: ['admin-page', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await apiClient.get<SuccessResponse<Page>>(`/admin/pages/${id}`);
      return response.data.data;
    },
    enabled: isEdit,
  });

  useEffect(() => {
    if (pageData) {
      setFormData({
        title: pageData.title,
        slug: pageData.slug,
        group: pageData.group,
        content: pageData.content,
        status: pageData.status,
        order: pageData.order,
        hero_image_url: pageData.hero_image_url || '',
        seo_title: pageData.seo_title || '',
        seo_description: pageData.seo_description || '',
        is_active: pageData.is_active,
      });
    }
  }, [pageData]);

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    const vietnameseMap: Record<string, string> = {
      'à': 'a', 'á': 'a', 'ạ': 'a', 'ả': 'a', 'ã': 'a', 'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ậ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ặ': 'a', 'ẳ': 'a', 'ẵ': 'a',
      'è': 'e', 'é': 'e', 'ẹ': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ê': 'e', 'ề': 'e', 'ế': 'e', 'ệ': 'e', 'ể': 'e', 'ễ': 'e',
      'ì': 'i', 'í': 'i', 'ị': 'i', 'ỉ': 'i', 'ĩ': 'i',
      'ò': 'o', 'ó': 'o', 'ọ': 'o', 'ỏ': 'o', 'õ': 'o', 'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ộ': 'o', 'ổ': 'o', 'ỗ': 'o', 'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ợ': 'o', 'ở': 'o', 'ỡ': 'o',
      'ù': 'u', 'ú': 'u', 'ụ': 'u', 'ủ': 'u', 'ũ': 'u', 'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ự': 'u', 'ử': 'u', 'ữ': 'u',
      'ỳ': 'y', 'ý': 'y', 'ỵ': 'y', 'ỷ': 'y', 'ỹ': 'y',
      'đ': 'd',
      'À': 'A', 'Á': 'A', 'Ạ': 'A', 'Ả': 'A', 'Ã': 'A', 'Â': 'A', 'Ầ': 'A', 'Ấ': 'A', 'Ậ': 'A', 'Ẩ': 'A', 'Ẫ': 'A', 'Ă': 'A', 'Ằ': 'A', 'Ắ': 'A', 'Ặ': 'A', 'Ẳ': 'A', 'Ẵ': 'A',
      'È': 'E', 'É': 'E', 'Ẹ': 'E', 'Ẻ': 'E', 'Ẽ': 'E', 'Ê': 'E', 'Ề': 'E', 'Ế': 'E', 'Ệ': 'E', 'Ể': 'E', 'Ễ': 'E',
      'Ì': 'I', 'Í': 'I', 'Ị': 'I', 'Ỉ': 'I', 'Ĩ': 'I',
      'Ò': 'O', 'Ó': 'O', 'Ọ': 'O', 'Ỏ': 'O', 'Õ': 'O', 'Ô': 'O', 'Ồ': 'O', 'Ố': 'O', 'Ộ': 'O', 'Ổ': 'O', 'Ỗ': 'O', 'Ơ': 'O', 'Ờ': 'O', 'Ớ': 'O', 'Ợ': 'O', 'Ở': 'O', 'Ỡ': 'O',
      'Ù': 'U', 'Ú': 'U', 'Ụ': 'U', 'Ủ': 'U', 'Ũ': 'U', 'Ư': 'U', 'Ừ': 'U', 'Ứ': 'U', 'Ự': 'U', 'Ử': 'U', 'Ữ': 'U',
      'Ỳ': 'Y', 'Ý': 'Y', 'Ỵ': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y',
      'Đ': 'D'
    };
    
    let str = title.trim();
    Object.keys(vietnameseMap).forEach(key => {
      str = str.replace(new RegExp(key, 'g'), vietnameseMap[key]);
    });
    
    return str
      .toLowerCase()
      .replace(/[^a-z0-9\s-/]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: !isEdit || !pageData ? generateSlug(title) : prev.slug,
    }));
  };

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: CreatePageRequest) => {
      const response = await apiClient.post<SuccessResponse<Page>>('/admin/pages', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pages'] });
      setToast({ message: 'Đã tạo trang thành công', type: 'success' });
      setTimeout(() => navigate('/admin/pages'), 1500);
    },
    onError: (error: any) => {
      const errMsg = error.response?.data?.error?.message || 'Lỗi khi tạo trang';
      setToast({ message: errMsg, type: 'error' });
      if (error.response?.data?.error?.details) {
        setErrors(error.response.data.error.details);
      }
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: UpdatePageRequest) => {
      const response = await apiClient.put<SuccessResponse<Page>>(`/admin/pages/${id}`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pages'] });
      queryClient.invalidateQueries({ queryKey: ['admin-page', id] });
      setToast({ message: 'Đã cập nhật trang', type: 'success' });
      setTimeout(() => navigate('/admin/pages'), 1500);
    },
    onError: (error: any) => {
      const errMsg = error.response?.data?.error?.message || 'Lỗi khi cập nhật trang';
      setToast({ message: errMsg, type: 'error' });
      if (error.response?.data?.error?.details) {
        setErrors(error.response.data.error.details);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const payload: any = {
      title: formData.title,
      slug: formData.slug,
      group: formData.group,
      content: formData.content,
      status: formData.status,
      order: formData.order,
    };

    if (formData.hero_image_url) payload.hero_image_url = formData.hero_image_url;
    if (formData.seo_title) payload.seo_title = formData.seo_title;
    if (formData.seo_description) payload.seo_description = formData.seo_description;

    if (isEdit) {
      payload.is_active = formData.is_active;
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {toast && (
        <div className={`fixed top-4 right-4 px-6 py-3 rounded shadow-lg z-50 ${
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.message}
          <button onClick={() => setToast(null)} className="ml-4 font-bold">×</button>
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold">{isEdit ? 'Chỉnh sửa trang' : 'Tạo trang mới'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tiêu đề <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Slug <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            required
          />
          <p className="mt-1 text-xs text-gray-500">URL: /{formData.slug}</p>
          {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug}</p>}
        </div>

        {/* Group and Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nhóm <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.group}
              onChange={(e) => setFormData({ ...formData, group: e.target.value })}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="introduction">Giới thiệu</option>
              <option value="about">Về chúng tôi</option>
              <option value="contact">Liên hệ</option>
              <option value="other">Khác</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="draft">Nháp</option>
              <option value="published">Đã xuất bản</option>
            </select>
          </div>
        </div>

        {/* Order */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thứ tự hiển thị
          </label>
          <input
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
          />
          <p className="mt-1 text-xs text-gray-500">Số thứ tự càng nhỏ sẽ hiển thị trước</p>
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nội dung <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            rows={15}
            placeholder="<h2>Tiêu đề</h2><p>Nội dung...</p>"
            required
          />
          <p className="mt-1 text-xs text-gray-500">Hỗ trợ HTML. Sử dụng thẻ h2, h3, p, ul, ol, li, a, img, strong, em</p>
          {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
        </div>

        {/* Hero Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ảnh đại diện (URL)
          </label>
          <input
            type="url"
            value={formData.hero_image_url}
            onChange={(e) => setFormData({ ...formData, hero_image_url: e.target.value })}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com/image.jpg"
          />
          {formData.hero_image_url && (
            <div className="mt-2">
              <img src={formData.hero_image_url} alt="Preview" className="max-w-xs rounded shadow" onError={(e) => (e.currentTarget.style.display = 'none')} />
            </div>
          )}
        </div>

        {/* SEO Fields */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">SEO</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SEO Title
              </label>
              <input
                type="text"
                value={formData.seo_title}
                onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={60}
              />
              <p className="mt-1 text-xs text-gray-500">Tối đa 60 ký tự. Để trống sẽ dùng tiêu đề trang</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SEO Description
              </label>
              <textarea
                value={formData.seo_description}
                onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                maxLength={160}
              />
              <p className="mt-1 text-xs text-gray-500">Tối đa 160 ký tự</p>
            </div>
          </div>
        </div>

        {/* Is Active (Edit only) */}
        {isEdit && (
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm font-medium text-gray-700">Kích hoạt</span>
            </label>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4 pt-6 border-t">
          <button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createMutation.isPending || updateMutation.isPending ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Tạo mới'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/pages')}
            className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}
