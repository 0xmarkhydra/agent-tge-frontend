export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  userType: UserType;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export const UserType = {
  BRAND_OWNER: 'brand_owner',      // Chủ thương hiệu (có thể có nhiều shop)
  SHOP_OWNER: 'shop_owner',        // Chủ cửa hàng (chỉ 1 shop)
  SHOP_MANAGER: 'shop_manager',    // Quản lý cửa hàng
  SHOP_STAFF: 'shop_staff',        // Nhân viên cửa hàng
  CUSTOMER_SERVICE: 'customer_service' // Hỗ trợ khách hàng
} as const;

export type UserType = typeof UserType[keyof typeof UserType];

export const UserStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
} as const;

export type UserStatus = typeof UserStatus[keyof typeof UserStatus];

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  userType: UserType;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

export interface StandardApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface RefreshTokenData {
  refreshToken: string;
} 