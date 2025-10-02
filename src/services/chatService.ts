import { apiClient } from './apiClient';
import type { ChatRequest, ChatResponse, ChatHistoryResponse } from '../types/chat';

export class ChatService {
  private baseUrl = '/chat';

  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      console.log('🔍 [ChatService] [sendMessage] [request]:', request);
      
      const response = await apiClient.post<ChatResponse['data']>(
        this.baseUrl,
        request
      );

      console.log('✅ [ChatService] [sendMessage] [response]:', response.data);
      
      return {
        statusCode: response.data.statusCode || 200,
        message: response.data.message || 'Message sent successfully',
        data: response.data.data,
        timestamp: response.data.timestamp || new Date().toISOString(),
      };
    } catch (error) {
      console.error('🔴 [ChatService] [sendMessage] [error]:', error);
      throw new Error('Failed to send message');
    }
  }

  async getChatHistory(userId: string, tokenSlug: string, limit: number = 50): Promise<ChatHistoryResponse> {
    try {
      console.log('🔍 [ChatService] [getChatHistory] [params]:', { userId, tokenSlug, limit });
      
      const response = await apiClient.get<ChatHistoryResponse['data']>(
        `${this.baseUrl}/history/${userId}/${tokenSlug}?limit=${limit}`
      );

      console.log('✅ [ChatService] [getChatHistory] [response]:', response.data);
      
      return {
        statusCode: response.data.statusCode || 200,
        message: response.data.message || 'History retrieved successfully',
        data: response.data.data,
        timestamp: response.data.timestamp || new Date().toISOString(),
      };
    } catch (error) {
      console.error('🔴 [ChatService] [getChatHistory] [error]:', error);
      throw new Error('Failed to get chat history');
    }
  }

  // Utility method to generate unique user ID
  generateUserId(): string {
    const existingUserId = localStorage.getItem('chat_user_id');
    if (existingUserId) {
      return existingUserId;
    }

    const newUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('chat_user_id', newUserId);
    return newUserId;
  }

  // Utility method to extract token from URL
  extractTokenFromUrl(): string | null {
    try {
      const url = window.location.href;
      const match = url.match(/\/token\/([^\/\?#]+)/);
      return match ? match[1] : null;
    } catch (error) {
      console.error('🔴 [ChatService] [extractTokenFromUrl] [error]:', error);
      return null;
    }
  }

  // Utility method to get token from URL or fallback to default
  getCurrentToken(defaultToken: string = 'xpl'): string {
    const urlToken = this.extractTokenFromUrl();
    return urlToken || defaultToken;
  }
}

// Export singleton instance
export const chatService = new ChatService();
