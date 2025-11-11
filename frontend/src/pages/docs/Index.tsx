import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, FileText, Download, Eye, Calendar } from 'lucide-react';
import Header from '../../components/Header';
import DynamicNavbar from '../../components/DynamicNavbar';
import SiteFooter from '../../components/layout/SiteFooter';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import Pagination from '../../components/common/Pagination';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getBreadcrumbs } from '../../config/navigation';
import { useDocuments } from '../../hooks/useApi';

const ITEMS_PER_PAGE = 12;

export default function DocsIndex() {
  const location = useLocation();
  const [searchQuery, setLocalSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [previewDoc, setPreviewDoc] = useState<any>(null);

  // Fetch documents from API
  const { data, isLoading, error } = useDocuments({ 
    page: currentPage, 
    page_size: ITEMS_PER_PAGE 
  });

  const documents = data?.data || [];
  const pagination = data?.pagination || { page: 1, page_size: ITEMS_PER_PAGE, total: 0, total_pages: 1 };

  // Get breadcrumbs from navigation config
  const breadcrumbs = getBreadcrumbs(location.pathname);

  // Filter documents
  const filteredDocs = documents.filter((doc: any) => {
    const matchesSearch = !searchQuery || 
      doc.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedType === 'all' || 
      doc.file_type?.toLowerCase().includes(selectedType.toLowerCase());
    
    return matchesSearch && matchesType;
  });

  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (!type) return '📁';
    if (type.toLowerCase().includes('pdf')) return '📄';
    if (type.toLowerCase().includes('word') || type.toLowerCase().includes('doc')) return '📝';
    if (type.toLowerCase().includes('excel') || type.toLowerCase().includes('xls')) return '📊';
    return '📁';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <DynamicNavbar />
      <Breadcrumbs items={breadcrumbs} />

      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Kho văn bản
          </h1>
          <p className="text-gray-600">
            Tìm kiếm và tải về các văn bản, quyết định, thông tư ({pagination.total} văn bản)
          </p>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Tìm kiếm văn bản..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">Tất cả loại file</option>
              <option value="pdf">PDF</option>
              <option value="doc">DOC</option>
              <option value="docx">DOCX</option>
            </select>
          </div>
        </div>

        {/* Documents Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <LoadingSpinner />
            <p className="text-gray-600 mt-4">Đang tải văn bản...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <p className="text-red-600">Không thể tải dữ liệu. Vui lòng thử lại.</p>
          </div>
        ) : filteredDocs.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredDocs.map((doc: any) => (
                <div 
                  key={doc.id} 
                  className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
                >
                  {/* Document Header with Icon */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 border-b border-gray-100">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="text-5xl">
                            {getFileIcon(doc.mime_type || doc.file_type || '')}
                          </div>
                          <div className="flex-1">
                            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                              {(doc.mime_type || doc.file_type || 'FILE')?.split('/').pop()?.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Document Info */}
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors min-h-[3rem]">
                      {doc.title}
                    </h3>
                    
                    {doc.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {doc.description}
                      </p>
                    )}

                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100">
                      <div className="flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" />
                        <span>{formatFileSize(doc.file_size || 0)}</span>
                      </div>
                      {(doc.created_at || doc.published_at) && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{new Date(doc.created_at || doc.published_at).toLocaleDateString('vi-VN')}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setPreviewDoc(doc)}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Xem</span>
                      </button>
                      <a
                        href={`http://localhost:8080${doc.file_path || doc.file_url}`}
                        download={doc.title}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
                      >
                        <Download className="w-4 h-4" />
                        <span>Tải về</span>
                      </a>
                    </div>

                    {/* Download Count */}
                    {doc.download_count > 0 && (
                      <div className="mt-3 text-center text-xs text-gray-400">
                        Đã tải: {doc.download_count} lần
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {pagination.total_pages > 1 && (
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.total_pages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {searchQuery || selectedType !== 'all' 
                ? 'Không tìm thấy văn bản phù hợp' 
                : 'Chưa có văn bản nào'}
            </p>
          </div>
        )}
      </main>

      {/* Enhanced PDF Preview Modal */}
      {previewDoc && (
        <Modal
          isOpen={true}
          onClose={() => setPreviewDoc(null)}
          title={previewDoc.title}
        >
          <div className="space-y-4">
            {/* Document Info Bar */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{getFileIcon(previewDoc.mime_type || previewDoc.file_type || '')}</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{previewDoc.title}</h4>
                    <p className="text-sm text-gray-600">
                      {formatFileSize(previewDoc.file_size || 0)} • {(previewDoc.mime_type || previewDoc.file_type || '')?.split('/').pop()?.toUpperCase()}
                    </p>
                  </div>
                </div>
                <a
                  href={`http://localhost:8080${previewDoc.file_path || previewDoc.file_url}`}
                  download={previewDoc.title}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-sm hover:shadow-md font-medium"
                >
                  <Download className="w-4 h-4" />
                  Tải về
                </a>
              </div>
            </div>

            {/* PDF Viewer */}
            <div className="w-full h-[70vh] rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
              {(previewDoc.file_path || previewDoc.file_url)?.toLowerCase().endsWith('.pdf') ? (
                <iframe
                  src={`http://localhost:8080${previewDoc.file_path || previewDoc.file_url}`}
                  className="w-full h-full border-0"
                  title={previewDoc.title}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <FileText className="w-20 h-20 text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2 font-medium">Không thể xem trước loại file này</p>
                  <p className="text-sm text-gray-500 mb-6">Vui lòng tải về để xem nội dung</p>
                  <a
                    href={`http://localhost:8080${previewDoc.file_path || previewDoc.file_url}`}
                    download={previewDoc.title}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-sm hover:shadow-md font-medium"
                  >
                    <Download className="w-5 h-5" />
                    Tải về ngay
                  </a>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}

      <SiteFooter />
    </div>
  );
}
