/**
 * Image handling utilities for Portal 365
 */

// Use relative path in production, full URL in development
const FILES_BASE = import.meta.env.VITE_FILES_BASE || 
  (import.meta.env.MODE === 'production' ? '' : 'http://localhost:8080');

export interface Article {
  featured_image?: string;
  thumbnail_url?: string;
  content?: string;
  title: string;
}

/**
 * Convert relative path to absolute URL
 */
export function toAbsoluteUrl(path: string | undefined): string {
  if (!path) return '';
  
  // Already absolute
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Relative path - prepend FILES_BASE
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${FILES_BASE}${cleanPath}`;
}

/**
 * Extract first image from HTML content
 */
export function extractFirstImageFromHtml(html: string | undefined): string | null {
  if (!html) return null;
  
  const imgRegex = /<img[^>]+src="([^">]+)"/i;
  const match = html.match(imgRegex);
  
  return match ? match[1] : null;
}

/**
 * Get best available image for an article
 * Priority: thumbnail_url → featured_image → first image in content → placeholder
 */
export function getArticleImage(article: Article): string {
  const placeholder = '/placeholder-article.jpg';
  
  // Try thumbnail_url first (optimized)
  if (article.thumbnail_url) {
    return toAbsoluteUrl(article.thumbnail_url);
  }
  
  // Try featured_image
  if (article.featured_image) {
    return toAbsoluteUrl(article.featured_image);
  }
  
  // Try to extract from content
  if (article.content) {
    const contentImage = extractFirstImageFromHtml(article.content);
    if (contentImage) {
      return toAbsoluteUrl(contentImage);
    }
  }
  
  // Fallback to placeholder
  return placeholder;
}

/**
 * Get article image with fallback to a default image
 */
export function getArticleImageWithFallback(
  article: Article, 
  fallback: string = '/default-news.jpg'
): string {
  const image = getArticleImage(article);
  return image === '/placeholder-article.jpg' ? fallback : image;
}

/**
 * Validate if URL is an image
 */
export function isImageUrl(url: string): boolean {
  return /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(url);
}

/**
 * Get optimized image URL (if backend supports resizing)
 * For now, returns the original URL
 */
export function getOptimizedImageUrl(url: string): string {
  // Future: add query params for image resizing
  // Example: return `${url}?w=${width}&h=${height}`;
  return url;
}
