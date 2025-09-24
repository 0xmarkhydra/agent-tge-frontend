import { apiClient } from './apiClient';
import type { 
  LoginCredentials, 
  RegisterData, 
  AuthResponse, 
  User, 
  ChangePasswordData,
  RefreshTokenData 
} from '../types/auth';

class AuthService {
  private extractData<T>(apiResponse: any): T {
    // Handle both wrapped (standard format) and raw data
    if (apiResponse && typeof apiResponse === 'object') {
      return (apiResponse.data as T) ?? (apiResponse as T);
    }
    return apiResponse as T;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('🔍 [AuthService] [login] credentials:', { email: credentials.email });
      
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      
      const raw = response.data;
      const parsed = this.extractData<AuthResponse>(raw);
      console.log('✅ [AuthService] [login] success:', { userId: parsed.user?.id });
      return parsed;
    } catch (error: any) {
      console.error('🔴 [AuthService] [login] error:', error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      console.log('🔍 [AuthService] [register] userData:', { 
        email: userData.email, 
        userType: userData.userType 
      });
      
      const response = await apiClient.post<AuthResponse>('/auth/register', userData);
      
      const raw = response.data;
      const parsed = this.extractData<AuthResponse>(raw);
      console.log('✅ [AuthService] [register] success:', { userId: parsed.user?.id });
      return parsed;
    } catch (error: any) {
      console.error('🔴 [AuthService] [register] error:', error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  async refreshToken(refreshTokenData: RefreshTokenData): Promise<AuthResponse> {
    try {
      console.log('🔍 [AuthService] [refreshToken] attempting token refresh');
      
      const response = await apiClient.post<AuthResponse>('/auth/refresh', refreshTokenData);
      
      console.log('✅ [AuthService] [refreshToken] success');
      const parsed = this.extractData<AuthResponse>(response.data);
      return parsed;
    } catch (error: any) {
      console.error('🔴 [AuthService] [refreshToken] error:', error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || 'Token refresh failed');
    }
  }

  async getProfile(): Promise<User> {
    try {
      console.log('🔍 [AuthService] [getProfile] fetching user profile');
      
      const response = await apiClient.get<User>('/auth/me');
      
      console.log('✅ [AuthService] [getProfile] success:', { userId: response.data.data.id });
      return response.data.data;
    } catch (error: any) {
      console.error('🔴 [AuthService] [getProfile] error:', error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch profile');
    }
  }

  async changePassword(passwordData: ChangePasswordData): Promise<void> {
    try {
      console.log('🔍 [AuthService] [changePassword] attempting password change');
      
      await apiClient.put('/auth/change-password', passwordData);
      
      console.log('✅ [AuthService] [changePassword] success');
    } catch (error: any) {
      console.error('🔴 [AuthService] [changePassword] error:', error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || 'Password change failed');
    }
  }

  async logout(): Promise<void> {
    try {
      console.log('🔍 [AuthService] [logout] logging out user');
      
      await apiClient.post('/auth/logout');
      
      console.log('✅ [AuthService] [logout] success');
    } catch (error: any) {
      console.error('⚠️ [AuthService] [logout] error (continuing anyway):', error.message);
      // Continue with logout even if API call fails
    }
  }

  async verifyToken(): Promise<boolean> {
    try {
      console.log('🔍 [AuthService] [verifyToken] verifying current token');
      
      await apiClient.get('/auth/verify');
      
      console.log('✅ [AuthService] [verifyToken] token is valid');
      return true;
    } catch (error: any) {
      console.error('🔴 [AuthService] [verifyToken] token is invalid:', error.message);
      return false;
    }
  }
}

export const authService = new AuthService(); 