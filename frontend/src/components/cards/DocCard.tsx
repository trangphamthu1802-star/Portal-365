import { Download, Eye } from 'lucide-react';

interface Document {
  id: number;
  title: string;
  description?: string;
  file_type: string;
  file_size: number;
  year?: number;
  category?: string;
  download_url: string;
  preview_url?: string;
  published_at: string;
}

interface DocCardProps {
  doc: Document;
  onView?: () => void;
  onDownload?: () => void;
}

export default function DocCard({ doc, onView, onDownload }: DocCardProps) {
  const getFileIcon = (type: string) => {
    const normalizedType = type.toLowerCase();
    if (normalizedType.includes('pdf')) return '📄';
    if (normalizedType.includes('doc')) return '📝';
    if (normalizedType.includes('xls')) return '📊';
    if (normalizedType.includes('ppt')) return '📈';
    return '📁';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-4 border border-gray-200">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-2xl">
          {getFileIcon(doc.file_type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
            {doc.title}
          </h3>
          {doc.description && (
            <p className="text-sm text-gray-600 line-clamp-1 mb-2">
              {doc.description}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3">
            <span className="uppercase font-medium">{doc.file_type}</span>
            <span>•</span>
            <span>{formatFileSize(doc.file_size)}</span>
            {doc.year && (
              <>
                <span>•</span>
                <span>{doc.year}</span>
              </>
            )}
            {doc.category && (
              <>
                <span>•</span>
                <span>{doc.category}</span>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {doc.preview_url && doc.file_type.toLowerCase().includes('pdf') && onView && (
              <button
                onClick={onView}
                className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
              >
                <Eye className="w-4 h-4" />
                Xem
              </button>
            )}
            <a
              href={doc.download_url}
              download
              onClick={onDownload}
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 transition-colors"
            >
              <Download className="w-4 h-4" />
              Tải về
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
