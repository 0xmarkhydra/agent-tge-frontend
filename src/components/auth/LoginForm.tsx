import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../stores/authStore';
import type { LoginCredentials } from '../../types/auth';

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ 
  onSuccess, 
  onSwitchToRegister 
}) => {
  const { login, isLoading, error, clearError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginCredentials>();

  const onSubmit = async (data: LoginCredentials) => {
    try {
      clearError();
      console.log('🔍 [LoginForm] [onSubmit] attempting login');
      await login(data);
      console.log('✅ [LoginForm] [onSubmit] login successful');
      reset();
      onSuccess?.();
    } catch (error: any) {
      console.error('🔴 [LoginForm] [onSubmit] login failed:', error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="auth-modal p-8 animate-[slideUp_0.6s_ease-out]">
        {/* Header */}
        <div className="text-center mb-8">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-24 h-12 bg-gradient-to-r from-gray-600 to-gray-800 rounded-xl mb-6">
            <span className="text-white text-lg font-bold">ShopChat</span>
          </div>
          
          {/* Welcome Text */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Chào mừng trở lại
          </h1>
          <p className="text-gray-600 text-sm mb-6">
            Đăng nhập để tiếp tục hành trình của bạn
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              {...register('email', {
                required: 'Email là bắt buộc',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email không hợp lệ',
                },
              })}
              type="email"
              autoComplete="email"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="example@gmail.com"
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                {...register('password', {
                  required: 'Mật khẩu là bắt buộc',
                  minLength: {
                    value: 6,
                    message: 'Mật khẩu phải có ít nhất 6 ký tự',
                  },
                })}
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Nhập mật khẩu"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-2 text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200"
              onClick={() => console.log('🔍 [LoginForm] [forgotPassword] feature coming soon')}
            >
              Quên mật khẩu?
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang đăng nhập...
              </>
            ) : (
              'Đăng nhập'
            )}
          </button>

          {/* Register Link */}
          <div className="text-center pt-4">
            <span className="text-sm text-gray-600">
              Chưa có tài khoản?{' '}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                Đăng ký miễn phí
              </button>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}; 