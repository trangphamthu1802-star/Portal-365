import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useArticles, useCategories, useArticleMutations } from '../../../hooks/useArticles';
import { LoadingSpinner, EmptyState, Toast } from '../../../components/Common';
import type { Article, ArticleStatus } from '../../../types/api';

export default function ArticlesList() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<number | ''>('');
  const [statusFilter, setStatusFilter] = useState<ArticleStatus | ''>('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const { data: articlesData, isLoading } = useArticles({
    page,
    page_size: 20,
    q: search || undefined,
    category_id: categoryFilter || undefined,
    status: statusFilter || undefined,
  });

  const { data: categoriesData } = useCategories();
  const { deleteArticle, publishArticle, unpublishArticle } = useArticleMutations();

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  const articles = articlesData?.data || [];
  const pagination = articlesData?.pagination;

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
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
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
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value ? Number(e.target.value) : '');
            setPage(1);
          }}
          className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tất cả chuyên mục</option>
          {categoriesData?.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

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
          <option value="under_review">Đang xét duyệt</option>
          <option value="published">Đã xuất bản</option>
          <option value="hidden">Đã ẩn</option>
          <option value="rejected">Đã từ chối</option>
        </select>
      </div>

      {articles.length === 0 ? (
        <EmptyState
          message="Chưa có bài viết nào"
          action={
            <button
              onClick={() => navigate('/admin/articles/create')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Tạo bài viết đầu tiên
            </button>
          }
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
                      <span className="text-sm text-gray-600">ID: {article.category_id}</span>
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
