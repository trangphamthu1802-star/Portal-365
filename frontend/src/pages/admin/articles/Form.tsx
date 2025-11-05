import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useArticle, useCategories, useTags, useArticleMutations } from '../../../hooks/useArticles';
import { LoadingSpinner, Toast } from '../../../components/Common';
import ConfirmModal from '../../../components/Common';
import type { CreateArticleRequest } from '../../../types/api';

export default function ArticleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const { data: article, isLoading: articleLoading } = useArticle(Number(id) || 0);
  const { data: categories } = useCategories();
  const { data: tags } = useTags();
  const { createArticle, updateArticle, deleteArticle, submitForReview } = useArticleMutations();

  const [formData, setFormData] = useState<CreateArticleRequest>({
    title: '',
    summary: '',
    content: '',
    category_id: 0,
    tag_ids: [],
    is_featured: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title,
        slug: article.slug,
        summary: article.summary,
        content: article.content,
        featured_image: article.featured_image,
        category_id: article.category_id,
        tag_ids: [], // Backend sẽ cần endpoint để lấy tag_ids
        is_featured: article.is_featured,
        scheduled_at: article.scheduled_at || undefined,
      });
    }
  }, [article]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Tiêu đề không được để trống';
    }
    if (!formData.summary.trim()) {
      newErrors.summary = 'Tóm tắt không được để trống';
    }
    if (!formData.content.trim()) {
      newErrors.content = 'Nội dung không được để trống';
    }
    if (!formData.category_id) {
      newErrors.category_id = 'Vui lòng chọn chuyên mục';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent, action: 'save' | 'submit') => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (isEditMode) {
        await updateArticle.mutateAsync({ id: Number(id), data: formData });
        if (action === 'submit') {
          await submitForReview.mutateAsync(Number(id));
          setToast({ message: 'Đã gửi bài viết để xét duyệt', type: 'success' });
        } else {
          setToast({ message: 'Đã cập nhật bài viết', type: 'success' });
        }
      } else {
        const newArticle = await createArticle.mutateAsync(formData);
        if (action === 'submit') {
          await submitForReview.mutateAsync(newArticle.id);
          setToast({ message: 'Đã tạo và gửi bài viết để xét duyệt', type: 'success' });
        } else {
          setToast({ message: 'Đã tạo bài viết', type: 'success' });
        }
        setTimeout(() => navigate('/admin/articles'), 1500);
      }
    } catch (error: any) {
      setToast({ 
        message: error.message || `Lỗi khi ${isEditMode ? 'cập nhật' : 'tạo'} bài viết`, 
        type: 'error' 
      });
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      await deleteArticle.mutateAsync(Number(id));
      setToast({ message: 'Đã xóa bài viết', type: 'success' });
      setTimeout(() => navigate('/admin/articles'), 1500);
    } catch (error: any) {
      setToast({ message: error.message || 'Lỗi khi xóa bài viết', type: 'error' });
    }
  };

  const handleToggleTag = (tagId: number) => {
    setFormData(prev => ({
      ...prev,
      tag_ids: prev.tag_ids?.includes(tagId)
        ? prev.tag_ids.filter(id => id !== tagId)
        : [...(prev.tag_ids || []), tagId]
    }));
  };

  if (articleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {isEditMode ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
        </h1>
        <button
          onClick={() => navigate('/admin/articles')}
          className="text-gray-600 hover:text-gray-800"
        >
          ← Quay lại
        </button>
      </div>

      <form onSubmit={(e) => handleSubmit(e, 'save')} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tiêu đề <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => {
              setFormData({ ...formData, title: e.target.value });
              setErrors({ ...errors, title: '' });
            }}
            className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.title ? 'border-red-500' : ''
            }`}
            placeholder="Nhập tiêu đề bài viết"
          />
          {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
        </div>

        {/* Slug (optional, auto-generated) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Slug (tự động tạo nếu để trống)
          </label>
          <input
            type="text"
            value={formData.slug || ''}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="vd: bai-viet-moi"
          />
        </div>

        {/* Summary */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tóm tắt <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.summary}
            onChange={(e) => {
              setFormData({ ...formData, summary: e.target.value });
              setErrors({ ...errors, summary: '' });
            }}
            rows={3}
            className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.summary ? 'border-red-500' : ''
            }`}
            placeholder="Nhập tóm tắt bài viết"
          />
          {errors.summary && <p className="mt-1 text-sm text-red-500">{errors.summary}</p>}
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nội dung <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => {
              setFormData({ ...formData, content: e.target.value });
              setErrors({ ...errors, content: '' });
            }}
            rows={12}
            className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.content ? 'border-red-500' : ''
            }`}
            placeholder="Nhập nội dung bài viết"
          />
          {errors.content && <p className="mt-1 text-sm text-red-500">{errors.content}</p>}
          <p className="mt-1 text-sm text-gray-500">
            Note: Hiện tại dùng textarea đơn giản. Sẽ thêm rich text editor sau.
          </p>
        </div>

        {/* Featured Image URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL ảnh đại diện
          </label>
          <input
            type="text"
            value={formData.featured_image || ''}
            onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chuyên mục <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.category_id}
            onChange={(e) => {
              setFormData({ ...formData, category_id: Number(e.target.value) });
              setErrors({ ...errors, category_id: '' });
            }}
            className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.category_id ? 'border-red-500' : ''
            }`}
          >
            <option value={0}>Chọn chuyên mục</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category_id && <p className="mt-1 text-sm text-red-500">{errors.category_id}</p>}
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nhãn
          </label>
          <div className="flex flex-wrap gap-2">
            {tags?.map((tag) => (
              <label key={tag.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.tag_ids?.includes(tag.id) || false}
                  onChange={() => handleToggleTag(tag.id)}
                  className="mr-2"
                />
                <span className="text-sm">{tag.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Is Featured */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="is_featured"
            checked={formData.is_featured}
            onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
            className="mr-2"
          />
          <label htmlFor="is_featured" className="text-sm font-medium text-gray-700">
            Đánh dấu là bài viết nổi bật
          </label>
        </div>

        {/* Scheduled At */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lên lịch xuất bản (tùy chọn)
          </label>
          <input
            type="datetime-local"
            value={formData.scheduled_at || ''}
            onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {isEditMode ? 'Cập nhật' : 'Tạo bài viết'}
          </button>

          <button
            type="button"
            onClick={(e) => handleSubmit(e as any, 'submit')}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {isEditMode ? 'Lưu & Gửi duyệt' : 'Tạo & Gửi duyệt'}
          </button>

          {isEditMode && (
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Xóa
            </button>
          )}
        </div>
      </form>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Xóa bài viết"
        message="Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác."
        variant="danger"
      />
    </div>
  );
}
