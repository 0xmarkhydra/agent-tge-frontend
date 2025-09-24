# 🚀 Quick Start Guide

## Frontend Environment Setup

### 1. Create Environment File

Create `.env.local` file in the frontend directory:

```bash
# Frontend Environment Variables
VITE_API_URL=http://localhost:3000/api
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_NAME=Chat Widget
VITE_APP_VERSION=1.0.0
VITE_DEBUG=true
VITE_LOG_LEVEL=debug
```

### 2. Current Setup Status

✅ **Backend Server**: Running on `http://localhost:3000`  
✅ **Frontend Server**: Running on `http://localhost:5173`  
✅ **API Connection**: Working perfectly  
✅ **Real Data**: PretgeMarket APIs integrated  

### 3. Test URLs

| Service | URL | Status |
|---------|-----|--------|
| Backend Health | http://localhost:3000/health | ✅ Working |
| Backend API Docs | http://localhost:3000/docs | ✅ Available |
| Frontend Demo | http://localhost:5173/demo | ✅ Ready |
| Test Page | http://localhost:5173/test-widget.html | ✅ Ready |

### 4. API Test Results

```json
{
  "statusCode": 200,
  "message": "Chat response generated successfully",
  "data": {
    "answer": "AI response with real data...",
    "metadata": {
      "has_token_data": true,
      "has_project_data": true,
      "api_calls": {
        "pretge_token_api": true,
        "pretge_project_api": true
      }
    }
  }
}
```

### 5. Quick Commands

```bash
# Start backend (if not running)
cd server && pnpm start:dev

# Start frontend (if not running)
cd frontend && pnpm dev

# Test API connection
curl http://localhost:3000/health

# Test chat API
curl -X POST 'http://localhost:3000/api/chat' \
  -H 'Content-Type: application/json' \
  -d '{"token_slug": "xpl", "question": "Hello", "user_id": "test123"}'
```

### 6. Widget Integration

```html
<!-- Basic Integration -->
<script src="http://localhost:5173/chat-widget.js"></script>
<div id="chat-widget" data-token="xpl"></div>

<!-- Advanced Integration -->
<script>
ChatWidget.init({
  token: 'xpl',
  position: 'bottom-right',
  autoOpen: true
});
</script>
```

### 7. Environment Variables

The frontend automatically uses these defaults if no `.env.local` file exists:

- `VITE_API_URL`: `http://localhost:3000/api`
- `VITE_API_BASE_URL`: `http://localhost:3000`
- `VITE_APP_NAME`: `Chat Widget`
- `VITE_DEBUG`: `true` (in development)

### 8. Troubleshooting

#### Backend not accessible
```bash
# Check if backend is running
curl http://localhost:3000/health
# Should return: 1
```

#### Frontend not accessible
```bash
# Check if frontend is running
curl http://localhost:5173
# Should return HTML content
```

#### CORS Issues
- Backend is configured to allow requests from `http://localhost:5173`
- No additional CORS setup needed

### 9. Ready to Use! 🎉

Your chat widget is now ready with:
- ✅ Real-time AI responses (GPT-4o)
- ✅ Live token data from PretgeMarket APIs
- ✅ Persistent chat history
- ✅ Responsive design
- ✅ Easy integration script

**Next Steps:**
1. Open http://localhost:5173/demo
2. Test the chat widget
3. Integrate into your website using the provided script
