import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { chatService, type StreamChunk } from '../services/chatService';
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
          // Use streaming for better UX
          await chatService.sendMessageStream(
            {
              user_id: currentUserId,
              token_slug: currentToken,
              question: question.trim(),
            },
            // onChunk
            (chunk: StreamChunk) => {
              if (chunk.type === 'chunk') {
                // Append chunk to current message
                set(state => ({
                  messages: state.messages.map(msg => 
                    msg.id === userMessage.id 
                      ? { ...msg, answer: msg.answer + chunk.data }
                      : msg
                  ),
                }));
              } else if (chunk.type === 'metadata') {
                // Update message with metadata
                set(state => ({
                  messages: state.messages.map(msg => 
                    msg.id === userMessage.id 
                      ? { 
                          ...msg, 
                          metadata: {
                            processing_time: 0,
                            model_used: 'gpt-4o',
                            timestamp: new Date().toISOString(),
                            context_messages: chunk.data.context_messages || 0,
                            has_token_data: chunk.data.has_token_data,
                            has_project_data: chunk.data.has_project_data,
                            api_calls: {
                              pretge_token_api: chunk.data.has_token_data || false,
                              pretge_project_api: chunk.data.has_project_data || false,
                            },
                          }
                        }
                      : msg
                  ),
                }));
              } else if (chunk.type === 'complete') {
                // Finalize message with completion data
                set(state => ({
                  messages: state.messages.map(msg => 
                    msg.id === userMessage.id 
                      ? { 
                          ...msg, 
                          id: chunk.data.message_id || msg.id,
                          metadata: msg.metadata ? {
                            ...msg.metadata,
                            processing_time: chunk.data.processing_time || 0,
                            message_id: chunk.data.message_id,
                          } : {
                            processing_time: chunk.data.processing_time || 0,
                            model_used: 'gpt-4o',
                            timestamp: new Date().toISOString(),
                            context_messages: 0,
                            message_id: chunk.data.message_id,
                          },
                          citations: chunk.data.citations || [],
                        }
                      : msg
                  ),
                  isTyping: false,
                  isLoading: false,
                }));
              }
            },
            // onComplete
            () => {
              set({ isTyping: false, isLoading: false });
            },
            // onError
            (error: Error) => {
              console.error('🔴 [ChatStore] [sendMessage] [stream_error]:', error);
              
              // Update user message with error
              set(state => ({
                messages: state.messages.map(msg => 
                  msg.id === userMessage.id 
                    ? { 
                        ...msg, 
                        answer: msg.answer || 'Sorry, I encountered an error. Please try again.',
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
                error: error.message,
              }));
            }
          );

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
