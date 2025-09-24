import React, { useEffect, useRef } from 'react';
import { useChatStore } from '../../stores/chatStore';
import { chatService } from '../../services/chatService';
import { Message } from './Message';
import { MessageInput } from './MessageInput';
import { TypingIndicator } from './TypingIndicator';
import { WelcomeMessage } from './WelcomeMessage';

interface ChatWidgetProps {
  tokenSlug?: string;
  userId?: string;
  className?: string;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ 
  tokenSlug,
  userId,
  className = ''
}) => {
  const {
    messages,
    isLoading,
    isTyping,
    error,
    currentToken,
    sendMessage,
    loadHistory,
    setToken,
    setUserId,
    setError,
  } = useChatStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Initialize widget
  useEffect(() => {
    const initWidget = async () => {
      try {
        // Set token and user ID
        const finalToken = tokenSlug || chatService.getCurrentToken();
        const finalUserId = userId || chatService.generateUserId();
        
        setToken(finalToken);
        setUserId(finalUserId);

        // Load chat history
        await loadHistory();
      } catch (error) {
        console.error('🔴 [ChatWidget] [initWidget] [error]:', error);
        setError('Failed to initialize chat widget');
      }
    };

    initWidget();
  }, [tokenSlug, userId, setToken, setUserId, loadHistory, setError]);

  const handleSendMessage = async (question: string) => {
    try {
      await sendMessage(question);
    } catch (error) {
      console.error('🔴 [ChatWidget] [handleSendMessage] [error]:', error);
    }
  };

  const handleQuickAction = (action: string) => {
    handleSendMessage(action);
  };

  return (
    <div className={`flex flex-col h-full bg-gray-50 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">🤖</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {currentToken.toUpperCase()} AI Assistant
            </h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-500">Online</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Token indicator */}
          <div className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
            {currentToken.toUpperCase()}
          </div>
          
          {/* Refresh button */}
          <button 
            onClick={loadHistory}
            disabled={isLoading}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="px-6 py-3 bg-red-50 border-b border-red-200">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-red-700">{error}</span>
          </div>
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Show welcome message if no messages */}
        {messages.length === 0 && !isLoading && (
          <WelcomeMessage 
            tokenSlug={currentToken}
            onQuickAction={handleQuickAction}
          />
        )}

        {/* Render messages */}
        {messages.map((message, index) => {
          const isUser = Boolean(message.question && !message.answer);
          return (
            <Message
              key={message.id || index}
              message={message}
              isUser={isUser}
            />
          );
        })}

        {/* Typing indicator */}
        <TypingIndicator isVisible={isTyping} />

        {/* Loading indicator */}
        {isLoading && messages.length === 0 && (
          <div className="flex justify-center items-center py-8">
            <div className="flex items-center space-x-2 text-gray-500">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Loading chat history...</span>
            </div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        disabled={!!error}
      />
    </div>
  );
};
