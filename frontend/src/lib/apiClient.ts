import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { LoginResponse, SuccessResponse } from '../types/models';

// Use relative path for production deployment (works with any server IP)
// Or use VITE_API_BASE env variable if provided
const API_BASE_URL = import.meta.env.VITE_API_BASE || '/api/v1';
export const BACKEND_URL = API_BASE_URL === '/api/v1' 
  ? window.location.origin 
  : API_BASE_URL.replace('/api/v1', '');

// Helper function to get full image URL
export function getFullImageUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return `${BACKEND_URL}${path}`;
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Public endpoints that don't require authentication
const PUBLIC_ENDPOINTS = [
  '/articles',
  '/categories',
  '/tags',
  '/search',
  '/pages',
  '/banners',
  '/settings',
  '/menus',
  '/introduction',
  '/healthz',
];

const isPublicEndpoint = (url?: string): boolean => {
  if (!url) return false;
  // Don't treat admin endpoints as public
  if (url.includes('/admin/')) return false;
  return PUBLIC_ENDPOINTS.some(endpoint => url.includes(endpoint));
};

// Response interceptor for token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401) {
      // If it's a public endpoint, just reject without logout
      if (isPublicEndpoint(originalRequest.url)) {
        console.log('[apiClient] 401 on public endpoint, ignoring:', originalRequest.url);
        return Promise.reject(error);
      }

      // If already retried, logout
      if (originalRequest._retry) {
        console.log('[apiClient] Refresh failed, logging out');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        console.log('[apiClient] Attempting token refresh...');
        const response = await axios.post<SuccessResponse<LoginResponse>>(
          `${API_BASE_URL}/auth/refresh`,
          { refresh_token: refreshToken }
        );

        const { access_token, refresh_token: newRefreshToken } = response.data.data;
        console.log('[apiClient] Token refresh successful');
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', newRefreshToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        console.log('[apiClient] Token refresh failed, logging out');
        // Refresh failed, logout user
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // For non-401 errors (404, 500, etc.), just reject without logout
    return Promise.reject(error);
  }
);

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export function normalizeError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data?.error) {
      return data.error;
    }
    return {
      code: error.code || 'UNKNOWN_ERROR',
      message: error.message || 'An unknown error occurred',
    };
  }

  if (error instanceof Error) {
    return {
      code: 'CLIENT_ERROR',
      message: error.message,
    };
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: 'An unknown error occurred',
  };
}
