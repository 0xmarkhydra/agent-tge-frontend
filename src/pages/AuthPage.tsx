import React, { useState, useEffect } from 'react';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';
import { useAuthStore } from '../stores/authStore';
import { useLocation, useNavigate } from 'react-router-dom';

export const AuthPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialIsLogin = !location.pathname.includes('register');
  const [isLogin, setIsLogin] = useState(initialIsLogin);
  const { isAuthenticated, initializeAuth } = useAuthStore();

  useEffect(() => {
    // Initialize auth when the component mounts
    initializeAuth();
  }, [initializeAuth]);

  const handleAuthSuccess = () => {
    console.log('✅ [AuthPage] [handleAuthSuccess] authentication successful');
    // Navigation will be handled by the router based on isAuthenticated state
  };

  const switchToRegister = () => {
    console.log('🔄 [AuthPage] [switchToRegister] switching to register form');
    setIsLogin(false);
    navigate('/auth/register');
  };

  const switchToLogin = () => {
    console.log('🔄 [AuthPage] [switchToLogin] switching to login form');
    setIsLogin(true);
    navigate('/auth/login');
  };

  // If user is already authenticated, show a loading state
  // The router will redirect them to the chat page
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang chuyển hướng...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {isLogin ? (
        <LoginForm 
          onSuccess={handleAuthSuccess}
          onSwitchToRegister={switchToRegister}
        />
      ) : (
        <RegisterForm 
          onSwitchToLogin={switchToLogin}
        />
      )}
    </>
  );
}; 