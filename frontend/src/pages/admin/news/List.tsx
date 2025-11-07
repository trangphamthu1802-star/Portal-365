import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, FileText, CheckCircle, XCircle } from 'lucide-react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { useArticles, useDeleteArticle, usePublishArticle, useUnpublishArticle } from '../../../hooks/useApi';
import { LoadingSpinner } from '../../../components/Loading';

const NEWS_SLUGS = [
  { slug: 'tin-quoc-te', name: 'Tin quốc tế' },
  { slug: 'tin-trong-nuoc', name: 'Tin trong nước' },
  { slug: 'tin-quan-su', name: 'Tin quân sự' },
  { slug: 'tin-don-vi', name: 'Tin đơn vị' },
];

export default function NewsList() {
  const [activeTab, setActiveTab] = useState(NEWS_SLUGS[0].slug);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading, error } = useArticles({
    q: search || undefined,
    page,
    page_size: 20,
  });

  const articles = (data as any)?.data || [];
  const pagination = (data as any)?.pagination;

  const deleteMutation = useDeleteArticle();
  const publishMutation = usePublishArticle();
  const unpublishMutation = useUnpublishArticle();

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa bài viết này?')) return;
    try {
      await deleteMutation.mutateAsync(id);
      alert('Xóa thành công!');
    } catch (err) {
      alert('Xóa thất bại');
    }
  };

  const handlePublish = async (id: number) => {
    try {
      await publishMutation.mutateAsync(id);
      alert('Đã xuất bản! Bài viết sẽ hiển thị trên Trang chủ và trang chuyên mục.');
    } catch (err) {
      alert('Xuất bản thất bại');
    }
  };

  const handleUnpublish = async (id: number) => {
    if (!confirm('Gỡ xuất bản bài viết này?')) return;
    try {
      await unpublishMutation.mutateAsync(id);
      alert('Đã gỡ xuất bản!');
    } catch (err) {
      alert('Gỡ xuất bản thất bại');
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      under_review: 'bg-yellow-100 text-yellow-800',
      published: 'bg-green-100 text-green-800',
      archived: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colors[status] || 'bg-gray-100'}`}>
        {status}
      </span>
    );
  };

  return (
    <AdminLayout title="Quản lý Tin tức">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý Tin tức</h1>
            <p className="text-gray-600 mt-1">Quản lý bài viết tin tức theo 4 nhóm</p>
          </div>
          <Link
            to={`/admin/articles/create?category=${activeTab}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Thêm bài viết
          </Link>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {NEWS_SLUGS.map((tab) => (
              <button
                key={tab.slug}
                onClick={() => {
                  setActiveTab(tab.slug);
                  setPage(1);
                }}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.slug
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow p-4">
          <input
            type="text"
            placeholder="Tìm kiếm tin tức..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-600">
              Không thể tải dữ liệu. Vui lòng thử lại.
            </div>
          ) : articles.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>Chưa có tin tức nào</p>
            </div>
          ) : (
            <>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tiêu đề
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
                  {articles.map((article: any) => (
                    <tr key={article.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{article.title}</div>
                            <div className="text-sm text-gray-500">{article.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(article.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {article.view_count || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(article.created_at).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          {article.status === 'draft' || article.status === 'under_review' ? (
                            <button
                              onClick={() => handlePublish(article.id)}
                              className="text-green-600 hover:text-green-900"
                              title="Xuất bản"
                              disabled={publishMutation.isPending}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          ) : article.status === 'published' ? (
                            <button
                              onClick={() => handleUnpublish(article.id)}
                              className="text-orange-600 hover:text-orange-900"
                              title="Gỡ xuất bản"
                              disabled={unpublishMutation.isPending}
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          ) : null}
                          <Link
                            to={`/admin/articles/${article.id}/edit`}
                            className="text-blue-600 hover:text-blue-900"
                            title="Sửa"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(article.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Xóa"
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          {article.status === 'published' && article.slug && (
                            <Link
                              to={`/a/${article.slug}`}
                              target="_blank"
                              className="text-gray-600 hover:text-gray-900"
                              title="Xem bài đăng"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {pagination && pagination.total_pages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
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
                        Hiển thị <span className="font-medium">{(page - 1) * 20 + 1}</span> đến{' '}
                        <span className="font-medium">{Math.min(page * 20, pagination.total)}</span> trong{' '}
                        <span className="font-medium">{pagination.total}</span> kết quả
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
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
