import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, ArrowLeft, Eye } from 'lucide-react';
import { apiClient } from '../../lib/apiClient';
import { Page } from '../../types/models';
import RichTextEditor from '../../components/RichTextEditor';

export default function IntroductionEdit() {
  const { key } = useParams<{ key: string }>();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    status: 'published' as 'draft' | 'published',
    order: 1,
    hero_image_url: '',
    seo_title: '',
    seo_description: '',
  });

  // Fetch page data
  const { data: page, isLoading } = useQuery({
    queryKey: ['admin', 'introduction', key],
    queryFn: async () => {
      const response = await apiClient.get(`/admin/introduction`);
      const pages = response.data.data as Page[];
      const currentPage = pages.find((p: Page) => p.key === key);
      if (!currentPage) throw new Error('Page not found');
      
      // Initialize form data
      setFormData({
        title: currentPage.title,
        content: currentPage.content,
        status: currentPage.status as 'draft' | 'published',
        order: currentPage.order,
        hero_image_url: currentPage.hero_image_url || '',
        seo_title: currentPage.seo_title || '',
        seo_description: currentPage.seo_description || '',
      });
      
      return currentPage;
    },
    enabled: !!key,
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const payload: any = {};
      
      // Only include non-empty fields
      if (data.title && data.title !== page?.title) payload.title = data.title;
      if (data.content && data.content !== page?.content) payload.content = data.content;
      if (data.status !== page?.status) payload.status = data.status;
      if (data.order !== page?.order) payload.order = data.order;
      if (data.hero_image_url) payload.hero_image_url = data.hero_image_url;
      if (data.seo_title) payload.seo_title = data.seo_title;
      if (data.seo_description) payload.seo_description = data.seo_description;

      const response = await apiClient.put(`/admin/introduction/${key}`, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'introduction'] });
      alert('Cập nhật thành công!');
    },
    onError: (error: any) => {
      alert(`Lỗi: ${error.response?.data?.error?.message || error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'order' ? parseInt(value) : value
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p className="font-bold">Không tìm thấy trang</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/introduction"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Quay lại
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Chỉnh sửa: {page.title}</h1>
            <p className="text-gray-600 mt-1">Key: <code className="bg-gray-100 px-2 py-1 rounded">{key}</code></p>
          </div>
        </div>
        <Link
          to={`/intro/${page.slug}`}
          target="_blank"
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <Eye className="w-4 h-4 mr-2" />
          Xem trang
        </Link>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Tiêu đề <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            maxLength={200}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nhập tiêu đề trang"
          />
          <p className="text-sm text-gray-500 mt-1">{formData.title.length}/200 ký tự</p>
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Nội dung <span className="text-red-500">*</span>
          </label>
          <RichTextEditor
            value={formData.content}
            onChange={(content) => setFormData(prev => ({ ...prev, content }))}
            height={600}
            placeholder="Nhập nội dung bài viết. Bạn có thể paste ảnh trực tiếp vào đây..."
          />
          <p className="text-sm text-gray-500 mt-2">
            💡 <strong>Hướng dẫn:</strong> Bạn có thể paste ảnh trực tiếp từ clipboard (Ctrl+V) hoặc kéo thả ảnh vào editor.
            Ảnh sẽ được tự động nhúng vào nội dung dưới dạng base64.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="draft">Draft (Nháp)</option>
              <option value="published">Published (Đã xuất bản)</option>
            </select>
          </div>

          {/* Order */}
          <div>
            <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-2">
              Thứ tự hiển thị
            </label>
            <input
              type="number"
              id="order"
              name="order"
              value={formData.order}
              onChange={handleChange}
              min={1}
              max={10}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Hero Image URL */}
        <div>
          <label htmlFor="hero_image_url" className="block text-sm font-medium text-gray-700 mb-2">
            URL ảnh hero (tùy chọn)
          </label>
          <input
            type="url"
            id="hero_image_url"
            name="hero_image_url"
            value={formData.hero_image_url}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {/* SEO Title */}
        <div>
          <label htmlFor="seo_title" className="block text-sm font-medium text-gray-700 mb-2">
            SEO Title (tùy chọn)
          </label>
          <input
            type="text"
            id="seo_title"
            name="seo_title"
            value={formData.seo_title}
            onChange={handleChange}
            maxLength={200}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Tiêu đề SEO cho trang"
          />
        </div>

        {/* SEO Description */}
        <div>
          <label htmlFor="seo_description" className="block text-sm font-medium text-gray-700 mb-2">
            SEO Description (tùy chọn)
          </label>
          <textarea
            id="seo_description"
            name="seo_description"
            value={formData.seo_description}
            onChange={handleChange}
            rows={3}
            maxLength={500}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Mô tả SEO cho trang (tối đa 500 ký tự)"
          />
          <p className="text-sm text-gray-500 mt-1">{formData.seo_description.length}/500 ký tự</p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t">
          <Link
            to="/admin/introduction"
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Hủy
          </Link>
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {updateMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </form>

      {/* Stats */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900">{page.view_count || 0}</div>
            <div className="text-sm text-gray-600">Lượt xem</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{page.status === 'published' ? 'Yes' : 'No'}</div>
            <div className="text-sm text-gray-600">Published</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {new Date(page.created_at).toLocaleDateString('vi-VN')}
            </div>
            <div className="text-sm text-gray-600">Ngày tạo</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {new Date(page.updated_at).toLocaleDateString('vi-VN')}
            </div>
            <div className="text-sm text-gray-600">Cập nhật cuối</div>
          </div>
        </div>
      </div>
    </div>
  );
}
