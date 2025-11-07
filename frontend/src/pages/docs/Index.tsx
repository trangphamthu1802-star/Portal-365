import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, FileText } from 'lucide-react';
import Header from '../../components/Header';
import DynamicNavbar from '../../components/DynamicNavbar';
import SiteFooter from '../../components/layout/SiteFooter';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import Pagination from '../../components/common/Pagination';
import DocCard from '../../components/cards/DocCard';
import Modal from '../../components/common/Modal';
import { getBreadcrumbs } from '../../config/navigation';

// Dummy documents data
const DUMMY_DOCS = [
  {
    id: 1,
    title: 'Quyết định số 01/2025 về công tác huấn luyện',
    description: 'Quy định chi tiết về kế hoạch huấn luyện năm 2025',
    file_type: 'PDF',
    file_size: 2457600,
    year: 2025,
    category: 'Quyết định',
    download_url: '/files/qd-01-2025.pdf',
    preview_url: '/files/qd-01-2025.pdf',
    published_at: '2025-01-15T09:00:00Z'
  },
  {
    id: 2,
    title: 'Thông tư 02/2025 về chế độ công tác phí',
    description: 'Hướng dẫn thực hiện chế độ công tác phí mới',
    file_type: 'DOCX',
    file_size: 1234567,
    year: 2025,
    category: 'Thông tư',
    download_url: '/files/tt-02-2025.docx',
    published_at: '2025-01-14T10:00:00Z'
  }
];

const ITEMS_PER_PAGE = 10;

export default function DocsIndex() {
  const location = useLocation();
  const [searchQuery, setLocalSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [previewDoc, setPreviewDoc] = useState<typeof DUMMY_DOCS[0] | null>(null);

  // Get breadcrumbs from navigation config
  const breadcrumbs = getBreadcrumbs(location.pathname);

  // Filter documents
  let filteredDocs = DUMMY_DOCS;
  
  if (selectedType !== 'all') {
    filteredDocs = filteredDocs.filter(d => d.file_type.toLowerCase() === selectedType.toLowerCase());
  }

  if (searchQuery) {
    filteredDocs = filteredDocs.filter(d => 
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Pagination
  const totalPages = Math.ceil(filteredDocs.length / ITEMS_PER_PAGE);
  const paginatedDocs = filteredDocs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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
            Tìm kiếm và tải về các văn bản, quyết định, thông tư
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

        {/* Documents List */}
        {paginatedDocs.length > 0 ? (
          <>
            <div className="space-y-4 mb-8">
              {paginatedDocs.map((doc) => (
                <DocCard
                  key={doc.id}
                  doc={doc}
                  onView={() => setPreviewDoc(doc)}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Không tìm thấy văn bản nào</p>
          </div>
        )}
      </main>

      {/* PDF Preview Modal */}
      {previewDoc && (
        <Modal
          isOpen={true}
          onClose={() => setPreviewDoc(null)}
          title={previewDoc.title}
        >
          <div className="w-full h-[80vh]">
            <iframe
              src={previewDoc.preview_url}
              className="w-full h-full border-0"
              title={previewDoc.title}
            />
          </div>
        </Modal>
      )}

      <SiteFooter />
    </div>
  );
}
