/* eslint-disable */
import { Api } from './api';
import axios from 'axios';

// Generated API already includes /api/v1 in paths, so baseURL should be just the backend URL
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
const API_BASE_URL = BACKEND_URL;

// Token management utilities
export const tokenStorage = {
  getAccessToken: () => localStorage.getItem('access_token'),
  getRefreshToken: () => localStorage.getItem('refresh_token'),
  setTokens: (accessToken: string, refreshToken?: string) => {
    localStorage.setItem('access_token', accessToken);
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    }
  },
  clearTokens: () => {
    console.log('[tokenStorage] Clearing tokens - Stack trace:');
    console.trace();
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },
  getUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  setUser: (user: any) => {
    localStorage.setItem('user', JSON.stringify(user));
  },
};

// Create axios instance for interceptors
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with refresh logic
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Public endpoints that don't require authentication
const PUBLIC_ENDPOINTS = [
  '/api/v1/articles',
  '/api/v1/categories',
  '/api/v1/tags',
  '/api/v1/search',
  '/api/v1/pages',
  '/api/v1/banners',
  '/api/v1/settings',
  '/api/v1/menus',
  '/api/v1/introduction',
  '/api/v1/healthz',
];

const isPublicEndpoint = (url: string): boolean => {
  return PUBLIC_ENDPOINTS.some(endpoint => url.includes(endpoint));
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If it's a 401 error
    if (error.response?.status === 401) {
      // If it's a public endpoint, just reject without logout
      if (isPublicEndpoint(originalRequest.url)) {
        console.log('[Auth] 401 on public endpoint, ignoring:', originalRequest.url);
        return Promise.reject(error);
      }

      // If already retried, logout
      if (originalRequest._retry) {
        console.log('[Auth] Refresh failed, logging out');
        tokenStorage.clearTokens();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      // If refreshing in progress, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      // Start refresh flow
      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = tokenStorage.getRefreshToken();
      if (!refreshToken) {
        console.log('[Auth] No refresh token, logging out');
        tokenStorage.clearTokens();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        console.log('[Auth] Attempting token refresh...');
        const response = await axios.post(`${BACKEND_URL}/api/v1/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const { access_token, refresh_token: newRefreshToken } = response.data.data || response.data;
        console.log('[Auth] Token refresh successful');
        tokenStorage.setTokens(access_token, newRefreshToken);
        processQueue(null, access_token);

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.log('[Auth] Token refresh failed, logging out');
        processQueue(refreshError, null);
        tokenStorage.clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // For non-401 errors (404, 500, etc.), just reject without logout
    return Promise.reject(error);
  }
);

// Create API instance
export const api = new Api({
  baseURL: API_BASE_URL,
});

// Inject axios instance into API class
(api as any).instance = axiosInstance;

// Auth service
export const authService = {
  async login(email: string, password: string) {
    try {
      const response = await api.v1AuthLoginCreate({ email, password });
      const responseData = response.data as any;
      
      // Backend returns { data: { access_token, refresh_token, user, ... } }
      const loginData = responseData?.data || responseData;
      
      console.log('Login response:', loginData);
      
      if (loginData?.access_token) {
        tokenStorage.setTokens(loginData.access_token, loginData.refresh_token);
        let user = loginData.user;
        if (!user) {
          // Fallback: fetch user info from /api/v1/auth/me
          user = await this.getCurrentUser();
        }
        if (user) {
          tokenStorage.setUser(user);
          console.log('User saved to localStorage:', user);
        } else {
          console.error('No user info found in login response or /auth/me');
        }
      } else {
        console.error('No access_token in login response');
      }
      return loginData;
    } catch (error: any) {
      console.error('Login error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
          data: error.config?.data,
        }
      });
      throw error;
    }
  },

  async logout() {
    const refreshToken = tokenStorage.getRefreshToken();
    if (refreshToken) {
      try {
        await api.v1AuthLogoutCreate({ refresh_token: refreshToken });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    tokenStorage.clearTokens();
  },

  async getCurrentUser() {
    try {
      const response = await api.v1AuthMeList();
      // Backend returns { data: user } NOT { data: { data: user } }
      const user = (response.data as any)?.data || (response.data as any);
      console.log('getCurrentUser response:', { user, fullResponse: response.data });
      if (user && user.id) {
        tokenStorage.setUser(user);
        console.log('User saved to localStorage:', user);
        return user;
      }
      console.warn('No valid user in response');
      return null;
    } catch (error) {
      console.error('getCurrentUser error:', error);
      return null;
    }
  },

  isAuthenticated: () => !!tokenStorage.getAccessToken(),
  getUser: () => tokenStorage.getUser(),
};

// Backward compatibility exports
export const setAuthToken = tokenStorage.setTokens;
export const clearAuthToken = tokenStorage.clearTokens;
export const getAuthToken = tokenStorage.getAccessToken;

// Export types
export * from './data-contracts';
