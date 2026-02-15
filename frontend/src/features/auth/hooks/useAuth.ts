import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logout, 
  setLoading 
} from '@/redux/slices/authSlice';
import { authApi } from '../api/auth.api';
import { 
  LoginCredentials, 
  RegisterData, 
  UpdateProfileData, 
  ChangePasswordData 
} from '../types/auth.types';
import { 
  setAuthTokens, 
  clearAuthTokens, 
  setUser, 
  getUser, 
  isAuthenticated as checkIsAuthenticated 
} from '../utils/auth.utils';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, refreshToken, isLoading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      const savedToken = localStorage.getItem('token');
      const savedRefreshToken = localStorage.getItem('refreshToken');
      const savedUser = getUser();
      
      console.log(' Auth initialization:', {
        hasToken: !!savedToken,
        hasUser: !!savedUser,
        tokenPreview: savedToken ? `${savedToken.substring(0, 20)}...` : 'none',
        userPreview: savedUser ? { username: savedUser.username, email: savedUser.email } : 'none'
      });
      
      // Check if token exists and is valid
      if (savedToken && savedUser) {
        // Additional validation to ensure token is not expired
        try {
          const decoded = JSON.parse(atob(savedToken.split('.')[1]));
          const currentTime = Date.now() / 1000;
          
          console.log(' Token validation:', {
            exp: decoded.exp,
            currentTime,
            isExpired: decoded.exp < currentTime,
            timeUntilExpiry: decoded.exp - currentTime
          });
          
          if (decoded.exp < currentTime) {
            // Token is expired, clear everything
            console.log(' Token expired, clearing auth data');
            clearAuthTokens();
            return;
          }
          
          console.log(' Restoring auth state from localStorage');
          dispatch(loginSuccess({ 
            user: savedUser, 
            token: savedToken, 
            refreshToken: savedRefreshToken || '' 
          }));
        } catch (error) {
          console.log(' Invalid token format, clearing auth data:', error);
          clearAuthTokens();
        }
      } else {
        console.log(' No complete auth data found in localStorage');
      }
    };

    initializeAuth();
  }, [dispatch]);

  // Login function
  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      dispatch(loginStart());
      
      const response = await authApi.login(credentials);
      
      // Extract data from response structure - backend returns {success: true, data: {user: ..., token: ...}}
      const authData = (response as any).success ? (response as any).data : response;
      
      // Save tokens to localStorage
      if (authData.token && authData.user) {
        setAuthTokens(authData.token, authData.refreshToken || '');
        setUser(authData.user);

        
        // Update Redux state
        dispatch(loginSuccess({
          user: authData.user,
          token: authData.token,
          refreshToken: authData.refreshToken || ''
        }));
      } else {
        console.error(' Invalid auth data structure:', authData);
        dispatch(loginFailure('Invalid response from server'));
      }
      
      return response;
    } catch (error: any) {
      console.error(' Login error:', error);
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch(loginFailure(errorMessage));
      throw error;
    }
  }, [dispatch]);

  // Register function
  const register = useCallback(async (userData: RegisterData) => {
    try {
      dispatch(setLoading(true));
      
      const response = await authApi.register(userData);
      
      // Just return the response, don't auto-login
      dispatch(setLoading(false));
      
      return response;
    } catch (error: any) {
      console.error(' Register error:', error);
      const errorMessage = error.response?.data?.message || 'Registration failed';
      dispatch(loginFailure(errorMessage));
      throw error;
    }
  }, [dispatch]);

  // Logout function
  const logoutUser = useCallback(() => {
    authApi.logout();
    clearAuthTokens();
    dispatch(logout());
  }, [dispatch]);

  // Update profile function
  const updateProfile = useCallback(async (userData: UpdateProfileData) => {
    try {
      dispatch(setLoading(true));
      
      const updatedUser = await authApi.updateProfile(userData);
      
      // Update localStorage and Redux
      setUser(updatedUser);
      dispatch(loginSuccess({
        user: updatedUser,
        token: token!,
        refreshToken: refreshToken!
      }));
      
      return updatedUser;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Profile update failed';
      dispatch(loginFailure(errorMessage));
      throw error;
    }
  }, [dispatch, token, refreshToken]);

  // Change password function
  const changePassword = useCallback(async (passwordData: ChangePasswordData) => {
    try {
      dispatch(setLoading(true));
      
      await authApi.changePassword(passwordData);
      
      dispatch(setLoading(false));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Password change failed';
      dispatch(loginFailure(errorMessage));
      throw error;
    }
  }, [dispatch]);

  return {
    user,
    token,
    refreshToken,
    isLoading,
    error,
    isAuthenticated,
    login,
    register,
    logout: logoutUser,
    updateProfile,
    changePassword,
  };
};