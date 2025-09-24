# Environment Setup Guide

## Frontend Environment Configuration

### 1. Create Environment File

Create a `.env.local` file in the frontend directory:

```bash
# Frontend Environment Variables
VITE_API_URL=https://api-agent.pretgemarket.xyz/api
VITE_API_BASE_URL=https://api-agent.pretgemarket.xyz
VITE_APP_NAME=Chat Widget
VITE_APP_VERSION=1.0.0
VITE_DEBUG=true
VITE_LOG_LEVEL=debug
```

### 2. Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_URL` | Backend API URL | `https://api-agent.pretgemarket.xyz/api` | No |
| `VITE_API_BASE_URL` | Backend base URL | `https://api-agent.pretgemarket.xyz` | No |
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
- **Backend API**: `https://api-agent.pretgemarket.xyz/api`
- **Frontend Dev Server**: `https://agent.pretgemarket.xyz`

### 5. Testing the Connection

You can test the API connection by running:

```bash
# Test backend health
curl https://api-agent.pretgemarket.xyz/health

# Test chat API
curl -X POST 'https://api-agent.pretgemarket.xyz/api/chat' \
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
- Check if backend is accessible: `curl https://api-agent.pretgemarket.xyz/health`

#### CORS Issues
- Backend should allow requests from `https://agent.pretgemarket.xyz`
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
   - Open `https://agent.pretgemarket.xyz/demo`
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
