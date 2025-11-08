import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  useAdminArticleById, 
  useCreateArticle, 
  useUpdateArticle,
  useDeleteArticle,
  useSubmitArticleForReview
} from '../../../hooks/useApi';
import { useCategories, useTags } from '../../../hooks/useAdminArticles';
import type { DtoCreateArticleRequest } from '../../../api/data-contracts';
import Toast from '../../../components/common/Toast';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ConfirmModal from '../../../components/Common';
import RichTextEditor from '../../../components/editor/RichTextEditor';
import ImageUpload from '../../../components/editor/ImageUpload';
import AdminTopBar from '../../../components/admin/AdminTopBar';

// Chuẩn hóa tên thành slug
function toSlug(input?: string) {
  if (!input) return '';
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

type GroupSlug = 'hoat-dong' | 'tin-tuc';

export default function ArticleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const { data: article, isLoading: articleLoading } = useAdminArticleById(Number(id) || 0);
  const { categories } = useCategories();
  const { tags } = useTags();
  const createArticle = useCreateArticle();
  const updateArticle = useUpdateArticle();
  const deleteArticle = useDeleteArticle();
  const submitForReview = useSubmitArticleForReview();

  // Lọc chỉ 2 nhóm cha: Hoạt động và Tin tức
  const { parentBySlug, subcategoriesByParent } = useMemo(() => {
    const parentMap = new Map<GroupSlug, any>();
    const subsByParent = new Map<number, any[]>();

    // Tìm parent categories
    categories.forEach((cat) => {
      if (!cat.parent_id) {
        const normalized = toSlug(cat.slug || cat.name);
        if (normalized === 'hoat-dong' || normalized === 'hoatdong') {
          parentMap.set('hoat-dong', cat);
        } else if (normalized === 'tin-tuc' || normalized === 'tintuc') {
          parentMap.set('tin-tuc', cat);
        }
      }
    });

    // Group subcategories by parent_id
    categories.forEach((cat) => {
      if (cat.parent_id) {
        if (!subsByParent.has(cat.parent_id)) {
          subsByParent.set(cat.parent_id, []);
        }
        subsByParent.get(cat.parent_id)!.push(cat);
      }
    });

    return { parentBySlug: parentMap, subcategoriesByParent: subsByParent };
  }, [categories]);

  const [selectedGroupSlug, setSelectedGroupSlug] = useState<GroupSlug>('hoat-dong');

  const [formData, setFormData] = useState<DtoCreateArticleRequest>({
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

  // Available subcategories cho group hiện tại
  const availableSubcategories = useMemo(() => {
    const parent = parentBySlug.get(selectedGroupSlug);
    if (!parent) return [];
    return subcategoriesByParent.get(parent.id) || [];
  }, [selectedGroupSlug, parentBySlug, subcategoriesByParent]);

  // Xác định group từ category_id khi load article
  useEffect(() => {
    if (article && categories.length > 0) {
      setFormData({
        title: article.title,
        slug: article.slug,
        summary: article.summary,
        content: article.content,
        featured_image: article.featured_image,
        category_id: article.category_id,
        tag_ids: article.tags?.map((t: any) => t.id) || [],
        is_featured: article.is_featured,
        scheduled_at: article.scheduled_at || undefined,
      });

      // Tìm group từ category_id
      const cat = categories.find(c => c.id === article.category_id);
      if (cat?.parent_id) {
        // Tìm parent của category này
        const parent = categories.find(c => c.id === cat.parent_id);
        if (parent) {
          const normalized = toSlug(parent.slug || parent.name);
          if (normalized === 'hoat-dong' || normalized === 'hoatdong') {
            setSelectedGroupSlug('hoat-dong');
          } else if (normalized === 'tin-tuc' || normalized === 'tintuc') {
            setSelectedGroupSlug('tin-tuc');
          }
        }
      }
    }
  }, [article, categories]);

  // Khi đổi group, tự động chọn subcategory đầu tiên
  useEffect(() => {
    if (availableSubcategories.length > 0 && !isEditMode) {
      // Chỉ auto-select khi tạo mới
      setFormData(prev => ({
        ...prev,
        category_id: availableSubcategories[0].id
      }));
    }
  }, [selectedGroupSlug, availableSubcategories, isEditMode]);

  // Handle group change
  const handleGroupChange = (groupSlug: GroupSlug) => {
    setSelectedGroupSlug(groupSlug);
    
    // Tự động chọn subcategory đầu tiên của nhóm mới
    const parent = parentBySlug.get(groupSlug);
    if (parent) {
      const subs = subcategoriesByParent.get(parent.id) || [];
      if (subs.length > 0) {
        setFormData(prev => ({
          ...prev,
          category_id: subs[0].id
        }));
      } else {
        // Xóa category_id nếu không có subcategory
        setFormData(prev => ({
          ...prev,
          category_id: 0
        }));
      }
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Tiêu đề không được để trống';
    }
    if (!formData.summary?.trim()) {
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
    <div className="min-h-screen bg-gray-100">
      <AdminTopBar title={isEditMode ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'} />
      
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

        {/* Content - Rich Text Editor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nội dung <span className="text-red-500">*</span>
          </label>
          <RichTextEditor
            content={formData.content}
            onChange={(html) => {
              setFormData({ ...formData, content: html });
              setErrors({ ...errors, content: '' });
            }}
            placeholder="Nhập nội dung bài viết..."
            error={errors.content}
          />
        </div>

        {/* Featured Image Upload */}
        <ImageUpload
          value={formData.featured_image}
          onChange={(url) => setFormData({ ...formData, featured_image: url })}
          label="Ảnh đại diện"
          error={errors.featured_image}
        />

        {/* Category - Only 2 Groups: Hoạt động & Tin tức */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nhóm chuyên mục <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleGroupChange('hoat-dong')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  selectedGroupSlug === 'hoat-dong'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Hoạt động
              </button>
              <button
                type="button"
                onClick={() => handleGroupChange('tin-tuc')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  selectedGroupSlug === 'tin-tuc'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Tin tức
              </button>
            </div>
            {!parentBySlug.has(selectedGroupSlug) && (
              <p className="mt-2 text-sm text-amber-600">
                ⚠️ Chưa có nhóm "{selectedGroupSlug === 'hoat-dong' ? 'Hoạt động' : 'Tin tức'}" trong hệ thống.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chuyên mục <span className="text-red-500">*</span>
            </label>
            {availableSubcategories.length === 0 ? (
              <div className="px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
                Chưa có chuyên mục con cho nhóm này. Vui lòng tạo chuyên mục trước.
              </div>
            ) : (
              <select
                value={formData.category_id}
                onChange={(e) => {
                  setFormData({ ...formData, category_id: Number(e.target.value) });
                  setErrors({ ...errors, category_id: '' });
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.category_id ? 'border-red-500' : ''
                }`}
              >
                <option value={0}>Chọn chuyên mục</option>
                {availableSubcategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            )}
            {errors.category_id && <p className="mt-1 text-sm text-red-500">{errors.category_id}</p>}
          </div>
        </div>

        {/* Tags - Chuyên đề */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chuyên đề
          </label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => handleToggleTag(tag.id)}
                className={`px-3 py-1 rounded-full text-sm ${
                  formData.tag_ids?.includes(tag.id)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag.name}
              </button>
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
            value={(formData.scheduled_at as string) || ''}
            onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value as any })}
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
    </div>
  );
}
