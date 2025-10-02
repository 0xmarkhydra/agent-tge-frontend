// Environment Configuration
export const ENV = {
  // API Configuration
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  
  // App Configuration
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Chat Widget',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  
  // Development Settings
  DEBUG: import.meta.env.VITE_DEBUG === 'true' || import.meta.env.DEV,
  LOG_LEVEL: import.meta.env.VITE_LOG_LEVEL || 'info',
  
  // Widget Configuration
  WIDGET_URL: import.meta.env.VITE_WIDGET_URL || 'http://localhost:5173',
} as const;

// Log environment info in development
if (ENV.DEBUG) {
  console.log('🔧 [Environment] Configuration:', {
    API_URL: ENV.API_URL,
    API_BASE_URL: ENV.API_BASE_URL,
    APP_NAME: ENV.APP_NAME,
    APP_VERSION: ENV.APP_VERSION,
    DEBUG: ENV.DEBUG,
    LOG_LEVEL: ENV.LOG_LEVEL,
  });
}
