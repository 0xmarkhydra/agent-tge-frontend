import React from 'react';
import { Layout } from '../components/layout/Layout';
import { ChatWindow } from '../components/chat/ChatWindow';
import { useAuthStore } from '../stores/authStore';

export const ChatPage: React.FC = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      console.log('🔍 [ChatPage] [handleLogout] logging out user');
      await logout();
      console.log('✅ [ChatPage] [handleLogout] logout successful');
    } catch (error: any) {
      console.error('🔴 [ChatPage] [handleLogout] logout failed:', error.message);
    }
  };

  return (
    <Layout>
      <div className="h-full flex flex-col bg-white">
        {/* Clean Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-800 rounded-xl flex items-center justify-center">
                <span className="text-white text-sm font-bold">SC</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                ShopChat
              </h1>
            </div>
            
            {user && (
              <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user.firstName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user.userType.replace('_', ' ')}
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
          >
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Đăng xuất
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1">
          <ChatWindow />
        </div>
      </div>
    </Layout>
  );
}; 