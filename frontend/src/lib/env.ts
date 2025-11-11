/**
 * Environment configuration helper
 * Automatically uses relative paths in production build
 */

// API base URL - relative in production, full URL in development
export const API_BASE_URL = import.meta.env.VITE_API_BASE || 
  (import.meta.env.MODE === 'production' ? '/api/v1' : 'http://localhost:8080/api/v1');

// Backend URL (without /api/v1) - empty in production, full URL in development  
export const BACKEND_URL = import.meta.env.VITE_FILES_BASE || 
  (import.meta.env.MODE === 'production' ? '' : 'http://localhost:8080');

// Helper to get full URL for static files
export function getStaticUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return `${BACKEND_URL}${path}`;
}
