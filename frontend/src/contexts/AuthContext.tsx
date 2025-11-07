import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../api/client';
import type { DtoUserResponse } from '../api/data-contracts';

interface LoginRequest {
  email: string;
  password: string;
}

interface AuthContextType {
  user: DtoUserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refetch: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<DtoUserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = async () => {
    setIsLoading(true);
    try {
      if (authService.isAuthenticated()) {
        const currentUser = authService.getUser();
        setUser(currentUser);
      }
    } catch (error) {
      console.error('Failed to load user:', error);
      authService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      console.log('AuthContext: Starting login...');
      await authService.login(credentials.email, credentials.password);
      console.log('AuthContext: Login successful, getting user...');
      // User is already fetched and stored by authService.login()
      const currentUser = authService.getUser();
      console.log('User after login:', currentUser);
      
      if (!currentUser) {
        throw new Error('User not found after login');
      }
      
      setUser(currentUser);
      console.log('AuthContext: User state updated');
    } catch (error) {
      console.error('Login failed in AuthContext:', error);
      throw error;
    }
  };

  const logout = async () => {
    authService.logout();
    setUser(null);
  };

  const refetch = async () => {
    await loadUser();
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refetch,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
