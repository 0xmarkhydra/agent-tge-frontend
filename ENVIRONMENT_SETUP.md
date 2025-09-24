# Environment Setup Guide

## Frontend Environment Configuration

### 1. Create Environment File

Create a `.env.local` file in the frontend directory:

```bash
# Frontend Environment Variables
VITE_API_URL=http://localhost:3000/api
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_NAME=Chat Widget
VITE_APP_VERSION=1.0.0
VITE_DEBUG=true
VITE_LOG_LEVEL=debug
```

### 2. Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_URL` | Backend API URL | `http://localhost:3000/api` | No |
| `VITE_API_BASE_URL` | Backend base URL | `http://localhost:3000` | No |
| `VITE_APP_NAME` | Application name | `Chat Widget` | No |
| `VITE_APP_VERSION` | Application version | `1.0.0` | No |
| `VITE_DEBUG` | Enable debug mode | `true` in dev | No |
| `VITE_LOG_LEVEL` | Logging level | `debug` | No |

### 3. Production Configuration

For production deployment, update the environment variables:

```bash
# Production Environment
VITE_API_URL=https://your-api-domain.com/api
VITE_API_BASE_URL=https://your-api-domain.com
VITE_APP_NAME=Chat Widget
VITE_APP_VERSION=1.0.0
VITE_DEBUG=false
VITE_LOG_LEVEL=info
```

### 4. Current Configuration

The frontend is currently configured to connect to:
- **Backend API**: `http://localhost:3000/api`
- **Frontend Dev Server**: `http://localhost:5173`

### 5. Testing the Connection

You can test the API connection by running:

```bash
# Test backend health
curl http://localhost:3000/health

# Test chat API
curl -X POST 'http://localhost:3000/api/chat' \
  -H 'Content-Type: application/json' \
  -d '{
    "token_slug": "xpl",
    "question": "What is XPL?",
    "user_id": "test_user_123"
  }'
```

### 6. Troubleshooting

#### Backend not accessible
- Ensure backend server is running on port 3000
- Check if backend is accessible: `curl http://localhost:3000/health`

#### CORS Issues
- Backend should allow requests from `http://localhost:5173`
- Check backend CORS configuration

#### Environment variables not loading
- Ensure `.env.local` file is in the frontend root directory
- Restart the development server after changing environment variables
- Check if variables start with `VITE_` prefix

### 7. Development Workflow

1. **Start Backend Server**:
   ```bash
   cd server
   pnpm start:dev
   ```

2. **Start Frontend Server**:
   ```bash
   cd frontend
   pnpm dev
   ```

3. **Test Integration**:
   - Open `http://localhost:5173/demo`
   - Test chat widget functionality
   - Check browser console for any errors

### 8. Build for Production

```bash
# Build frontend
cd frontend
pnpm build

# The built files will be in the `dist` directory
# Serve with any static file server
```
