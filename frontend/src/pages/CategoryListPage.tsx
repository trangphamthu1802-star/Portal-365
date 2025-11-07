import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useArticles } from '@/hooks/useApi';
import { useCategoryBySlug } from '@/hooks/useCategories';
import { LoadingSkeleton } from '@/components/Loading';
import { ErrorState } from '@/components/ErrorState';
import { EmptyState } from '@/components/EmptyState';
import { Pagination } from '@/components/Pagination';

export const CategoryListPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = 12;

  const { data: categoryResponse, isLoading: categoryLoading, error: categoryError } = useCategoryBySlug(slug!);
  const { data: articlesResponse, isLoading: articlesLoading, error: articlesError } = useArticles({
    category_slug: slug,
    page,
    page_size: pageSize,
    status: 'published',
  });

  const category = (categoryResponse as any)?.data;
  const articles = (articlesResponse as any)?.data || [];
  const pagination = (articlesResponse as any)?.pagination;

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (categoryLoading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="h-8 bg-gray-300 rounded w-48 mb-6 animate-pulse" />
          <LoadingSkeleton type="article" count={6} className="grid grid-cols-1 md:grid-cols-3 gap-6" />
        </div>
      </div>
    );
  }

  if (categoryError || !category) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <ErrorState
            error={categoryError}
            title="Không tìm thấy danh mục"
            message="Danh mục không tồn tại hoặc đã bị xóa"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center space-x-2 text-gray-600">
            <li>
              <Link to="/" className="hover:text-blue-600">
                Trang chủ
              </Link>
            </li>
            <li>›</li>
            <li className="text-gray-900 font-medium">{category.name}</li>
          </ol>
        </nav>

        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{category.name}</h1>
          {category.description && (
            <p className="text-lg text-gray-600">{category.description}</p>
          )}
        </div>

        {/* Articles Grid */}
        {articlesLoading ? (
          <LoadingSkeleton type="article" count={6} className="grid grid-cols-1 md:grid-cols-3 gap-6" />
        ) : articlesError ? (
          <ErrorState
            error={articlesError}
            title="Không thể tải bài viết"
            onRetry={() => window.location.reload()}
          />
        ) : articles.length === 0 ? (
          <EmptyState
            title="Chưa có bài viết"
            description={`Danh mục "${category.name}" hiện chưa có bài viết nào.`}
            action={{
              label: 'Về trang chủ',
              onClick: () => window.location.href = '/',
            }}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {articles.map((article: any) => (
                <ArticleCard key={article.id} article={article} />
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

// Article Card Component
interface ArticleCardProps {
  article: any;
}

const ArticleCard = ({ article }: ArticleCardProps) => {
  return (
    <Link
      to={`/a/${article.slug}`}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
    >
      {article.featured_image_url && (
        <div className="w-full h-48 bg-gray-200">
          <img
            src={article.featured_image_url}
            alt={article.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
          {article.title}
        </h3>
        {article.summary && (
          <p className="text-gray-600 text-sm line-clamp-3 mb-3">{article.summary}</p>
        )}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            {new Date(article.published_at || article.created_at || '').toLocaleDateString('vi-VN')}
          </span>
          {article.view_count !== undefined && (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{article.view_count.toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
