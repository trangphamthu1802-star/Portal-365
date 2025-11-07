import { useState, useEffect } from 'react';

interface Banner {
  id: number;
  title: string;
  image_url: string;
  link_url: string;
  placement: string;
  sort_order: number;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
}

export default function HomeBannerArea() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    if (banners.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length, isPaused]);

  const fetchBanners = async () => {
    try {
      const response = await fetch(
        'http://localhost:8080/api/v1/banners?placement=home_top'
      );
      if (!response.ok) throw new Error('Failed to fetch banners');

      const data = await response.json();
      setBanners(data.data || []);
    } catch (error) {
      console.error('Error fetching banners:', error);
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full animate-pulse">
        <div className="aspect-[21/9] w-full bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  // No banners
  if (banners.length === 0) {
    return null;
  }

  // Single banner
  if (banners.length === 1) {
    const banner = banners[0];
    const BannerContent = (
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
        <img
          src={banner.image_url}
          alt={banner.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
    );

    return (
      <div className="mb-8">
        {banner.link_url ? (
          <a href={banner.link_url} target="_blank" rel="noopener noreferrer">
            {BannerContent}
          </a>
        ) : (
          BannerContent
        )}
      </div>
    );
  }

  // Multiple banners - Carousel
  return (
    <div
      className="relative mb-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Main carousel container */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-gray-900">
        {/* Slides */}
        <div
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {banners.map((banner) => {
            const SlideContent = (
              <div className="h-full w-full flex-shrink-0">
                <img
                  src={banner.image_url}
                  alt={banner.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                {/* Optional: Overlay with title */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                  <h3 className="text-2xl font-bold text-white">{banner.title}</h3>
                </div>
              </div>
            );

            return (
              <div key={banner.id} className="relative h-full w-full flex-shrink-0">
                {banner.link_url ? (
                  <a
                    href={banner.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-full w-full"
                  >
                    {SlideContent}
                  </a>
                ) : (
                  SlideContent
                )}
              </div>
            );
          })}
        </div>

        {/* Previous button */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg hover:bg-white"
          aria-label="Previous slide"
        >
          <svg
            className="h-6 w-6 text-gray-800"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Next button */}
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg hover:bg-white"
          aria-label="Next slide"
        >
          <svg
            className="h-6 w-6 text-gray-800"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 w-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-8 bg-white'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Pause indicator */}
        {isPaused && (
          <div className="absolute right-4 top-4 rounded bg-black/50 px-2 py-1 text-xs text-white">
            ⏸ Paused
          </div>
        )}
      </div>
    </div>
  );
}
