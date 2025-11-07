import { apiClient } from '../lib/apiClient';
import type {
  LoginRequest,
  LoginResponse,
  User,
  SuccessResponse,
} from '../types/models';

export const authApi = {
  // Login
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<SuccessResponse<LoginResponse>>(
      '/auth/login',
      credentials
    );
    const data = response.data.data;
    
    // Store tokens and user
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data;
  },

  // Logout
  logout: async (): Promise<void> => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      try {
        await apiClient.post('/auth/logout', { refresh_token: refreshToken });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    
    // Clear local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  // Refresh token
  refresh: async (refreshToken: string): Promise<LoginResponse> => {
    const response = await apiClient.post<SuccessResponse<LoginResponse>>('/auth/refresh', {
      refresh_token: refreshToken,
    });
    const data = response.data.data;
    
    // Update tokens
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    
    return data;
  },

  // Get current user
  me: async (): Promise<User> => {
    const response = await apiClient.get<SuccessResponse<User>>('/auth/me');
    return response.data.data;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('access_token');
  },

  // Get stored user
  getStoredUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};
