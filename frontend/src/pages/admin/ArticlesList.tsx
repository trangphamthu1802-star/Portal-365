import { Link, useSearchParams } from 'react-router-dom';
import {
  useAdminArticles,
  useDeleteArticle,
  usePublishArticle,
  useUnpublishArticle,
} from '@/hooks/useApi';
import { useCategories } from '@/hooks/useCategories';
import { LoadingSkeleton } from '@/components/Loading';
import { ErrorState } from '@/components/ErrorState';
import { EmptyState } from '@/components/EmptyState';
import { Pagination } from '@/components/Pagination';
import { useState } from 'react';

export const AdminArticlesList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const page = parseInt(searchParams.get('page') || '1', 10);
  const status = searchParams.get('status') || undefined;
  const categoryId = searchParams.get('category_id') || undefined;
  const q = searchParams.get('q') || undefined;
  const pageSize = 20;

  const [searchInput, setSearchInput] = useState(q || '');

  const { data: articlesResponse, isLoading, error } = useAdminArticles({
    page,
    page_size: pageSize,
    status,
    category_id: categoryId ? parseInt(categoryId) : undefined,
    q,
  });

  const { data: categoriesResponse } = useCategories();
  const categories = (categoriesResponse as any)?.data || [];

  const articles = (articlesResponse as any)?.data || [];
  const pagination = (articlesResponse as any)?.pagination;

  const publishMutation = usePublishArticle();
  const unpublishMutation = useUnpublishArticle();
  const deleteMutation = useDeleteArticle();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params: any = { page: '1' };
    if (searchInput.trim()) params.q = searchInput.trim();
    if (status) params.status = status;
    if (categoryId) params.category_id = categoryId;
    setSearchParams(params);
  };

  const handleStatusFilter = (newStatus: string | undefined) => {
    const params: any = { page: '1' };
    if (newStatus) params.status = newStatus;
    if (categoryId) params.category_id = categoryId;
    if (q) params.q = q;
    setSearchParams(params);
  };

  const handleCategoryFilter = (newCategoryId: string | undefined) => {
    const params: any = { page: '1' };
    if (status) params.status = status;
    if (newCategoryId) params.category_id = newCategoryId;
    if (q) params.q = q;
    setSearchParams(params);
  };

  const handlePageChange = (newPage: number) => {
    const params: any = { page: newPage.toString() };
    if (status) params.status = status;
    if (categoryId) params.category_id = categoryId;
    if (q) params.q = q;
    setSearchParams(params);
  };

  const handlePublish = async (id: number) => {
    if (confirm('Xuất bản bài viết này?')) {
      await publishMutation.mutateAsync(id);
    }
  };

  const handleUnpublish = async (id: number) => {
    if (confirm('Gỡ bài viết này?')) {
      await unpublishMutation.mutateAsync(id);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Xóa bài viết này? Hành động không thể hoàn tác.')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Quản lý bài viết</h1>
        <LoadingSkeleton type="list" count={10} className="space-y-4" />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Quản lý bài viết</h1>
        <ErrorState error={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý bài viết</h1>
        <Link
          to="/admin/articles/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          + Tạo bài viết
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <form onSubmit={handleSearch} className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Tìm kiếm bài viết..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tìm
            </button>
          </div>
        </form>

        <div className="flex flex-wrap gap-2">
          {/* Status Filter */}
          <select
            value={status || ''}
            onChange={(e) => handleStatusFilter(e.target.value || undefined)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="draft">Bản nháp</option>
            <option value="under_review">Đang xét duyệt</option>
            <option value="published">Đã xuất bản</option>
            <option value="hidden">Đã ẩn</option>
            <option value="rejected">Bị từ chối</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryId || ''}
            onChange={(e) => handleCategoryFilter(e.target.value || undefined)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((cat: any) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      {articles.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12">
          <EmptyState
            title="Chưa có bài viết"
            description="Tạo bài viết đầu tiên của bạn"
            action={{
              label: 'Tạo bài viết',
              onClick: () => window.location.href = '/admin/articles/new',
            }}
          />
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tiêu đề
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Danh mục
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tác giả
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
              <tbody className="divide-y divide-gray-200">
                {articles.map((article: any) => (
                  <tr key={article.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {article.featured_image_url && (
                          <img
                            src={article.featured_image_url}
                            alt={article.title}
                            className="w-16 h-12 object-cover rounded"
                          />
                        )}
                        <div className="max-w-md">
                          <div className="font-medium text-gray-900 line-clamp-1">{article.title}</div>
                          <div className="text-sm text-gray-500">{article.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {article.category?.name || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={article.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {article.author?.full_name || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {article.view_count?.toLocaleString() || 0}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(article.created_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 text-right text-sm">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/admin/articles/${article.id}/edit`}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          Sửa
                        </Link>
                        {article.status === 'published' ? (
                          <button
                            onClick={() => handleUnpublish(article.id)}
                            disabled={unpublishMutation.isPending}
                            className="text-orange-600 hover:text-orange-700 disabled:opacity-50"
                          >
                            Gỡ
                          </button>
                        ) : article.status === 'draft' || article.status === 'rejected' ? (
                          <button
                            onClick={() => handlePublish(article.id)}
                            disabled={publishMutation.isPending}
                            className="text-green-600 hover:text-green-700 disabled:opacity-50"
                          >
                            Xuất bản
                          </button>
                        ) : null}
                        <button
                          onClick={() => handleDelete(article.id)}
                          disabled={deleteMutation.isPending}
                          className="text-red-600 hover:text-red-700 disabled:opacity-50"
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
            <Pagination
              currentPage={pagination.current_page}
              totalPages={pagination.total_pages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

// Status Badge Component
const StatusBadge = ({ status }: { status: string }) => {
  const variants: Record<string, { label: string; className: string }> = {
    draft: { label: 'Bản nháp', className: 'bg-gray-100 text-gray-700' },
    under_review: { label: 'Đang xét duyệt', className: 'bg-yellow-100 text-yellow-700' },
    published: { label: 'Đã xuất bản', className: 'bg-green-100 text-green-700' },
    hidden: { label: 'Đã ẩn', className: 'bg-orange-100 text-orange-700' },
    rejected: { label: 'Bị từ chối', className: 'bg-red-100 text-red-700' },
  };

  const variant = variants[status] || { label: status, className: 'bg-gray-100 text-gray-700' };

  return (
    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${variant.className}`}>
      {variant.label}
    </span>
  );
};
