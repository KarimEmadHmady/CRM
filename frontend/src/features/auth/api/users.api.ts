import { User } from '../types/auth.types';
import { apiClient } from '@/lib/api/client';

export const usersApi = {
  // Get all users
  getAllUsers: async (): Promise<any[]> => {
    console.log('📡 Calling getAllUsers API...');
    const response = await apiClient.get('/auth/users');
    console.log('Raw API response:', response);
    console.log('Response URL:', response.config?.url);
    console.log('Response data:', response.data);
    
    // Handle different response structures
    const responseData = (response as any).data;
    if (responseData && responseData.data && responseData.data.users) {
      console.log('Found users in response.data.data.users:', responseData.data.users);
      return responseData.data.users;
    } else if (responseData && responseData.users) {
      console.log('Found users in response.data.users:', responseData.users);
      return responseData.users;
    } else if (responseData && Array.isArray(responseData)) {
      console.log('Response data is array:', responseData);
      return responseData;
    } else if ((response as any).users) {
      console.log('Found users in response.users:', (response as any).users);
      return (response as any).users;
    } else if (responseData && typeof responseData === 'object') {
      console.log('Response data is object, keys:', Object.keys(responseData));
    }
    
    console.log('No users found, returning empty array');
    return [];
  },

  // Get user by ID
  getUserById: async (id: string): Promise<User> => {
    const response = await apiClient.get(`/auth/users/${id}`);
    return response.data;
  },

  // Create new user
  createUser: async (userData: any): Promise<User> => {
    const response = await apiClient.post('/auth/users', userData);
    return response.data;
  },

  // Update user
  updateUser: async (id: string, userData: any): Promise<User> => {
    const response = await apiClient.put(`/auth/users/${id}`, userData);
    console.log('Update response:', response);
    console.log('Update response data:', response.data);
    console.log('Update response structure:', JSON.stringify(response, null, 2));
    
    // Handle nested response structure
    const responseData = (response as any).data;
    if (responseData && responseData.data && responseData.data.user) {
      console.log('Found user in response.data.data.user:', responseData.data.user);
      return responseData.data.user;
    } else if (responseData && responseData.user) {
      console.log('Found user in response.data.user:', responseData.user);
      return responseData.user;
    }
    console.log('Returning response.data as fallback');
    return response.data;
  },

  // Delete user
  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/auth/users/${id}`);
  },

  // Toggle user status
  toggleUserStatus: async (id: string): Promise<User> => {
    const response = await apiClient.patch(`/auth/users/${id}/toggle-status`);
    console.log('Toggle status response:', response);
    // Handle nested response structure
    const responseData = (response as any).data;
    if (responseData && responseData.data && responseData.data.user) {
      return responseData.data.user;
    } else if (responseData && responseData.user) {
      return responseData.user;
    }
    return response.data;
  },

  // Get users statistics
  getUsersStats: async (): Promise<{
    total: number;
    active: number;
    inactive: number;
    admins: number;
    users: number;
  }> => {
    const response = await apiClient.get('/auth/users/stats');
    return response.data;
  }
};
