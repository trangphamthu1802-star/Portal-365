import Header from '../components/Header';
import Navbar from '../components/Navbar';
import FeaturedNews from '../components/FeaturedNews';
import Banner from '../components/Banner';
import NewsGrid from '../components/NewsGrid';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { dummyArticles, latestNews } from '../data/dummyData';

export default function Home() {
  // Get featured articles (top 5 by view count)
  const featuredArticles = [...dummyArticles]
    .sort((a, b) => b.view_count - a.view_count)
    .slice(0, 5);

  // Get latest articles (sorted by date)
  const latestArticles = [...dummyArticles]
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
    .slice(0, 8);

  // Get articles by category
  const defenseArticles = dummyArticles.filter(a => a.category?.name === 'Quốc phòng - An ninh').slice(0, 4);
  const trainingArticles = dummyArticles.filter(a => a.category?.name === 'Huấn luyện').slice(0, 4);
  const militaryLifeArticles = dummyArticles.filter(a => a.category?.name === 'Đời sống quân đội').slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Featured News Section */}
        <section className="mb-8">
          <FeaturedNews articles={featuredArticles} />
        </section>

        {/* Banner Section */}
        <Banner />

        {/* Main Content with Sidebar */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Main Content Area - Latest News */}
          <div className="lg:col-span-2 space-y-12">
            {/* Latest News Section */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-gradient-to-b from-green-600 to-green-800"></div>
                <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">Tin mới nhất</h2>
              </div>
              <NewsGrid articles={latestArticles} columns={3} />
            </section>

            {/* Defense & Security Category */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-gradient-to-b from-green-600 to-green-800"></div>
                <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">
                  🛡️ Quốc phòng - An ninh
                </h2>
              </div>
              <NewsGrid articles={defenseArticles} columns={3} />
            </section>

            {/* Training Category */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-900 to-blue-700"></div>
                <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">
                  🎯 Huấn luyện
                </h2>
              </div>
              <NewsGrid articles={trainingArticles} columns={3} />
            </section>

            {/* Military Life Category */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-gradient-to-b from-green-600 to-green-800"></div>
                <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">
                  👥 Đời sống quân đội
                </h2>
              </div>
              <NewsGrid articles={militaryLifeArticles} columns={3} />
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <Sidebar />
            </div>
          </aside>
        </div>

        {/* Latest Announcements Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-yellow-500 to-yellow-700"></div>
            <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">
              📢 Tin nóng trong ngày
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {latestNews.map((article) => (
              <a
                key={article.id}
                href={`/a/${article.slug}`}
                className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-yellow-500 hover:border-green-600"
              >
                <div className="relative h-40 overflow-hidden bg-gray-200">
                  <img
                    src={article.thumbnail_url}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-2 right-2">
                    <span className="inline-block bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase animate-pulse">
                      Mới
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-700 transition-colors leading-tight">
                    {article.title}
                  </h3>
                  <p className="text-xs text-gray-500 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {new Date(article.published_at).toLocaleString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      day: '2-digit',
                      month: '2-digit'
                    })}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Video & Multimedia Section (placeholder) */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-red-600 to-red-800"></div>
            <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">
              📹 Video - Hình ảnh
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative group bg-white rounded-lg overflow-hidden shadow-lg">
              <div className="relative h-64 bg-gray-200">
                <img
                  src="https://picsum.photos/seed/video1/600/400"
                  alt="Video highlight"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900">Lễ xuất quân huấn luyện năm 2025</h3>
                <p className="text-sm text-gray-600 mt-1">Toàn cảnh buổi lễ xuất quân huấn luyện của các đơn vị</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <a
                  key={i}
                  href="#"
                  className="group relative h-32 bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                >
                  <img
                    src={`https://picsum.photos/seed/photo${i}/300/200`}
                    alt={`Gallery ${i}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
