(function() {
  'use strict';

  // CDN Configuration
  const CDN_CONFIG = {
    apiUrl: 'https://api-agent.pretgemarket.xyz/api',
    widgetUrl: 'https://agent.pretgemarket.xyz',
    version: '1.0.0',
    cdnVersion: '1.0.0'
  };

  // Next.js compatible Chat Widget
  class NextJSChatWidget {
    constructor() {
      this.isInitialized = false;
      this.currentToken = null;
      this.widgetContainer = null;
      this.isOpen = false;
      this.router = null;
      this.pathname = '';
      
      // Bind methods
      this.handleRouteChange = this.handleRouteChange.bind(this);
      this.init = this.init.bind(this);
    }

    // Initialize widget for Next.js
    init(options = {}) {
      if (this.isInitialized) {
        console.warn('Chat widget already initialized');
        return;
      }

      this.options = {
        position: 'bottom-right',
        theme: 'light',
        width: '400px',
        height: '600px',
        autoOpen: false,
        showNotification: true,
        ...options
      };

      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.setupWidget());
      } else {
        this.setupWidget();
      }

      // Setup Next.js router detection
      this.setupNextJSRouter();
      
      this.isInitialized = true;
      console.log('✅ Next.js Chat Widget initialized');
    }

    // Setup Next.js router detection
    setupNextJSRouter() {
      // Method 1: Listen to popstate events (browser back/forward)
      window.addEventListener('popstate', this.handleRouteChange);
      
      // Method 2: Override pushState and replaceState
      const originalPushState = history.pushState;
      const originalReplaceState = history.replaceState;
      
      history.pushState = function(...args) {
        originalPushState.apply(history, args);
        setTimeout(() => this.handleRouteChange(), 0);
      }.bind(this);
      
      history.replaceState = function(...args) {
        originalReplaceState.apply(history, args);
        setTimeout(() => this.handleRouteChange(), 0);
      }.bind(this);

      // Method 3: Check for Next.js router events
      if (typeof window !== 'undefined' && window.next) {
        // Next.js router events
        window.next.router.events.on('routeChangeComplete', this.handleRouteChange);
      }

      // Initial check
      this.handleRouteChange();
    }

    // Handle route changes
    handleRouteChange() {
      const newPathname = window.location.pathname;
      
      if (newPathname !== this.pathname) {
        this.pathname = newPathname;
        this.checkTokenAndUpdateWidget();
      }
    }

    // Check if current route is a token page and update widget
    checkTokenAndUpdateWidget() {
      const token = this.extractTokenFromPathname(this.pathname);
      
      if (token && token !== this.currentToken) {
        // Token page detected
        this.currentToken = token;
        this.updateWidgetForToken(token);
        console.log(`🎯 Token detected: ${token.toUpperCase()}`);
      } else if (!token && this.currentToken) {
        // Left token page
        this.currentToken = null;
        this.updateWidgetForGeneral();
        console.log('📄 Left token page');
      }
    }

    // Extract token from Next.js pathname
    extractTokenFromPathname(pathname) {
      // Support multiple patterns:
      // /token/[name] - Next.js dynamic route
      // /token/btc - Static route
      // /crypto/[name] - Alternative pattern
      // /coin/[name] - Alternative pattern
      
      const patterns = [
        /^\/token\/([^\/\?]+)/,  // /token/btc
        /^\/crypto\/([^\/\?]+)/, // /crypto/btc
        /^\/coin\/([^\/\?]+)/,   // /coin/btc
        /^\/tokens\/([^\/\?]+)/, // /tokens/btc
        /^\/coins\/([^\/\?]+)/   // /coins/btc
      ];

      for (const pattern of patterns) {
        const match = pathname.match(pattern);
        if (match) {
          let token = match[1];
          // Remove query parameters and fragments
          token = token.split('?')[0].split('#')[0];
          return token.toLowerCase();
        }
      }

      return null;
    }

    // Update widget for token page
    updateWidgetForToken(token) {
      if (this.widgetContainer) {
        // Update widget content for specific token
        this.updateWidgetContent(token);
        
        // Auto open if configured
        if (this.options.autoOpen) {
          this.openWidget();
        }
      }
    }

    // Update widget for general pages
    updateWidgetForGeneral() {
      if (this.widgetContainer) {
        // Update widget content for general use
        this.updateWidgetContent();
        
        // Close widget if open
        if (this.isOpen) {
          this.closeWidget();
        }
      }
    }

    // Setup widget DOM
    setupWidget() {
      // Create widget container
      this.widgetContainer = document.getElementById('chat-widget');
      if (!this.widgetContainer) {
        this.widgetContainer = document.createElement('div');
        this.widgetContainer.id = 'chat-widget';
        document.body.appendChild(this.widgetContainer);
      }

      // Create widget HTML
      this.createWidgetHTML();
      
      // Setup event listeners
      this.setupEventListeners();
    }

    // Create widget HTML structure
    createWidgetHTML() {
      this.widgetContainer.innerHTML = `
        <div class="chat-widget-container" style="
          position: fixed;
          ${this.options.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
          ${this.options.position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
          z-index: 9999;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        ">
          <!-- Notification Badge -->
          <div class="chat-notification" style="
            display: ${this.options.showNotification ? 'block' : 'none'};
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 16px;
            border-radius: 25px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
            margin-bottom: 10px;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.3s ease;
            max-width: 200px;
          ">
            💬 Chat với AI
          </div>
          
          <!-- Chat Window -->
          <div class="chat-window" style="
            display: none;
            width: ${this.options.width};
            height: ${this.options.height};
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            overflow: hidden;
            border: 1px solid #e1e5e9;
          ">
            <!-- Header -->
            <div class="chat-header" style="
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 15px 20px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            ">
              <div>
                <div style="font-weight: 600; font-size: 16px;">
                  🤖 AI Assistant
                </div>
                <div id="token-info" style="font-size: 12px; opacity: 0.9;">
                  Sẵn sàng hỗ trợ bạn
                </div>
              </div>
              <button class="close-btn" style="
                background: none;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                padding: 5px;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
              ">×</button>
            </div>
            
            <!-- Messages -->
            <div class="chat-messages" style="
              height: calc(100% - 120px);
              overflow-y: auto;
              padding: 20px;
              background: #f8f9fa;
            ">
              <div class="welcome-message" style="
                background: white;
                padding: 15px;
                border-radius: 10px;
                margin-bottom: 15px;
                border-left: 4px solid #667eea;
              ">
                <div style="font-weight: 600; margin-bottom: 8px;">👋 Chào mừng!</div>
                <div style="font-size: 14px; color: #666;">
                  Tôi là AI assistant của PretgeMarket. Tôi có thể giúp bạn:
                </div>
                <ul style="font-size: 14px; color: #666; margin: 8px 0; padding-left: 20px;">
                  <li>Phân tích giá token</li>
                  <li>Giải thích thông tin kỹ thuật</li>
                  <li>Trả lời câu hỏi về crypto</li>
                </ul>
              </div>
            </div>
            
            <!-- Input -->
            <div class="chat-input-container" style="
              padding: 15px 20px;
              background: white;
              border-top: 1px solid #e1e5e9;
              display: flex;
              gap: 10px;
            ">
              <input type="text" class="chat-input" placeholder="Nhập câu hỏi của bạn..." style="
                flex: 1;
                padding: 12px 15px;
                border: 1px solid #ddd;
                border-radius: 25px;
                outline: none;
                font-size: 14px;
              ">
              <button class="send-btn" style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                border-radius: 50%;
                width: 45px;
                height: 45px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
              ">📤</button>
            </div>
          </div>
        </div>
      `;
    }

    // Setup event listeners
    setupEventListeners() {
      const notification = this.widgetContainer.querySelector('.chat-notification');
      const closeBtn = this.widgetContainer.querySelector('.close-btn');
      const sendBtn = this.widgetContainer.querySelector('.send-btn');
      const chatInput = this.widgetContainer.querySelector('.chat-input');

      if (notification) {
        notification.addEventListener('click', () => this.openWidget());
      }

      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.closeWidget());
      }

      if (sendBtn) {
        sendBtn.addEventListener('click', () => this.sendMessage());
      }

      if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            this.sendMessage();
          }
        });
      }
    }

    // Update widget content based on token
    updateWidgetContent(token = null) {
      const tokenInfo = this.widgetContainer.querySelector('#token-info');
      if (tokenInfo) {
        if (token) {
          tokenInfo.textContent = `Đang hỗ trợ ${token.toUpperCase()}`;
        } else {
          tokenInfo.textContent = 'Sẵn sàng hỗ trợ bạn';
        }
      }
    }

    // Open widget
    openWidget() {
      const chatWindow = this.widgetContainer.querySelector('.chat-window');
      const notification = this.widgetContainer.querySelector('.chat-notification');
      
      if (chatWindow) {
        chatWindow.style.display = 'block';
        this.isOpen = true;
      }
      
      if (notification) {
        notification.style.display = 'none';
      }
    }

    // Close widget
    closeWidget() {
      const chatWindow = this.widgetContainer.querySelector('.chat-window');
      const notification = this.widgetContainer.querySelector('.chat-notification');
      
      if (chatWindow) {
        chatWindow.style.display = 'none';
        this.isOpen = false;
      }
      
      if (notification && this.options.showNotification) {
        notification.style.display = 'block';
      }
    }

    // Send message
    async sendMessage() {
      const chatInput = this.widgetContainer.querySelector('.chat-input');
      const messagesContainer = this.widgetContainer.querySelector('.chat-messages');
      
      if (!chatInput || !messagesContainer) return;
      
      const message = chatInput.value.trim();
      if (!message) return;
      
      // Add user message
      this.addMessage(message, 'user');
      chatInput.value = '';
      
      // Add loading message
      const loadingId = this.addMessage('Đang suy nghĩ...', 'bot', true);
      
      try {
        // Send to API
        const response = await fetch(`${CDN_CONFIG.apiUrl}/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: message,
            token: this.currentToken,
            userId: this.getUserId()
          })
        });
        
        const data = await response.json();
        
        // Remove loading message
        this.removeMessage(loadingId);
        
        // Add bot response
        this.addMessage(data.response || 'Xin lỗi, tôi không thể trả lời câu hỏi này.', 'bot');
        
      } catch (error) {
        console.error('Chat error:', error);
        this.removeMessage(loadingId);
        this.addMessage('Xin lỗi, có lỗi xảy ra. Vui lòng thử lại.', 'bot');
      }
    }

    // Add message to chat
    addMessage(text, sender, isLoading = false) {
      const messagesContainer = this.widgetContainer.querySelector('.chat-messages');
      if (!messagesContainer) return;
      
      const messageId = 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      
      const messageDiv = document.createElement('div');
      messageDiv.id = messageId;
      messageDiv.style.cssText = `
        margin-bottom: 15px;
        display: flex;
        ${sender === 'user' ? 'justify-content: flex-end;' : 'justify-content: flex-start;'}
      `;
      
      const messageContent = document.createElement('div');
      messageContent.style.cssText = `
        max-width: 80%;
        padding: 12px 16px;
        border-radius: 18px;
        font-size: 14px;
        line-height: 1.4;
        ${sender === 'user' 
          ? 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;' 
          : 'background: white; color: #333; border: 1px solid #e1e5e9;'
        }
        ${isLoading ? 'opacity: 0.7; font-style: italic;' : ''}
      `;
      
      messageContent.textContent = text;
      messageDiv.appendChild(messageContent);
      messagesContainer.appendChild(messageDiv);
      
      // Scroll to bottom
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      
      return messageId;
    }

    // Remove message
    removeMessage(messageId) {
      const message = document.getElementById(messageId);
      if (message) {
        message.remove();
      }
    }

    // Get user ID
    getUserId() {
      let userId = localStorage.getItem('chat-widget-user-id');
      if (!userId) {
        userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('chat-widget-user-id', userId);
      }
      return userId;
    }
  }

  // Initialize global ChatWidget
  window.ChatWidget = new NextJSChatWidget();

  // Auto-initialize if script has data-auto-init attribute
  document.addEventListener('DOMContentLoaded', function() {
    const script = document.querySelector('script[src*="chat-widget-nextjs.js"]');
    if (script && script.hasAttribute('data-auto-init')) {
      const options = {
        autoOpen: script.getAttribute('data-auto-open') === 'true',
        showNotification: script.getAttribute('data-show-notification') !== 'false'
      };
      window.ChatWidget.init(options);
    }
  });

})();
