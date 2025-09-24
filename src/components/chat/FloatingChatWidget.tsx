import React, { useState } from 'react';
import { ChatWidget } from './ChatWidget';

interface FloatingChatWidgetProps {
  tokenSlug?: string;
  userId?: string;
  position?: 'bottom-right' | 'bottom-left';
  theme?: 'light' | 'dark';
}

export const FloatingChatWidget: React.FC<FloatingChatWidgetProps> = ({
  tokenSlug = 'xpl',
  userId,
  position = 'bottom-right',
  theme = 'light'
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6'
  };

  const themeClasses = {
    light: 'bg-white text-gray-900 shadow-lg border border-gray-200',
    dark: 'bg-gray-900 text-white shadow-xl border border-gray-700'
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      {/* Chat Widget */}
      {isOpen && (
        <div className={`w-96 h-[600px] rounded-2xl ${themeClasses[theme]} mb-4 overflow-hidden`}>
          <ChatWidget 
            tokenSlug={tokenSlug}
            userId={userId}
            className="h-full"
          />
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${
          isOpen 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-blue-600 hover:bg-blue-700'
        } shadow-lg`}
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Notification badge */}
      {!isOpen && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-xs text-white font-bold">!</span>
        </div>
      )}
    </div>
  );
};
