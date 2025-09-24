import React from 'react';
import { ChatWidget } from './ChatWidget';

interface ChatWindowProps {
  tokenSlug?: string;
  userId?: string;
  className?: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ 
  tokenSlug = 'xpl',
  userId,
  className = ''
}) => {
  return (
    <ChatWidget 
      tokenSlug={tokenSlug}
      userId={userId}
      className={className}
    />
  );
}; 