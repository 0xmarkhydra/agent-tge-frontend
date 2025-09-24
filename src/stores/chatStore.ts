import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { chatService } from '../services/chatService';
import type { ChatState, ChatActions, ChatMessage } from '../types/chat';

interface ChatStore extends ChatState, ChatActions {}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      // State
      messages: [],
      isLoading: false,
      isTyping: false,
      error: null,
      currentToken: 'xpl',
      currentUserId: '',
      isOpen: false,

      // Actions
      sendMessage: async (question: string) => {
        const { currentUserId, currentToken, messages } = get();
        
        if (!question.trim()) return;

        set({ isLoading: true, error: null });

        // Add user message to UI immediately
        const userMessage: ChatMessage = {
          id: `user_${Date.now()}`,
          user_id: currentUserId,
          token_slug: currentToken,
          question: question.trim(),
          answer: '',
          message_order: messages.length + 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        set({ 
          messages: [...messages, userMessage],
          isTyping: true,
        });

        try {
          // Send to backend
          const response = await chatService.sendMessage({
            user_id: currentUserId,
            token_slug: currentToken,
            question: question.trim(),
          });

          // Update user message with real response
          const updatedUserMessage = {
            ...userMessage,
            id: response.data.metadata?.message_id || userMessage.id,
            answer: response.data.answer,
            metadata: response.data.metadata ? {
              processing_time: response.data.metadata.processing_time,
              model_used: response.data.metadata.model_used,
              timestamp: new Date().toISOString(),
              context_messages: response.data.metadata.context_messages,
              has_token_data: response.data.metadata.has_token_data,
              has_project_data: response.data.metadata.has_project_data,
              api_calls: response.data.metadata.api_calls,
            } : undefined,
            citations: response.data.citations,
          };

          set(state => ({
            messages: state.messages.map(msg => 
              msg.id === userMessage.id ? updatedUserMessage : msg
            ),
            isTyping: false,
            isLoading: false,
          }));

        } catch (error) {
          console.error('🔴 [ChatStore] [sendMessage] [error]:', error);
          
          // Update user message with error
          set(state => ({
            messages: state.messages.map(msg => 
              msg.id === userMessage.id 
                ? { 
                    ...msg, 
                    answer: 'Sorry, I encountered an error. Please try again.',
                    metadata: { 
                      processing_time: 0, 
                      model_used: 'error',
                      timestamp: new Date().toISOString(),
                      context_messages: 0 
                    }
                  }
                : msg
            ),
            isTyping: false,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          }));
        }
      },

      loadHistory: async () => {
        const { currentUserId, currentToken } = get();
        
        if (!currentUserId || !currentToken) return;

        set({ isLoading: true, error: null });

        try {
          const response = await chatService.getChatHistory(currentUserId, currentToken);
          
          set({ 
            messages: response.data,
            isLoading: false,
          });

        } catch (error) {
          console.error('🔴 [ChatStore] [loadHistory] [error]:', error);
          set({ 
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to load history',
          });
        }
      },

      clearHistory: () => {
        set({ messages: [] });
      },

      setToken: (token: string) => {
        set({ currentToken: token });
        // Reload history when token changes
        get().loadHistory();
      },

      setUserId: (userId: string) => {
        set({ currentUserId: userId });
      },

      toggleWidget: () => {
        set(state => ({ isOpen: !state.isOpen }));
      },

      setOpen: (isOpen: boolean) => {
        set({ isOpen });
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      setTyping: (isTyping: boolean) => {
        set({ isTyping });
      },

      setError: (error: string | null) => {
        set({ error });
      },
    }),
    {
      name: 'chat-store',
      partialize: (state) => ({
        currentToken: state.currentToken,
        currentUserId: state.currentUserId,
        messages: state.messages.slice(-10), // Keep only last 10 messages
      }),
    }
  )
);
