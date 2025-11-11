import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Calendar, Eye, TrendingUp, Play, Image as ImageIcon, ArrowRight, FileText, Clock } from 'lucide-react';
import Header from '../components/Header';
import DynamicNavbar from '../components/DynamicNavbar';
import SiteFooter from '../components/layout/SiteFooter';
import ArticleBox from '../components/home/ArticleBox';
import { usePublicArticles } from '../hooks/usePublicArticles';
import { usePublicMediaItems } from '../hooks/useApi';
import { useBanners } from '../hooks/useBanners';
import { getArticleImage } from '../lib/images';
import { apiClient, getFullImageUrl } from '../lib/apiClient';

interface Document {
  id: number;
  title: string;
  slug: string;
  summary?: string;
  file_size?: number;
  created_at: string;
}

export default function Home() {
  // Current date and time state
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Pagination states for all 8 boxes (10 items per page)
  const [hoatDongSuDoanPage, setHoatDongSuDoanPage] = useState(1);
  const [hoatDongDonViPage, setHoatDongDonViPage] = useState(1);
  const [hoatDongThuTruongPage, setHoatDongThuTruongPage] = useState(1);
  const [tinXemNhieuPage, setTinXemNhieuPage] = useState(1);
  const [tinTrongNuocPage, setTinTrongNuocPage] = useState(1);
  const [tinQuocTePage, setTinQuocTePage] = useState(1);
  const [tinQuanSuPage, setTinQuanSuPage] = useState(1);
  const [baoVeNenTangPage, setBaoVeNenTangPage] = useState(1);

  // Featured articles for hero carousel
  const { articles: featured, isLoading: featuredLoading } = usePublicArticles({
    is_featured: true,
    limit: 5,
    sort: '-published_at',
  });

  // Latest articles - Lấy 20 bài gần nhất
  const { articles: latest, isLoading: latestLoading } = usePublicArticles({
    limit: 20,
    sort: '-published_at',
  });

  // Hoạt động - Sư đoàn
  const { articles: hoatDongSuDoan } = usePublicArticles({
    category_slug: 'hoat-dong-su-doan',
    limit: 100,
    sort: '-published_at',
  });

  // Hoạt động - Đơn vị
  const { articles: hoatDongDonVi } = usePublicArticles({
    category_slug: 'hoat-dong-cac-don-vi',
    limit: 100,
    sort: '-published_at',
  });

  // Hoạt động - Thủ trưởng
  const { articles: hoatDongThuTruong } = usePublicArticles({
    category_slug: 'hoat-dong-thu-truong',
    limit: 100,
    sort: '-published_at',
  });

  // Tin xem nhiều nhất (sort by view_count)
  const { articles: tinXemNhieu } = usePublicArticles({
    limit: 100,
    sort: '-view_count,-published_at',
  });

  // Tin tức - Trong nước
  const { articles: tinTrongNuoc } = usePublicArticles({
    category_slug: 'tin-trong-nuoc',
    limit: 100,
    sort: '-published_at',
  });

  // Tin tức - Quốc tế
  const { articles: tinQuocTe } = usePublicArticles({
    category_slug: 'tin-quoc-te',
    limit: 100,
    sort: '-published_at',
  });

  // Tin tức - Quân sự
  const { articles: tinQuanSu } = usePublicArticles({
    category_slug: 'tin-quan-su',
    limit: 100,
    sort: '-published_at',
  });

  // Bảo vệ nền tảng tư tưởng của Đảng
  const { articles: baoVeNenTang } = usePublicArticles({
    category_slug: 'bao-ve-nen-tang-tu-tuong-cua-dang',
    limit: 100,
    sort: '-published_at',
  });

  // Media items
  const { data: mediaData } = usePublicMediaItems({ 
    page: 1, 
    page_size: 8,
    media_type: 'image'
  });

  const { data: videoData } = usePublicMediaItems({ 
    page: 1, 
    page_size: 4,
    media_type: 'video'
  });

  // Banner cho vị trí trên "Hoạt động"
  const { data: banner1 = [] } = useBanners('banner-1');
  const { data: banner2 = [] } = useBanners('banner-2');

  const photos = mediaData?.data || [];
  const videos = videoData?.data || [];

  // Carousel state for photos and videos
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  
  // Carousel state for latest news
  const [currentLatestFeaturedIndex, setCurrentLatestFeaturedIndex] = useState(0);
  const [currentLatestSideIndex, setCurrentLatestSideIndex] = useState(0);

  // Auto-rotate latest news featured (1 bài lớn) every 8 seconds
  useEffect(() => {
    if (latest.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentLatestFeaturedIndex((prev) => (prev + 1) % latest.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [latest.length]);

  // Auto-rotate latest news side items (cuộn 5 bài một lần) every 5 seconds
  useEffect(() => {
    if (latest.length <= 5) return;
    
    const interval = setInterval(() => {
      setCurrentLatestSideIndex((prev) => {
        const next = prev + 5;
        return next >= latest.length ? 0 : next;
      });
    }, 5000); // Cuộn 5 bài mỗi 5 giây

    return () => clearInterval(interval);
  }, [latest.length]);

  // Auto-rotate photos every 5 seconds
  useEffect(() => {
    if (photos.length <= 2) return;
    
    const interval = setInterval(() => {
      setCurrentPhotoIndex((prev) => {
        const next = prev + 2;
        return next >= photos.length ? 0 : next;
      });
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [photos.length]);

  // Auto-rotate videos every 5 seconds
  useEffect(() => {
    if (videos.length <= 2) return;
    
    const interval = setInterval(() => {
      setCurrentVideoIndex((prev) => {
        const next = prev + 2;
        return next >= videos.length ? 0 : next;
      });
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [videos.length]);

  // Update current date and time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Get visible photos (2 items)
  const getVisiblePhotos = () => {
    if (photos.length === 0) return [];
    if (photos.length <= 2) return photos;
    
    const items = [];
    for (let i = 0; i < 2; i++) {
      const index = (currentPhotoIndex + i) % photos.length;
      items.push(photos[index]);
    }
    return items;
  };

  // Get visible videos (2 items)
  const getVisibleVideos = () => {
    if (videos.length === 0) return [];
    if (videos.length <= 2) return videos;
    
    const items = [];
    for (let i = 0; i < 2; i++) {
      const index = (currentVideoIndex + i) % videos.length;
      items.push(videos[index]);
    }
    return items;
  };

  const visiblePhotos = getVisiblePhotos();
  const visibleVideos = getVisibleVideos();

  // Get featured article for latest news (ưu tiên bài is_featured = true gần nhất)
  const getFeaturedLatestArticle = () => {
    if (latest.length === 0) return null;
    
    // Tìm bài viết nổi bật (is_featured = true) MỚI NHẤT theo published_at
    const featuredArticles = latest.filter(article => article.is_featured);
    
    if (featuredArticles.length > 0) {
      // Sắp xếp theo thời gian publish giảm dần và lấy bài đầu tiên (mới nhất)
      const sortedFeatured = featuredArticles.sort((a, b) => {
        const dateA = new Date(a.published_at).getTime();
        const dateB = new Date(b.published_at).getTime();
        return dateB - dateA; // Mới nhất lên đầu
      });
      return sortedFeatured[0];
    }
    
    // Nếu không có bài nổi bật, lấy bài theo index carousel
    return latest[currentLatestFeaturedIndex];
  };

  // Get side articles for latest news (5 bài bên phải, loại trừ bài featured)
  const getSideLatestArticles = () => {
    if (latest.length === 0) return [];
    
    const featuredArticle = getFeaturedLatestArticle();
    
    // Lọc ra các bài không phải bài featured
    const nonFeaturedArticles = latest.filter(article => article.id !== featuredArticle?.id);
    
    if (nonFeaturedArticles.length <= 5) return nonFeaturedArticles;
    
    // Lấy 5 bài liên tiếp từ currentLatestSideIndex
    const items = [];
    for (let i = 0; i < 5; i++) {
      const index = (currentLatestSideIndex + i) % nonFeaturedArticles.length;
      items.push(nonFeaturedArticles[index]);
    }
    return items;
  };

  const featuredLatest = getFeaturedLatestArticle();
  const sideLatestArticles = getSideLatestArticles();

  // Documents
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await apiClient.get('/documents', {
          params: { page: 1, page_size: 5, sort: '-created_at' },
        });
        setDocuments(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch documents:', error);
      }
    };
    fetchDocuments();
  }, []);

  const isLoading = featuredLoading || latestLoading;

  // Auto-rotate hero carousel (if we add carousel later)
  useEffect(() => {
    if (featured.length <= 1) return;
    // Carousel logic can be added here
  }, [featured.length]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Format current date and time for display
  const formatCurrentDateTime = () => {
    const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
    const dayName = days[currentDateTime.getDay()];
    const date = currentDateTime.toLocaleDateString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
    const time = currentDateTime.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
    return { dayName, date, time };
  };

  // Kiểm tra bài viết có trong 3 ngày gần nhất không
  const isNewArticle = (dateString: string) => {
    const articleDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - articleDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
  };

  // Helper function to get paginated articles
  const getPaginatedArticles = (articles: any[], currentPage: number) => {
    const itemsPerPage = 10; // 10 bài mỗi trang
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return articles.slice(startIndex, endIndex);
  };

  // Helper function to get total pages
  const getTotalPages = (articles: any[]) => {
    const itemsPerPage = 10;
    return Math.ceil(articles.length / itemsPerPage);
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    const kb = Math.floor(bytes / 1024);
    if (kb < 1024) return `${kb} KB`;
    const mb = (kb / 1024).toFixed(1);
    return `${mb} MB`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <DynamicNavbar />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-96 bg-gray-200 rounded-xl"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      <DynamicNavbar />

      {/* Current Date and Time Display */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 animate-pulse" />
              <span className="font-semibold text-sm md:text-base">
                {formatCurrentDateTime().dayName}, {formatCurrentDateTime().date}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 animate-pulse" />
              <span className="font-mono text-lg md:text-xl font-bold tracking-wider">
                {formatCurrentDateTime().time}
              </span>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-6">
        {/* Hero Section - Always show even without featured articles */}
        <section className="mb-8 mt-6">
          <div className="relative bg-gradient-to-br from-slate-50 via-gray-50 to-white rounded-2xl p-12 shadow-lg hover:shadow-xl transition-shadow border-l-4 border-t-4 border-slate-700 overflow-hidden">
            {/* Decorative corner accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-slate-100 rounded-full -ml-12 -mb-12 opacity-30"></div>
            
            <div className="relative z-10">
              <div className="overflow-hidden mb-4">
                <h1 className="text-2xl md:text-4xl font-bold leading-tight whitespace-nowrap">
                  <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 animate-marquee">
                    Chào mừng bạn đến với cổng thông tin điện tử của Sư đoàn 365 - Quân chủng Phòng không - Không Quân anh hùng
                  </span>
                </h1>
              </div>
              <p className="text-xl text-slate-600 mb-6 font-medium">
                🎖️ Cổng thông tin điện tử Sư đoàn
              </p>
              
              {/* Main Action Buttons - Top Row */}
              <div className="flex flex-wrap gap-3 mb-4">
                <Link
                  to="/c/hoat-dong-su-doan"
                  className="group relative px-6 py-3 bg-white text-slate-800 rounded-lg font-semibold hover:bg-slate-50 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg border-2 border-slate-300"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    🏛️ Hoạt động Sư đoàn
                  </span>
                </Link>
                <Link
                  to="/c/tin-trong-nuoc"
                  className="group relative px-6 py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-800 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    📰 Tin tức
                  </span>
                </Link>
              </div>

              {/* Introduction Section Buttons - Bottom Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Link
                  to="/gioi-thieu/lich-su-truyen-thong"
                  className="group relative px-4 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 hover:border-slate-300 hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-md text-center"
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-2xl">📜</span>
                    <span className="text-sm">Lịch sử truyền thống</span>
                  </div>
                </Link>
                <Link
                  to="/gioi-thieu/to-chuc-don-vi"
                  className="group relative px-4 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 hover:border-slate-300 hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-md text-center"
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-2xl">🏢</span>
                    <span className="text-sm">Cơ cấu - Tổ chức</span>
                  </div>
                </Link>
                <Link
                  to="/gioi-thieu/lanh-dao-su-doan"
                  className="group relative px-4 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 hover:border-slate-300 hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-md text-center"
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-2xl">👔</span>
                    <span className="text-sm">Lãnh đạo chỉ huy</span>
                  </div>
                </Link>
                <Link
                  to="/gioi-thieu/thanh-tich-don-vi"
                  className="group relative px-4 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 hover:border-slate-300 hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-md text-center"
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-2xl">🏆</span>
                    <span className="text-sm">Thành tích đơn vị</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Breaking News Ticker */}
        {latest.length > 0 && (
          <section className="mb-8">
            <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-600 rounded-xl shadow-lg overflow-hidden">
              <div className="flex items-center">
                {/* HOT Badge */}
                <div className="flex-shrink-0 bg-yellow-400 px-6 py-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-red-600 animate-pulse" />
                  <span className="font-bold text-red-600 text-lg uppercase tracking-wide">HOT</span>
                </div>
                
                {/* Scrolling News */}
                <div className="flex-1 overflow-hidden py-4 relative">
                  <div className="animate-scroll-news whitespace-nowrap inline-block">
                    {latest.concat(latest).map((article, index) => (
                      <Link
                        key={`${article.id}-${index}`}
                        to={`/a/${article.slug}`}
                        className="inline-flex items-center text-white hover:text-yellow-300 transition-colors mx-8 group"
                      >
                        <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3 group-hover:animate-ping"></span>
                        <span className="font-medium">{article.title}</span>
                        <span className="mx-3 text-yellow-400">•</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* View All Button */}
                <Link
                  to="/articles"
                  className="flex-shrink-0 bg-red-800 hover:bg-red-900 px-6 py-4 text-white font-semibold transition-colors flex items-center gap-2"
                >
                  <span className="hidden sm:inline">Xem tất cả</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Latest News - New Design */}
        {latest.length > 0 ? (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-red-600 to-red-400 rounded-full animate-pulse"></div>
                Tin mới nhất
              </h2>
              <Link
                to="/articles"
                className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-2 group"
              >
                Xem thêm
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="grid md:grid-cols-[280px_1fr_1fr] gap-6">
              {/* Quick Links - 8 nút bên trái */}
              <div className="space-y-3">
                <a
                  href="http://cddh.qcpkkq.bqp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3.5 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <div className="flex-shrink-0 bg-white/20 p-2 rounded-lg">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold uppercase">HỆ THỐNG TIN CĐĐH</span>
                </a>

                <a
                  href="http://quanlyvanban.bqp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3.5 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <div className="flex-shrink-0 bg-white/20 p-2 rounded-lg">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold uppercase">QUẢN LÝ VB & ĐH</span>
                </a>

                <a
                  href="http://mail.bqp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3.5 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <div className="flex-shrink-0 bg-white/20 p-2 rounded-lg">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold uppercase">THƯ ĐIỆN TỬ</span>
                </a>

                <a
                  href="http://chuyendoiso.bqp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3.5 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <div className="flex-shrink-0 bg-white/20 p-2 rounded-lg">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold uppercase">TRANG CHUYỂN ĐỔI SỐ</span>
                </a>

                <a
                  href="http://m.hoptructuyen.bqp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3.5 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <div className="flex-shrink-0 bg-white/20 p-2 rounded-lg">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold uppercase">HỌP TRỰC TUYẾN</span>
                </a>

                <a
                  href="http://khophanmem.bqp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3.5 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <div className="flex-shrink-0 bg-white/20 p-2 rounded-lg">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold uppercase">KHO PHẦN MỀM</span>
                </a>

                <a
                  href="http://timkiem.bqp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3.5 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <div className="flex-shrink-0 bg-white/20 p-2 rounded-lg">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold uppercase">DANH BẠ WEBSITE</span>
                </a>

                <a
                  href="http://qcpkkq.bqp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3.5 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <div className="flex-shrink-0 bg-white/20 p-2 rounded-lg">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                      <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold uppercase">CỔNG TTĐT QUÂN CHỦNG</span>
                </a>
              </div>

              {/* Featured Article - Bài lớn giữa */}
              {featuredLatest && (
                <div>
                  <Link
                    to={`/a/${featuredLatest.slug}`}
                    className="group block bg-white rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 h-full flex flex-col"
                  >
                    <div className="relative h-[480px] overflow-hidden bg-gray-200">
                      <img
                        src={getArticleImage(featuredLatest)}
                        alt={featuredLatest.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      {isNewArticle(featuredLatest.published_at || featuredLatest.created_at) && (
                        <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          MỚI NHẤT
                        </div>
                      )}
                    </div>
                    <div className="px-4 pb-4 pt-1 flex-1 flex flex-col justify-end">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors mb-2 line-clamp-2">
                        {featuredLatest.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(featuredLatest.published_at || featuredLatest.created_at)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {featuredLatest.view_count || 0} lượt xem
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              {/* Side Articles - 5 bài cuộn từ trên xuống dưới */}
              <div className="space-y-4">
                {sideLatestArticles.map((article: any, index: number) => (
                  <Link
                    key={`${article.id}-${currentLatestSideIndex}-${index}`}
                    to={`/a/${article.slug}`}
                    className="group flex gap-3 bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 animate-slideDown"
                    style={{ animationDelay: `${index * 80}ms` }}
                  >
                    <div className="relative w-32 h-24 flex-shrink-0 overflow-hidden bg-gray-200">
                      <img
                        src={getArticleImage(article)}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {isNewArticle(article.published_at || article.created_at) && (
                        <div className="absolute top-1 right-1 bg-red-600 text-white px-2 py-0.5 rounded text-xs font-bold animate-pulse">
                          MỚI
                        </div>
                      )}
                    </div>
                    <div className="flex-1 p-3 min-w-0">
                      <h4 className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 mb-1 text-sm">
                        {article.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(article.published_at || article.created_at)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {article.view_count || 0}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
                
                {/* Carousel indicators for side articles */}
                {latest.length > 5 && (
                  <div className="flex justify-center gap-2 pt-2">
                    {Array.from({ length: Math.ceil(latest.length / 5) }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 rounded-full transition-all duration-300 ${
                          i === Math.floor(currentLatestSideIndex / 5)
                            ? 'w-8 bg-red-600'
                            : 'w-2 bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        ) : (
          <section className="mb-12">
            <div className="bg-white rounded-xl p-12 text-center shadow-md">
              <div className="text-gray-400 mb-4">
                <TrendingUp className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Chưa có bài viết</h3>
              <p className="text-gray-500 mb-6">Hãy thêm bài viết mới từ trang quản trị</p>
              <Link
                to="/admin/articles"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Thêm bài viết
              </Link>
            </div>
          </section>
        )}

        {/* Banner 1 - Giữa trang (sau Tin mới nhất, trước Hoạt động) */}
        {banner1.length > 0 && (
          <section className="mb-6">
            {banner1.slice(0, 1).map((banner) => (
              <div 
                key={banner.id} 
                className="group relative overflow-hidden w-full h-[200px] rounded-xl shadow-lg"
              >
                {banner.link_url ? (
                  <a
                    href={banner.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full h-full"
                  >
                    <img
                      src={getFullImageUrl(banner.image_url)}
                      alt={banner.alt || banner.title || 'Banner 1'}
                      className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </a>
                ) : (
                  <img
                    src={getFullImageUrl(banner.image_url)}
                    alt={banner.alt || banner.title || 'Banner 1'}
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                  />
                )}
              </div>
            ))}
          </section>
        )}

        {/* Hoạt động Section */}
        {(hoatDongSuDoan.length > 0 || hoatDongDonVi.length > 0 || hoatDongThuTruong.length > 0 || tinXemNhieu.length > 0) && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-purple-600 to-purple-400 rounded-full animate-pulse"></div>
                Hoạt động
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Cập nhật liên tục</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* 1. Hoạt động của Sư đoàn */}
              {hoatDongSuDoan.length > 0 && (
                <ArticleBox
                  title="Hoạt động của Sư đoàn"
                  categorySlug="hoat-dong-su-doan"
                  articles={hoatDongSuDoan}
                  borderColor="border-gray-400"
                  accentColor="bg-gray-100"
                  icon={<span className="text-xl">🎖️</span>}
                  currentPage={hoatDongSuDoanPage}
                  onPageChange={setHoatDongSuDoanPage}
                />
              )}

              {/* 2. Hoạt động của Thủ trưởng */}
              {hoatDongThuTruong.length > 0 && (
                <ArticleBox
                  title="Hoạt động của Thủ trưởng"
                  categorySlug="hoat-dong-thu-truong"
                  articles={hoatDongThuTruong}
                  borderColor="border-yellow-500"
                  accentColor="bg-yellow-100"
                  icon={<span className="text-xl">👔</span>}
                  currentPage={hoatDongThuTruongPage}
                  onPageChange={setHoatDongThuTruongPage}
                />
              )}

              {/* 3. Hoạt động của các Đơn vị */}
              {hoatDongDonVi.length > 0 && (
                <ArticleBox
                  title="Hoạt động của các Đơn vị"
                  categorySlug="hoat-dong-cac-don-vi"
                  articles={hoatDongDonVi}
                  borderColor="border-green-500"
                  accentColor="bg-green-100"
                  icon={<span className="text-xl">👥</span>}
                  currentPage={hoatDongDonViPage}
                  onPageChange={setHoatDongDonViPage}
                />
              )}

              {/* 4. Tin tức xem nhiều nhất */}
              {tinXemNhieu.length > 0 && (
                <ArticleBox
                  title="Tin tức xem nhiều nhất"
                  categorySlug="tin-tuc"
                  articles={tinXemNhieu}
                  borderColor="border-orange-500"
                  accentColor="bg-orange-100"
                  icon={<TrendingUp className="w-5 h-5 text-orange-600" />}
                  currentPage={tinXemNhieuPage}
                  onPageChange={setTinXemNhieuPage}
                  showViewCount={true}
                />
              )}
            </div>
          </section>
        )}

        {/* Banner 2 - Giữa trang (sau Hoạt động, trước Tin tức) */}
        {banner2.length > 0 && (
          <section className="mb-12">
            {banner2.slice(0, 1).map((banner) => (
              <div 
                key={banner.id} 
                className="group relative overflow-hidden w-full h-[200px] rounded-xl shadow-lg"
              >
                {banner.link_url ? (
                  <a
                    href={banner.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full h-full"
                  >
                    <img
                      src={getFullImageUrl(banner.image_url)}
                      alt={banner.alt || banner.title || 'Banner 2'}
                      className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </a>
                ) : (
                  <img
                    src={getFullImageUrl(banner.image_url)}
                    alt={banner.alt || banner.title || 'Banner 2'}
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                  />
                )}
              </div>
            ))}
          </section>
        )}

        {/* Tin tức Section - Grid 2x2 */}
        {(tinTrongNuoc.length > 0 || tinQuocTe.length > 0 || tinQuanSu.length > 0 || baoVeNenTang.length > 0) && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-red-600 to-red-400 rounded-full animate-pulse"></div>
                Tin tức
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Cập nhật {formatDate(new Date().toISOString())}</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* 5. Bảo vệ nền tảng tư tưởng của Đảng */}
              {baoVeNenTang.length > 0 && (
                <ArticleBox
                  title="Bảo vệ nền tảng tư tưởng của Đảng"
                  categorySlug="bao-ve-nen-tang-tu-tuong-cua-dang"
                  articles={baoVeNenTang}
                  borderColor="border-purple-600"
                  accentColor="bg-purple-100"
                  currentPage={baoVeNenTangPage}
                  onPageChange={setBaoVeNenTangPage}
                />
              )}

              {/* 6. Tin quốc tế */}
              {tinQuocTe.length > 0 && (
                <ArticleBox
                  title="Tin quốc tế"
                  categorySlug="tin-quoc-te"
                  articles={tinQuocTe}
                  borderColor="border-blue-600"
                  accentColor="bg-blue-100"
                  currentPage={tinQuocTePage}
                  onPageChange={setTinQuocTePage}
                />
              )}

              {/* 7. Tin quân sự */}
              {tinQuanSu.length > 0 && (
                <ArticleBox
                  title="Tin quân sự"
                  categorySlug="tin-quan-su"
                  articles={tinQuanSu}
                  borderColor="border-green-600"
                  accentColor="bg-green-100"
                  currentPage={tinQuanSuPage}
                  onPageChange={setTinQuanSuPage}
                />
              )}

              {/* 8. Tin trong nước */}
              {tinTrongNuoc.length > 0 && (
                <ArticleBox
                  title="Tin trong nước"
                  categorySlug="tin-trong-nuoc"
                  articles={tinTrongNuoc}
                  borderColor="border-red-600"
                  accentColor="bg-red-100"
                  currentPage={tinTrongNuocPage}
                  onPageChange={setTinTrongNuocPage}
                />
              )}
            </div>
          </section>
        )}

        {/* Documents Section */}
        {documents.length > 0 && (
          <section className="mb-12">
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-l-4 border-amber-500">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg animate-bounce">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  Kho văn bản
                  <span className="ml-3 px-3 py-1 bg-amber-500 text-white text-sm font-semibold rounded-full">
                    {documents.length} văn bản
                  </span>
                </h2>
                <Link
                  to="/docs"
                  className="text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-2 group px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  Xem tất cả
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.map((doc) => (
                  <a
                    key={doc.id}
                    href={`/documents/${doc.slug}`}
                    className="group flex items-start gap-3 p-4 bg-white rounded-xl hover:shadow-md transition-all"
                  >
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors text-sm line-clamp-2 mb-1">
                        {doc.title}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(doc.created_at)}
                        </span>
                        <span>{formatFileSize(doc.file_size)}</span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Media Gallery */}
        {(photos.length > 0 || videos.length > 0) && (
          <section className="mb-12">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Photo Gallery */}
              {photos.length > 0 && (
                <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-l-4 border-blue-600">
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                          <ImageIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        Thư viện ảnh
                        <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                          {photos.length}
                        </span>
                      </h2>
                      <Link
                        to="/media/photos"
                        className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-2 group"
                      >
                        Xem tất cả
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-4 transition-all duration-500">
                      {visiblePhotos.map((photo: any, index: number) => (
                        <div
                          key={`${photo.id}-${currentPhotoIndex}-${index}`}
                          className="group relative h-48 rounded-xl overflow-hidden cursor-pointer animate-fadeIn"
                        >
                          {photo.url && (
                            <img
                              src={`http://localhost:8080${photo.url}`}
                              alt={photo.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                              }}
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="absolute bottom-0 left-0 right-0 p-3">
                              <p className="text-white font-semibold text-sm line-clamp-2">{photo.title}</p>
                            </div>
                          </div>
                          <div className="absolute top-2 right-2 w-8 h-8 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <ImageIcon className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Carousel indicators */}
                    {photos.length > 2 && (
                      <div className="flex justify-center gap-2 mt-4">
                        {Array.from({ length: Math.ceil(photos.length / 2) }).map((_, i) => (
                          <div
                            key={i}
                            className={`h-1 rounded-full transition-all duration-300 ${
                              i === Math.floor(currentPhotoIndex / 2)
                                ? 'w-8 bg-white'
                                : 'w-2 bg-white/40'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Video Gallery */}
              {videos.length > 0 && (
                <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-l-4 border-green-600">
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                          <Play className="w-5 h-5 text-green-600" />
                        </div>
                        Thư viện video
                        <span className="ml-2 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                          {videos.length}
                        </span>
                      </h2>
                      <Link
                        to="/media/videos"
                        className="text-green-600 hover:text-green-700 font-semibold text-sm flex items-center gap-2 group"
                      >
                        Xem tất cả
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-4 transition-all duration-500">
                      {visibleVideos.map((video: any, index: number) => (
                        <div
                          key={`${video.id}-${currentVideoIndex}-${index}`}
                          className="group relative h-48 rounded-xl overflow-hidden cursor-pointer animate-fadeIn"
                        >
                          {video.url && (
                            <video
                              src={`http://localhost:8080${video.url}#t=0.1`}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              preload="metadata"
                              muted
                              playsInline
                            />
                          )}
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center group-hover:bg-red-600 group-hover:scale-125 transition-all">
                              <Play className="w-7 h-7 text-gray-900 group-hover:text-white ml-0.5" />
                            </div>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                            <p className="text-white font-semibold text-sm line-clamp-2">{video.title}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Carousel indicators */}
                    {videos.length > 2 && (
                      <div className="flex justify-center gap-2 mt-4">
                        {Array.from({ length: Math.ceil(videos.length / 2) }).map((_, i) => (
                          <div
                            key={i}
                            className={`h-1 rounded-full transition-all duration-300 ${
                              i === Math.floor(currentVideoIndex / 2)
                                ? 'w-8 bg-white'
                                : 'w-2 bg-white/40'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      <SiteFooter />

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes scroll-news {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll-news {
          animation: scroll-news 40s linear infinite;
        }
        
        .animate-scroll-news:hover {
          animation-play-state: paused;
        }
        
        /* Pulse animation for HOT badge */
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        
        /* Gradient animation for hero text */
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        .animate-gradient-x {
          background-size: 200% auto;
          animation: gradient-x 3s ease infinite;
        }
        
        /* Fade in animation for carousel items */
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        
        /* Slide down animation for side news */
        @keyframes slideDown {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideDown {
          animation: slideDown 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
