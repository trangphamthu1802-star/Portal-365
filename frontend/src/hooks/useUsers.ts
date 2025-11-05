import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, normalizeError } from '../lib/apiClient';
import type { 
  User, 
  Role, 
  CreateUserRequest, 
  UpdateUserRequest, 
  ChangePasswordRequest,
  SuccessResponse 
} from '../types/api';

// Query Keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: string) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
};

export const roleKeys = {
  all: ['roles'] as const,
};

// Fetch Users
export function useUsers(params?: { page?: number; page_size?: number; q?: string; role?: string; status?: string }) {
  return useQuery({
    queryKey: userKeys.list(JSON.stringify(params || {})),
    queryFn: async () => {
      const response = await apiClient.get<SuccessResponse<User[]>>('/admin/users', { params });
      return response.data;
    },
  });
}

// Fetch Single User
export function useUser(id: number) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get<SuccessResponse<User>>(`/admin/users/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
}

// Fetch Roles
export function useRoles() {
  return useQuery({
    queryKey: roleKeys.all,
    queryFn: async () => {
      const response = await apiClient.get<SuccessResponse<Role[]>>('/admin/roles');
      return response.data.data;
    },
  });
}

// User Mutations
export function useUserMutations() {
  const queryClient = useQueryClient();

  const createUser = useMutation({
    mutationFn: async (data: CreateUserRequest) => {
      const response = await apiClient.post<SuccessResponse<User>>('/admin/users', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error) => {
      throw normalizeError(error);
    },
  });

  const updateUser = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateUserRequest }) => {
      const response = await apiClient.put<SuccessResponse<User>>(`/admin/users/${id}`, data);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
    },
    onError: (error) => {
      throw normalizeError(error);
    },
  });

  const deleteUser = useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/admin/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error) => {
      throw normalizeError(error);
    },
  });

  const changePassword = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: ChangePasswordRequest }) => {
      await apiClient.put(`/admin/users/${id}/password`, data);
    },
    onError: (error) => {
      throw normalizeError(error);
    },
  });

  const assignRole = useMutation({
    mutationFn: async ({ userId, roleId }: { userId: number; roleId: number }) => {
      await apiClient.post(`/admin/users/${userId}/roles`, { role_id: roleId });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.userId) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error) => {
      throw normalizeError(error);
    },
  });

  const removeRole = useMutation({
    mutationFn: async ({ userId, roleId }: { userId: number; roleId: number }) => {
      await apiClient.delete(`/admin/users/${userId}/roles/${roleId}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.userId) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error) => {
      throw normalizeError(error);
    },
  });

  return {
    createUser,
    updateUser,
    deleteUser,
    changePassword,
    assignRole,
    removeRole,
  };
}
