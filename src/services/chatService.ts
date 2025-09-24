import { apiClient } from './apiClient';
import type { ChatRequest, ChatResponse, ChatHistoryResponse } from '../types/chat';

export interface StreamChunk {
  type: 'metadata' | 'chunk' | 'complete';
  data: any;
}

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

  // Streaming message method
  async sendMessageStream(
    request: ChatRequest,
    onChunk: (chunk: StreamChunk) => void,
    onComplete: () => void,
    onError: (error: Error) => void
  ): Promise<void> {
    try {
      console.log('🔄 [ChatService] [sendMessageStream] [request]:', request);
      
      const response = await fetch(`${apiClient.baseURL}${this.baseUrl}/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...apiClient.headers,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body reader available');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          console.log('✅ [ChatService] [sendMessageStream] [complete]');
          onComplete();
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.trim() === '') continue;
          
          try {
            // Handle Server-Sent Events format
            if (line.startsWith('data: ')) {
              const data = line.slice(6); // Remove 'data: ' prefix
              if (data === '[DONE]') {
                onComplete();
                return;
              }
              
              const chunk: StreamChunk = JSON.parse(data);
              console.log('📦 [ChatService] [sendMessageStream] [chunk]:', chunk);
              onChunk(chunk);
            }
          } catch (error) {
            console.error('🔴 [ChatService] [sendMessageStream] [parse_error]:', error);
          }
        }
      }
    } catch (error) {
      console.error('🔴 [ChatService] [sendMessageStream] [error]:', error);
      onError(error as Error);
    }
  }
}

// Export singleton instance
export const chatService = new ChatService();
