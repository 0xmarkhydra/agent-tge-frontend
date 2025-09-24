import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authService } from '../services/authService';
import { apiClient } from '../services/apiClient';
import type { 
  User, 
  LoginCredentials, 
  RegisterData, 
  ChangePasswordData 
} from '../types/auth';

interface AuthState {
  // State
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  getProfile: () => Promise<void>;
  changePassword: (passwordData: ChangePasswordData) => Promise<void>;
  clearError: () => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Login action
      login: async (credentials: LoginCredentials) => {
        try {
          set({ isLoading: true, error: null });
          console.log('🔍 [AuthStore] [login] starting login process');

          const authResponse = await authService.login(credentials);
          
          // Store tokens in API client
          apiClient.setTokens(authResponse.accessToken, authResponse.refreshToken);

          set({
            user: authResponse.user,
            token: authResponse.accessToken,
            refreshToken: authResponse.refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          console.log('✅ [AuthStore] [login] login successful:', { 
            userId: authResponse.user.id,
            userType: authResponse.user.userType 
          });

        } catch (error: any) {
          console.error('🔴 [AuthStore] [login] login failed:', error.message);
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.message,
          });
          throw error;
        }
      },

      // Register action
      register: async (userData: RegisterData) => {
        try {
          set({ isLoading: true, error: null });
          console.log('🔍 [AuthStore] [register] starting registration process');

          const authResponse = await authService.register(userData);
          
          // Store tokens in API client
          apiClient.setTokens(authResponse.accessToken, authResponse.refreshToken);

          set({
            user: authResponse.user,
            token: authResponse.accessToken,
            refreshToken: authResponse.refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          console.log('✅ [AuthStore] [register] registration successful:', { 
            userId: authResponse.user.id 
          });

        } catch (error: any) {
          console.error('🔴 [AuthStore] [register] registration failed:', error.message);
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.message,
          });
          throw error;
        }
      },

      // Logout action
      logout: async () => {
        try {
          console.log('🔍 [AuthStore] [logout] starting logout process');
          
          // Call logout API (continues even if it fails)
          await authService.logout();
          
          // Clear tokens from API client
          apiClient.clearTokens();

          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });

          console.log('✅ [AuthStore] [logout] logout completed');

        } catch (error: any) {
          console.error('⚠️ [AuthStore] [logout] logout error (cleared local state anyway):', error.message);
          
          // Clear local state even if API call failed
          apiClient.clearTokens();
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      // Refresh authentication
      refreshAuth: async () => {
        try {
          const { refreshToken } = get();
          
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          console.log('🔍 [AuthStore] [refreshAuth] refreshing authentication');

          const authResponse = await authService.refreshToken({ refreshToken });
          
          // Update tokens in API client
          apiClient.setTokens(authResponse.accessToken, authResponse.refreshToken);

          set({
            user: authResponse.user,
            token: authResponse.accessToken,
            refreshToken: authResponse.refreshToken,
            isAuthenticated: true,
            error: null,
          });

          console.log('✅ [AuthStore] [refreshAuth] refresh successful');

        } catch (error: any) {
          console.error('🔴 [AuthStore] [refreshAuth] refresh failed:', error.message);
          
          // Clear everything on refresh failure
          apiClient.clearTokens();
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            error: 'Session expired. Please login again.',
          });
          throw error;
        }
      },

      // Get user profile
      getProfile: async () => {
        try {
          console.log('🔍 [AuthStore] [getProfile] fetching user profile');

          const user = await authService.getProfile();

          set({ user, error: null });

          console.log('✅ [AuthStore] [getProfile] profile updated');

        } catch (error: any) {
          console.error('🔴 [AuthStore] [getProfile] failed:', error.message);
          set({ error: error.message });
          throw error;
        }
      },

      // Change password
      changePassword: async (passwordData: ChangePasswordData) => {
        try {
          set({ isLoading: true, error: null });
          console.log('🔍 [AuthStore] [changePassword] changing password');

          await authService.changePassword(passwordData);

          set({ isLoading: false, error: null });

          console.log('✅ [AuthStore] [changePassword] password changed successfully');

        } catch (error: any) {
          console.error('🔴 [AuthStore] [changePassword] failed:', error.message);
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },

      // Initialize authentication on app start
      initializeAuth: async () => {
        try {
          const { token } = get();
          
          if (!token) {
            console.log('🔍 [AuthStore] [initializeAuth] no token found');
            return;
          }

          console.log('🔍 [AuthStore] [initializeAuth] verifying stored token');

          const isValid = await authService.verifyToken();
          
          if (isValid) {
            // Get fresh user profile
            await get().getProfile();
            console.log('✅ [AuthStore] [initializeAuth] token valid, user authenticated');
          } else {
            // Token invalid, try refresh
            await get().refreshAuth();
          }

        } catch (error: any) {
          console.error('🔴 [AuthStore] [initializeAuth] initialization failed:', error.message);
          
          // Clear everything on initialization failure
          apiClient.clearTokens();
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            error: null,
          });
        }
      },
    }),
    {
      name: 'shopchat-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
); 