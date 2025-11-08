import { useState } from 'react';
import { Upload, Trash2, Download, FileText, Search, Eye, AlertCircle } from 'lucide-react';
import AdminLayout from '../../../components/admin/AdminLayout';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { useAdminDocsList, useUploadDocument, useDeleteDocument } from '../../../hooks/admin/useAdminDocuments';
import { AxiosError } from 'axios';

interface Document {
  id: number;
  title: string;
  slug: string;
  description?: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  download_url?: string;
  preview_url?: string;
  status: 'draft' | 'published' | 'hidden';
  category_id?: number;
  uploaded_by: number;
  download_count: number;
  created_at: string;
  updated_at: string;
}

export default function DocumentsList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [fileType, setFileType] = useState('all');

  // Fetch documents from ADMIN API
  const { data, isLoading, isError, error, refetch } = useAdminDocsList({ page, page_size: 20 });
  const uploadMutation = useUploadDocument();
  const deleteMutation = useDeleteDocument();

  const documents: Document[] = data?.data || [];
  const pagination = data?.pagination || { page: 1, page_size: 20, total: 0, total_pages: 0 };

  // Debug logging
  console.log('Admin Documents Debug:', {
    isLoading,
    isError,
    error: error ? {
      message: (error as AxiosError).message,
      status: (error as AxiosError).response?.status,
      data: (error as AxiosError).response?.data
    } : null,
    dataReceived: !!data,
    documentsCount: documents.length,
    pagination,
    rawData: data
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    if (!allowedTypes.includes(file.type)) {
      alert('Chỉ hỗ trợ file PDF, DOC, DOCX, XLS, XLSX');
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert('File không được vượt quá 10MB');
      return;
    }

    try {
      await uploadMutation.mutateAsync({
        file,
        title: file.name.replace(/\.[^/.]+$/, ''),
        category_id: 11 // "Kho văn bản" category
      });
      alert('Upload thành công!');
      e.target.value = ''; // Reset file input
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || err.message || 'Upload thất bại';
      alert(`Lỗi: ${errorMessage}`);
      console.error('Upload error:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa văn bản này?')) return;
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

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('doc')) return '📝';
    return '📁';
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
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
    <AdminLayout title="Quản lý Văn bản">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kho Văn bản</h1>
            <p className="text-gray-600 mt-1">Quản lý văn bản PDF, DOC, DOCX</p>
          </div>
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
            <Upload className="w-5 h-5" />
            {uploadMutation.isPending ? 'Đang tải lên...' : 'Upload văn bản'}
            <input
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              onChange={handleFileUpload}
              disabled={uploadMutation.isPending}
              className="hidden"
            />
          </label>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm văn bản..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <select
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">Tất cả loại file</option>
              <option value="pdf">PDF</option>
              <option value="doc">DOC/DOCX</option>
            </select>
          </div>
        </div>

        {/* Documents List */}
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
                  {((error as AxiosError)?.response?.status === 401 || (error as AxiosError)?.response?.status === 403) && (
                    <button
                      onClick={() => window.location.href = '/login'}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                      Đăng nhập lại
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : documents.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="mb-2">Chưa có văn bản nào</p>
              <p className="text-sm">Upload văn bản đầu tiên của bạn</p>
            </div>
          ) : (
            <>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Văn bản
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Loại
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kích thước
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
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
                  {documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{getFileIcon(doc.mime_type)}</span>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{doc.title}</div>
                            {doc.description && (
                              <div className="text-sm text-gray-500 truncate max-w-md">{doc.description}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {doc.mime_type.split('/').pop()?.toUpperCase()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatFileSize(doc.file_size)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(doc.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(doc.created_at).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={`http://localhost:8080${doc.file_path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-900"
                            title="Xem"
                          >
                            <Eye className="w-4 h-4" />
                          </a>
                          <a
                            href={`http://localhost:8080${doc.file_path}`}
                            download={doc.title}
                            className="text-green-600 hover:text-green-900"
                            title="Tải xuống"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => handleDelete(doc.id)}
                            disabled={deleteMutation.isPending}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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
                        <span className="font-medium">{pagination.total}</span> văn bản
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
