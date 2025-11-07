import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminArticles } from '../../../hooks/useAdminArticles';
import { useCategories, useTags } from '../../../hooks/useAdminArticles';
import { EmptyState } from '../../../components/EmptyState';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import Toast from '../../../components/common/Toast';
import { normalizeError } from '../../../lib/apiClient';
import { useDeleteArticle, usePublishArticle, useUnpublishArticle } from '../../../hooks/useApi';

type ArticleStatus = 'draft' | 'under_review' | 'published' | 'hidden' | 'rejected';

export default function ArticlesList() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [parentCategory, setParentCategory] = useState<string>(''); // 'hoat-dong' or 'tin-tuc'
  const [categorySlug, setCategorySlug] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<ArticleStatus | ''>('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const { categories, isLoading: categoriesLoading } = useCategories();
  const { tags, isLoading: tagsLoading } = useTags();
  
  const { articles, pagination, isLoading, error } = useAdminArticles({
    page,
    page_size: 20,
    q: search || undefined,
    category_slug: categorySlug || undefined,
    tag_slugs: selectedTags.length > 0 ? selectedTags : undefined,
    status: statusFilter || undefined,
  });

  const deleteArticle = useDeleteArticle();
  const publishArticle = usePublishArticle();
  const unpublishArticle = useUnpublishArticle();

  // Group categories by parent
  const { parentCategories, subcategories } = useMemo(() => {
    const parents = categories.filter((c) => !c.parent_id);
    const subs = categories.filter((c) => c.parent_id);
    return { parentCategories: parents, subcategories: subs };
  }, [categories]);

  // Get subcategories for selected parent
  const availableSubcategories = useMemo(() => {
    if (!parentCategory) return subcategories;
    const parent = parentCategories.find((p) => p.slug === parentCategory);
    if (!parent) return [];
    return subcategories.filter((s) => s.parent_id === parent.id);
  }, [parentCategory, parentCategories, subcategories]);

  const handleParentCategoryChange = (slug: string) => {
    setParentCategory(slug);
    setCategorySlug(''); // Reset subcategory
    setPage(1);
  };

  const handleSubcategoryChange = (slug: string) => {
    setCategorySlug(slug);
    setPage(1);
  };

  const handleTagToggle = (slug: string) => {
    setSelectedTags((prev) =>
      prev.includes(slug) ? prev.filter((t) => t !== slug) : [...prev, slug]
    );
    setPage(1);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc muốn xóa bài viết này?')) return;
    
    try {
      await deleteArticle.mutateAsync(id);
      setToast({ message: 'Đã xóa bài viết', type: 'success' });
    } catch (error: any) {
      setToast({ message: error.message || 'Lỗi khi xóa bài viết', type: 'error' });
    }
  };

  const handlePublish = async (id: number) => {
    try {
      await publishArticle.mutateAsync(id);
      setToast({ message: 'Đã xuất bản bài viết', type: 'success' });
    } catch (error: any) {
      setToast({ message: error.message || 'Lỗi khi xuất bản', type: 'error' });
    }
  };

  const handleUnpublish = async (id: number) => {
    try {
      await unpublishArticle.mutateAsync(id);
      setToast({ message: 'Đã ẩn bài viết', type: 'success' });
    } catch (error: any) {
      setToast({ message: error.message || 'Lỗi khi ẩn bài viết', type: 'error' });
    }
  };

  if (isLoading && !articles.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-600 text-center mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-semibold mb-2">Lỗi tải dữ liệu</h2>
          <p className="text-gray-600">{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý bài viết</h1>
        <button
          onClick={() => navigate('/admin/articles/create')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Tạo bài viết mới
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        {/* Row 1: Search and Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Tìm kiếm theo tiêu đề..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as ArticleStatus | '');
              setPage(1);
            }}
            className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="draft">Nháp</option>
            <option value="under_review">Chờ duyệt</option>
            <option value="published">Đã xuất bản</option>
            <option value="hidden">Đã ẩn</option>
            <option value="rejected">Đã từ chối</option>
          </select>
        </div>

        {/* Row 2: Parent Category and Subcategory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nhóm chuyên mục</label>
            <div className="flex gap-2">
              <button
                onClick={() => handleParentCategoryChange('')}
                className={`flex-1 px-4 py-2 rounded ${
                  !parentCategory
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Tất cả
              </button>
              {parentCategories.map((parent) => (
                <button
                  key={parent.id}
                  onClick={() => handleParentCategoryChange(parent.slug)}
                  className={`flex-1 px-4 py-2 rounded ${
                    parentCategory === parent.slug
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {parent.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Chuyên mục con</label>
            <select
              value={categorySlug}
              onChange={(e) => handleSubcategoryChange(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!parentCategory && availableSubcategories.length === 0}
            >
              <option value="">Tất cả</option>
              {availableSubcategories.map((sub) => (
                <option key={sub.id} value={sub.slug}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 3: Tags (Chuyên đề) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Chuyên đề</label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => handleTagToggle(tag.slug)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedTags.includes(tag.slug)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Articles Table or Empty State */}
      {articles.length === 0 ? (
        <EmptyState
          title="Chưa có bài viết nào"
          description="Bắt đầu bằng cách tạo bài viết đầu tiên"
          action={{
            label: 'Tạo bài viết mới',
            onClick: () => navigate('/admin/articles/create')
          }}
        />
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tiêu đề
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chuyên mục
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lượt xem
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {articles.map((article: Article) => (
                  <tr key={article.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {article.title}
                          </div>
                          {article.is_featured && (
                            <span className="text-xs text-yellow-600">⭐ Nổi bật</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {article.category?.name || article.category_name || 'N/A'}
                      </div>
                      {article.category?.parent_slug && (
                        <div className="text-xs text-gray-500">
                          {article.category.parent_slug === 'hoat-dong' ? 'Hoạt động' : 'Tin tức'}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={article.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {article.view_count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(article.created_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => navigate(`/admin/articles/${article.id}/edit`)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Sửa
                        </button>
                        
                        {article.status === 'draft' && (
                          <button
                            onClick={() => navigate(`/admin/articles/${article.id}/edit`)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Gửi duyệt
                          </button>
                        )}
                        
                        {article.status === 'published' ? (
                          <button
                            onClick={() => handleUnpublish(article.id)}
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            Ẩn
                          </button>
                        ) : article.status === 'under_review' ? (
                          <button
                            onClick={() => handlePublish(article.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Duyệt
                          </button>
                        ) : null}
                        
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.total_pages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Trang {pagination.page} / {pagination.total_pages} 
                (Tổng: {pagination.total} bài viết)
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Trước
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === pagination.total_pages}
                  className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: ArticleStatus }) {
  const styles = {
    draft: 'bg-gray-100 text-gray-800',
    under_review: 'bg-blue-100 text-blue-800',
    published: 'bg-green-100 text-green-800',
    hidden: 'bg-yellow-100 text-yellow-800',
    rejected: 'bg-red-100 text-red-800',
  };

  const labels = {
    draft: 'Nháp',
    under_review: 'Đang xét duyệt',
    published: 'Đã xuất bản',
    hidden: 'Đã ẩn',
    rejected: 'Đã từ chối',
  };

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
