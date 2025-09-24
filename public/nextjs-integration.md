# 🚀 Next.js Integration Guide

## ✅ **Chat Widget tương thích với Next.js**

File `chat-widget-nextjs.js` đã được tối ưu để hoạt động hoàn hảo với Next.js, bao gồm:

### 🎯 **Tính năng chính:**
- ✅ **Client-side routing detection** - Tự động detect khi user navigate
- ✅ **Dynamic routes support** - Hỗ trợ `/token/[name]`, `/crypto/[name]`, etc.
- ✅ **SSR/SSG compatible** - Hoạt động với Server-Side Rendering
- ✅ **Auto token detection** - Tự động detect token từ URL
- ✅ **Route change listening** - Lắng nghe thay đổi route

---

## 📦 **Cách tích hợp vào Next.js**

### **1. Thêm script vào `_app.js` hoặc `_document.js`**

```jsx
// pages/_app.js hoặc pages/_document.js
import Head from 'next/head'

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* Chat Widget Container */}
        <div id="chat-widget"></div>
        
        {/* Chat Widget Script */}
        <script 
          src="https://agent.pretgemarket.xyz/chat-widget-nextjs.js"
          data-auto-init="true"
          data-auto-open="false"
          data-show-notification="true"
        />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
```

### **2. Hoặc sử dụng trong component**

```jsx
// components/ChatWidget.jsx
import { useEffect } from 'react'

export default function ChatWidget() {
  useEffect(() => {
    // Load script dynamically
    const script = document.createElement('script')
    script.src = 'https://agent.pretgemarket.xyz/chat-widget-nextjs.js'
    script.async = true
    document.head.appendChild(script)
    
    // Initialize when script loads
    script.onload = () => {
      if (window.ChatWidget) {
        window.ChatWidget.init({
          autoOpen: false,
          showNotification: true,
          position: 'bottom-right'
        })
      }
    }
    
    return () => {
      // Cleanup
      document.head.removeChild(script)
    }
  }, [])
  
  return <div id="chat-widget"></div>
}
```

---

## 🛣️ **URL Patterns được hỗ trợ**

Widget sẽ tự động detect và mở khi URL match các pattern sau:

```javascript
// ✅ Được hỗ trợ:
/token/btc          // Bitcoin
/token/eth          // Ethereum  
/token/xpl          // Plasma
/crypto/btc         // Alternative pattern
/coin/eth           // Alternative pattern
/tokens/btc         // Plural form
/coins/eth          // Plural form

// ❌ Không tự động mở:
/                   // Home page
/about              // About page
/contact            // Contact page
```

---

## ⚙️ **Configuration Options**

```javascript
// Khởi tạo với options
window.ChatWidget.init({
  position: 'bottom-right',        // 'bottom-right', 'bottom-left', 'top-right', 'top-left'
  theme: 'light',                  // 'light', 'dark'
  width: '400px',                  // Widget width
  height: '600px',                 // Widget height
  autoOpen: false,                 // Tự động mở trên token pages
  showNotification: true           // Hiển thị notification badge
})
```

---

## 🎯 **Ví dụ sử dụng**

### **1. Token Page (`/token/[name].js`)**

```jsx
// pages/token/[name].js
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function TokenPage() {
  const router = useRouter()
  const { name } = router.query
  
  useEffect(() => {
    // Widget sẽ tự động detect token từ URL
    // Không cần code thêm gì
  }, [name])
  
  return (
    <div>
      <h1>Token: {name}</h1>
      <p>Chat widget sẽ tự động mở cho token này</p>
    </div>
  )
}
```

### **2. General Page**

```jsx
// pages/index.js
export default function HomePage() {
  return (
    <div>
      <h1>Welcome to My Crypto Site</h1>
      <p>Chat widget sẽ hiển thị notification badge</p>
    </div>
  )
}
```

---

## 🔧 **Advanced Usage**

### **Manual Token Detection**

```javascript
// Force widget to open for specific token
window.ChatWidget.updateWidgetForToken('btc')

// Force widget to close
window.ChatWidget.closeWidget()

// Check current token
console.log(window.ChatWidget.currentToken)
```

### **Custom Route Patterns**

```javascript
// Thêm custom pattern (trong chat-widget-nextjs.js)
const patterns = [
  /^\/token\/([^\/\?]+)/,     // /token/btc
  /^\/crypto\/([^\/\?]+)/,    // /crypto/btc
  /^\/my-custom\/([^\/\?]+)/, // /my-custom/btc - Thêm pattern mới
]
```

---

## 🚀 **Production Deployment**

### **1. Update CDN URL**

```javascript
// Thay đổi trong chat-widget-nextjs.js
const CDN_CONFIG = {
  apiUrl: 'https://your-production-api.com/api',
  widgetUrl: 'https://your-production-domain.com',
  version: '1.0.0'
}
```

### **2. Environment Variables**

```javascript
// next.config.js
module.exports = {
  env: {
    CHAT_WIDGET_URL: process.env.CHAT_WIDGET_URL || 'https://agent.pretgemarket.xyz'
  }
}
```

---

## 🐛 **Troubleshooting**

### **Widget không hiển thị:**
1. Kiểm tra console errors
2. Đảm bảo script được load
3. Kiểm tra `#chat-widget` element tồn tại

### **Không detect token:**
1. Kiểm tra URL pattern
2. Thêm custom pattern nếu cần
3. Kiểm tra router events

### **Performance issues:**
1. Load script async
2. Sử dụng dynamic import
3. Lazy load widget

---

## 📞 **Support**

Nếu có vấn đề, hãy kiểm tra:
- Browser console logs
- Network requests
- Widget initialization status

**Happy coding! 🎉**
