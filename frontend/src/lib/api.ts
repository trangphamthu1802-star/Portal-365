// Re-export generated API client and utilities
export { api, authService, tokenStorage } from '@/api/client';
export * from '@/api/data-contracts';

// Legacy exports for backward compatibility
import { api } from '@/api/client';
export const apiClient = api;
