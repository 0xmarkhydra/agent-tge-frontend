import React, { useState, useRef, useEffect } from 'react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage, 
  isLoading, 
  disabled = false 
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [message]);

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4 bg-white">
      <div className="flex items-end space-x-3">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about the token..."
            disabled={disabled || isLoading}
            rows={1}
            className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none min-h-[48px] max-h-32"
          />
          
          {/* Attachment button */}
          <button
            type="button"
            disabled={disabled || isLoading}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200 disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
        </div>
        
        {/* Send button */}
        <button
          type="submit"
          disabled={!message.trim() || isLoading || disabled}
          className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl shadow-sm transition-all duration-200 transform hover:-translate-y-0.5 disabled:transform-none disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </div>
      
      {/* Helper text */}
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-gray-500">
          Press Enter to send, Shift+Enter for new line
        </span>
        {isLoading && (
          <span className="text-xs text-blue-600 flex items-center">
            <div className="w-3 h-3 border border-blue-600 border-t-transparent rounded-full animate-spin mr-1" />
            AI is thinking...
          </span>
        )}
      </div>
    </form>
  );
};
