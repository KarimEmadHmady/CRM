import { 
  LoginCredentials, 
  RegisterData, 
  AuthResponse, 
  User, 
  UpdateProfileData, 
  ChangePasswordData 
} from '../types/auth.types';
import { apiClient } from '@/lib/api/client';

export const authApi = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  // Register new user
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  // Get user profile
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData: UpdateProfileData): Promise<User> => {
    const response = await apiClient.put('/auth/profile', userData);
    return response.data;
  },

  // Change password
  changePassword: async (passwordData: ChangePasswordData): Promise<void> => {
    await apiClient.put('/auth/change-password', passwordData);
  },

  // Refresh token
  refreshToken: async (): Promise<{ token: string; refreshToken: string }> => {
    const response = await apiClient.post('/auth/refresh-token');
    return response.data;
  },

  // Logout (client-side only - just clear tokens)
  logout: (): void => {
    // Clear tokens from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },
};
