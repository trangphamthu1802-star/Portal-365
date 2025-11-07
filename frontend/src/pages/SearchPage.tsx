import { Link, useSearchParams } from 'react-router-dom';
import { useSearch } from '@/hooks/useApi';
import { LoadingSkeleton } from '@/components/Loading';
import { ErrorState } from '@/components/ErrorState';
import { EmptyState } from '@/components/EmptyState';
import { Pagination } from '@/components/Pagination';
import { useState } from 'react';

export const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const query = searchParams.get('q') || '';
  const typeFilter = searchParams.get('type') || undefined;
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = 15;

  const [searchInput, setSearchInput] = useState(query);

  const { data: searchResponse, isLoading, error } = useSearch(query, {
    type: typeFilter,
    page,
    page_size: pageSize,
  });

  const results = (searchResponse as any)?.data || [];
  const pagination = (searchResponse as any)?.pagination;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim(), page: '1' });
    }
  };

  const handlePageChange = (newPage: number) => {
    const params: any = { q: query, page: newPage.toString() };
    if (typeFilter) params.type = typeFilter;
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTypeFilter = (type: string | undefined) => {
    const params: any = { q: query, page: '1' };
    if (type) params.type = type;
    setSearchParams(params);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Tìm kiếm</h1>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Nhập từ khóa tìm kiếm..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Tìm kiếm
              </button>
            </div>
          </form>

          {/* Type Filters */}
          {query && (
            <div className="flex gap-2">
              <button
                onClick={() => handleTypeFilter(undefined)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  !typeFilter
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => handleTypeFilter('article')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  typeFilter === 'article'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Bài viết
              </button>
              <button
                onClick={() => handleTypeFilter('activity')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  typeFilter === 'activity'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Hoạt động
              </button>
              <button
                onClick={() => handleTypeFilter('document')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  typeFilter === 'document'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Tài liệu
              </button>
            </div>
          )}
        </div>

        {/* Results */}
        {!query ? (
          <div className="bg-white rounded-lg shadow-md p-12">
            <EmptyState
              title="Nhập từ khóa để tìm kiếm"
              description="Tìm kiếm bài viết, hoạt động, tài liệu và nhiều hơn nữa"
            />
          </div>
        ) : isLoading ? (
          <LoadingSkeleton type="list" count={5} className="space-y-4" />
        ) : error ? (
          <ErrorState
            error={error}
            title="Không thể tìm kiếm"
            onRetry={() => window.location.reload()}
          />
        ) : results.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12">
            <EmptyState
              title="Không tìm thấy kết quả"
              description={`Không có kết quả nào cho từ khóa "${query}". Hãy thử từ khóa khác.`}
            />
          </div>
        ) : (
          <>
            {/* Results Info */}
            <div className="mb-6">
              <p className="text-gray-600">
                Tìm thấy <span className="font-semibold">{pagination?.total || results.length}</span> kết quả
                cho "<span className="font-semibold">{query}</span>"
              </p>
            </div>

            {/* Results List */}
            <div className="space-y-4 mb-8">
              {results.map((result: any) => (
                <SearchResultCard key={`${result.type}-${result.id}`} result={result} />
              ))}
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
    </div>
  );
};

// Search Result Card Component
interface SearchResultCardProps {
  result: any;
}

const SearchResultCard = ({ result }: SearchResultCardProps) => {
  const getResultLink = () => {
    switch (result.type) {
      case 'article':
        return `/a/${result.slug}`;
      case 'activity':
        return `/activities/${result.slug}`;
      case 'document':
        return `/documents/${result.slug}`;
      default:
        return '#';
    }
  };

  const getTypeBadge = () => {
    const badges: Record<string, { label: string; className: string }> = {
      article: { label: 'Bài viết', className: 'bg-blue-100 text-blue-700' },
      activity: { label: 'Hoạt động', className: 'bg-green-100 text-green-700' },
      document: { label: 'Tài liệu', className: 'bg-purple-100 text-purple-700' },
    };
    
    const badge = badges[result.type] || { label: result.type, className: 'bg-gray-100 text-gray-700' };
    
    return (
      <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${badge.className}`}>
        {badge.label}
      </span>
    );
  };

  return (
    <Link
      to={getResultLink()}
      className="block bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
    >
      <div className="flex items-start gap-4">
        {result.featured_image_url && (
          <img
            src={result.featured_image_url}
            alt={result.title}
            className="w-32 h-24 object-cover rounded flex-shrink-0"
            loading="lazy"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="mb-2">{getTypeBadge()}</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600">
            {result.title}
          </h3>
          {result.summary && (
            <p className="text-gray-600 text-sm line-clamp-2 mb-3">{result.summary}</p>
          )}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            {result.category?.name && (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
                {result.category.name}
              </span>
            )}
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
              </svg>
              {new Date(result.published_at || result.created_at || '').toLocaleDateString('vi-VN')}
            </span>
            {result.view_count !== undefined && (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
                {result.view_count.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
