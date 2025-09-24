import axios, { AxiosError } from 'axios';
import type { AxiosInstance, AxiosResponse, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import type { StandardApiResponse } from '../types/auth';
import { ENV } from '../config/environment';

class ApiClient {
  private client: AxiosInstance;
  private refreshTokenPromise: Promise<string> | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: ENV.API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - Add token to requests
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.getStoredToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        console.log(`🔄 [ApiClient] [${config.method?.toUpperCase()}] ${config.url}`);
        return config;
      },
      (error: AxiosError) => {
        console.error('🔴 [ApiClient] [Request Error]:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor - Handle responses and token refresh
    this.client.interceptors.response.use(
      (response: AxiosResponse<StandardApiResponse<any>>) => {
        console.log(`✅ [ApiClient] [Response] ${response.status}:`, response.data.message);
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await this.handleTokenRefresh();
            if (newToken && originalRequest) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            console.error('🔴 [ApiClient] [Token Refresh Failed]:', refreshError);
            this.clearTokens();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        console.error(`🔴 [ApiClient] [Response Error] ${error.response?.status}:`, error.message);
        return Promise.reject(error);
      }
    );
  }

  private async handleTokenRefresh(): Promise<string | null> {
    if (!this.refreshTokenPromise) {
      const refreshToken = this.getStoredRefreshToken();
      if (!refreshToken) {
        return null;
      }

      this.refreshTokenPromise = this.refreshToken(refreshToken);
    }

    try {
      const newToken = await this.refreshTokenPromise;
      this.refreshTokenPromise = null;
      return newToken;
    } catch (error) {
      this.refreshTokenPromise = null;
      throw error;
    }
  }

  private async refreshToken(refreshToken: string): Promise<string> {
    const response = await axios.post(
      `${ENV.API_URL}/auth/refresh`,
      { refreshToken }
    );
    
    const { accessToken, refreshToken: newRefreshToken } = response.data.data;
    this.setTokens(accessToken, newRefreshToken);
    return accessToken;
  }

  // Token management methods
  private getStoredToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  private getStoredRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  public setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  public clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  // Public API methods
  public get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<StandardApiResponse<T>>> {
    return this.client.get(url, config);
  }

  public post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<StandardApiResponse<T>>> {
    return this.client.post(url, data, config);
  }

  public put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<StandardApiResponse<T>>> {
    return this.client.put(url, data, config);
  }

  public delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<StandardApiResponse<T>>> {
    return this.client.delete(url, config);
  }

  public patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<StandardApiResponse<T>>> {
    return this.client.patch(url, data, config);
  }
}

// Export singleton instance
export const apiClient = new ApiClient(); 