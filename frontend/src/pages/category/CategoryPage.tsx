import { useParams, Link } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { useCategory } from '../../hooks/useCategory';
import CategoryMainList from '../../components/category/CategoryMainList';
import CategoryRail from '../../components/category/CategoryRail';
import { ALL_CATEGORY_SLUGS, CATEGORY_NAMES, CATEGORY_GROUPS } from '../../config/categorySlugs';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  
  // Check if slug is valid
  const isValidSlug = slug && (ALL_CATEGORY_SLUGS as string[]).includes(slug);

  // Try to get category from API (optional - for dynamic data)
  const { data: category, isLoading: categoryLoading } = useCategory(slug || '', {
    enabled: !!slug,
  });

  // Get category info from static config or API
  const categoryName = category?.name || (slug ? CATEGORY_NAMES[slug] : '');
  const categoryDescription = category?.description;
  const categoryGroup = slug ? CATEGORY_GROUPS[slug] : undefined;

  // Calculate side rails (exclude current slug)
  const sideRailSlugs = useMemo(() => {
    if (!slug) return [];
    return ALL_CATEGORY_SLUGS.filter((s) => s !== slug);
  }, [slug]);

  // SEO
  useEffect(() => {
    if (categoryName) {
      document.title = `${categoryName} - Portal 365`;
      
      const description = categoryDescription || `Tin tức và bài viết về ${categoryName}`;
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', description);

      // Canonical
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.href = window.location.href;
    }

    return () => {
      document.title = 'Portal 365';
    };
  }, [categoryName, categoryDescription]);

  // Loading state
  if (categoryLoading && !categoryName) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6 lg:py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  // 404 - Invalid slug
  if (!isValidSlug) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-gray-600 mb-6">Không tìm thấy chuyên mục</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            🏠 Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6 lg:py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-blue-600">
            🏠 Trang chủ
          </Link>
          <span>›</span>
          <Link
            to={categoryGroup === 'activities' ? '/activities' : '/news'}
            className="hover:text-blue-600"
          >
            {categoryGroup === 'activities' ? 'Hoạt động' : 'Tin tức'}
          </Link>
          <span>›</span>
          <span className="text-gray-400">{categoryName}</span>
        </nav>

        {/* Main Grid */}
        <div className="lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-10">
          {/* Left Column - Main List */}
          <div className="lg:col-span-1">
            <CategoryMainList
              slug={slug!}
              categoryName={categoryName}
              description={categoryDescription}
            />
          </div>

          {/* Right Column - Rails */}
          <aside className="lg:col-span-1 mt-8 lg:mt-0" aria-label="Các chuyên mục khác">
            <div className="lg:sticky lg:top-24 space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Chuyên mục khác</h2>
              <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                {sideRailSlugs.map((railSlug) => (
                  <CategoryRail
                    key={railSlug}
                    slug={railSlug}
                    title={CATEGORY_NAMES[railSlug]}
                    limit={5}
                  />
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
