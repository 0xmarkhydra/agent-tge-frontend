import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { UserType, type RegisterData } from '../../types/auth';
import { authService } from '../../services/authService';

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  onSwitchToLogin,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<RegisterData & { confirmPassword: string }>();

  const password = watch('password');

  const onSubmit = async (data: RegisterData & { confirmPassword: string }) => {
    try {
      setError(null);
      setIsLoading(true);
      console.log('🔍 [RegisterForm] [onSubmit] attempting registration');

      const registerData: RegisterData = {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        userType: data.userType,
      };

      await authService.register(registerData);
      console.log('✅ [RegisterForm] [onSubmit] registration successful');
      reset();
      // After successful registration, switch to login form
      onSwitchToLogin?.();
    } catch (error: any) {
      console.error('🔴 [RegisterForm] [onSubmit] registration failed:', error.message);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="auth-modal max-w-xl px-10 py-12 animate-[slideUp_0.6s_ease-out]">
        {/* Header */}
        <div className="text-center mb-8">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-24 h-12 bg-gradient-to-r from-gray-600 to-gray-800 rounded-xl mb-6">
            <span className="text-white text-lg font-bold">ShopChat</span>
          </div>

          {/* Welcome Text */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Tạo tài khoản mới
          </h1>
          <p className="text-gray-600 text-sm mb-6">
            Đăng ký để bắt đầu hành trình của bạn
          </p>
        </div>

        {/* Form */}
        <form className="grid gap-y-4 gap-x-6 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
              Họ
            </label>
            <input
              {...register('firstName', {
                required: 'Họ là bắt buộc',
                minLength: {
                  value: 2,
                  message: 'Họ phải có ít nhất 2 ký tự',
                },
              })}
              type="text"
              autoComplete="given-name"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Nguyễn"
            />
            {errors.firstName && (
              <p className="mt-2 text-sm text-red-500">{errors.firstName.message}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
              Tên
            </label>
            <input
              {...register('lastName', {
                required: 'Tên là bắt buộc',
                minLength: {
                  value: 2,
                  message: 'Tên phải có ít nhất 2 ký tự',
                },
              })}
              type="text"
              autoComplete="family-name"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Văn A"
            />
            {errors.lastName && (
              <p className="mt-2 text-sm text-red-500">{errors.lastName.message}</p>
            )}
          </div>

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

          {/* Phone Field */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Số điện thoại (tùy chọn)
            </label>
            <input
              {...register('phone', {
                pattern: {
                  value: /^[0-9+\-\s()]+$/,
                  message: 'Số điện thoại không hợp lệ',
                },
              })}
              type="tel"
              autoComplete="tel"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="0901234567"
            />
            {errors.phone && (
              <p className="mt-2 text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          {/* User Type Field */}
          <div className="md:col-span-2">
            <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-2">
              Loại tài khoản
            </label>
            <select
              {...register('userType', {
                required: 'Vui lòng chọn loại tài khoản',
              })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Chọn loại tài khoản</option>
              <option value={UserType.BRAND_OWNER}>Chủ thương hiệu - Quản lý nhiều cửa hàng</option>
              <option value={UserType.SHOP_OWNER}>Chủ cửa hàng - Quản lý 1 cửa hàng</option>
              <option value={UserType.SHOP_MANAGER}>Quản lý cửa hàng - Điều hành hoạt động</option>
              <option value={UserType.SHOP_STAFF}>Nhân viên cửa hàng - Xử lý đơn hàng</option>
              <option value={UserType.CUSTOMER_SERVICE}>Hỗ trợ khách hàng - Chăm sóc khách hàng</option>
            </select>
            {errors.userType && (
              <p className="mt-2 text-sm text-red-500">{errors.userType.message}</p>
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
                autoComplete="new-password"
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

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Xác nhận mật khẩu
            </label>
            <div className="relative">
              <input
                {...register('confirmPassword', {
                  required: 'Vui lòng xác nhận mật khẩu',
                  validate: (value) =>
                    value === password || 'Mật khẩu xác nhận không khớp',
                })}
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Nhập lại mật khẩu"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
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
            {errors.confirmPassword && (
              <p className="mt-2 text-sm text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="md:col-span-2 bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            className="md:col-span-2 w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang tạo tài khoản...
              </>
            ) : (
              'Tạo tài khoản'
            )}
          </button>

          {/* Login Link */}
          <div className="text-center pt-4">
            <span className="text-sm text-gray-600">
              Đã có tài khoản?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                Đăng nhập ngay
              </button>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}; 