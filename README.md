# Frontend - React Dashboard

Frontend dashboard được xây dựng với React 19, Vite, TypeScript và Tailwind CSS. Cung cấp giao diện người dùng hiện đại cho quản lý hệ thống.

## 🏗️ Kiến trúc

```
frontend/
├── src/
│   ├── components/     # Reusable components
│   │   ├── auth/      # Authentication components
│   │   ├── chat/      # Chat components
│   │   └── layout/    # Layout components
│   ├── pages/         # Page components
│   ├── services/      # API services
│   ├── stores/        # State management (Zustand)
│   ├── types/         # TypeScript types
│   ├── assets/        # Static assets
│   └── main.tsx      # Application entry point
├── public/            # Public assets
└── index.html        # HTML template
```

## 🚀 Công nghệ sử dụng

- **React 19** - UI framework
- **Vite** - Build tool & dev server
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - State management
- **React Router** - Client-side routing
- **React Hook Form** - Form handling
- **Axios** - HTTP client

## 📦 Cài đặt

### Yêu cầu hệ thống
- Node.js >= 18
- pnpm (khuyến nghị) hoặc npm

### Setup

```bash
# Cài đặt dependencies
pnpm install

# Chạy development server
pnpm run dev
```

## 🔧 Configuration

### Environment Variables

Tạo file `.env` trong thư mục `frontend/`:

```env
# API Configuration
VITE_API_URL=https://api-agent.pretgemarket.xyz
VITE_API_TIMEOUT=10000

# App Configuration
VITE_APP_NAME=StartKit Dashboard
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_CHAT=true
VITE_ENABLE_ANALYTICS=false
```

### Vite Configuration

File `vite.config.ts`:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://api-agent.pretgemarket.xyz',
        changeOrigin: true
      }
    }
  }
})
```

## 🏃‍♂️ Chạy ứng dụng

### Development

```bash
# Development server với hot reload
pnpm run dev

# Build cho production
pnpm run build

# Preview build
pnpm run preview
```

### Code Quality

```bash
# Lint code
pnpm run lint

# Type checking
pnpm run type-check
```

## 📁 Cấu trúc components

### Authentication Components (`/src/components/auth/`)
- `LoginForm.tsx` - Form đăng nhập
- `RegisterForm.tsx` - Form đăng ký
- Authentication logic và validation

### Chat Components (`/src/components/chat/`)
- `ChatWindow.tsx` - Giao diện chat chính
- Real-time messaging
- Message history

### Layout Components (`/src/components/layout/`)
- `Layout.tsx` - Layout chính của ứng dụng
- Navigation và sidebar
- Responsive design

## 📄 Pages

### AuthPage (`/src/pages/AuthPage.tsx`)
- Trang đăng nhập/đăng ký
- Form validation
- Error handling

### ChatPage (`/src/pages/ChatPage.tsx`)
- Trang chat chính
- Real-time communication
- Message management

## 🔄 State Management

### Zustand Stores (`/src/stores/`)

#### AuthStore (`authStore.ts`)
```typescript
interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
}
```

### Store Usage
```typescript
import { useAuthStore } from '@/stores/authStore'

const { user, login, logout } = useAuthStore()
```

## 🌐 API Integration

### API Client (`/src/services/apiClient.ts`)
- Axios configuration
- Request/response interceptors
- Error handling
- Authentication headers

### Services (`/src/services/`)

#### AuthService (`authService.ts`)
```typescript
class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse>
  async register(userData: RegisterData): Promise<AuthResponse>
  async logout(): Promise<void>
  async refreshToken(): Promise<AuthResponse>
}
```

## 🎨 Styling

### Tailwind CSS
- Utility-first approach
- Custom design system
- Responsive design
- Dark mode support

### CSS Structure
```css
/* Custom styles in src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom components */
@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700;
  }
}
```

## 🛣️ Routing

### React Router Configuration
```typescript
import { createBrowserRouter } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/auth',
    element: <AuthPage />
  },
  {
    path: '/chat',
    element: <ChatPage />,
    protected: true
  }
])
```

### Protected Routes
- Authentication guards
- Route protection
- Redirect logic

## 📝 Forms

### React Hook Form
- Form validation
- Error handling
- Performance optimization
- TypeScript integration

### Form Example
```typescript
import { useForm } from 'react-hook-form'

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>()
  
  const onSubmit = (data: LoginFormData) => {
    // Handle form submission
  }
}
```

## 🔐 Authentication

### JWT Token Management
- Token storage (localStorage/sessionStorage)
- Token refresh mechanism
- Automatic logout on expiration

### Auth Guards
- Protected route components
- Authentication state checking
- Redirect to login

## 🌐 Real-time Features

### WebSocket Integration
- Real-time chat functionality
- Connection management
- Message broadcasting

### Chat Features
- Live messaging
- Message history
- Typing indicators
- Online status

## 📱 Responsive Design

### Mobile-First Approach
- Tailwind responsive utilities
- Touch-friendly interfaces
- Mobile navigation

### Breakpoints
```css
/* Tailwind breakpoints */
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

## 🧪 Testing

### Unit Testing
```bash
# Run tests
pnpm run test

# Run tests in watch mode
pnpm run test:watch

# Run tests with coverage
pnpm run test:coverage
```

### Testing Libraries
- Vitest - Testing framework
- React Testing Library - Component testing
- MSW - API mocking

## 🚀 Build & Deployment

### Production Build
```bash
# Build application
pnpm run build

# Preview build locally
pnpm run preview
```

### Build Output
```
dist/
├── index.html
├── assets/
│   ├── css/
│   ├── js/
│   └── images/
└── favicon.ico
```

### Deployment Options
- **Vercel** - Zero-config deployment
- **Netlify** - Static site hosting
- **AWS S3** - Static website hosting
- **Docker** - Containerized deployment

## 🔧 Development Tools

### ESLint Configuration
```javascript
// eslint.config.js
export default [
  js.configs.recommended,
  react.configs.recommended,
  {
    rules: {
      // Custom rules
    }
  }
]
```

### TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["DOM", "DOM.Iterable", "ES6"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

## 📊 Performance

### Optimization Techniques
- Code splitting
- Lazy loading
- Image optimization
- Bundle analysis

### Bundle Analysis
```bash
# Analyze bundle size
pnpm run build --analyze
```

## 🔒 Security

### Security Best Practices
- Input sanitization
- XSS prevention
- CSRF protection
- Secure token storage

### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self' 'unsafe-inline'">
```

## 🆘 Troubleshooting

### Common Issues

1. **Build Errors**
   - Check TypeScript errors
   - Verify dependencies
   - Clear node_modules and reinstall

2. **Runtime Errors**
   - Check browser console
   - Verify API endpoints
   - Check authentication state

3. **Performance Issues**
   - Analyze bundle size
   - Check for memory leaks
   - Optimize images and assets

### Debug Mode
```bash
# Enable debug logging
DEBUG=* pnpm run dev

# Open browser dev tools
# Check Network tab for API calls
# Check Console for errors
```

## 📚 Tài liệu tham khảo

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [React Router Documentation](https://reactrouter.com/)

## 🤝 Contributing

### Development Workflow
1. Create feature branch
2. Make changes
3. Run tests
4. Submit pull request

### Code Standards
- Follow TypeScript best practices
- Use ESLint rules
- Write meaningful commit messages
- Add tests for new features

---

**Frontend Team** - StartKit Fullstack
