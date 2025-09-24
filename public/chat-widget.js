(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    apiUrl: 'http://localhost:3000/api',
    widgetUrl: 'http://localhost:5173',
    version: '1.0.0'
  };

  // Widget state
  let widgetLoaded = false;
  let widgetContainer = null;
  let iframe = null;

  // Default options
  const defaultOptions = {
    token: 'xpl',
    userId: null,
    position: 'bottom-right',
    theme: 'light',
    width: '400px',
    height: '600px',
    autoOpen: false,
    showNotification: true,
    customCss: null
  };

  // Generate unique user ID
  function generateUserId() {
    let userId = localStorage.getItem('chat_widget_user_id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('chat_widget_user_id', userId);
    }
    return userId;
  }

  // Extract token from URL
  function extractTokenFromUrl() {
    try {
      const url = window.location.href;
      const match = url.match(/\/token\/([^\/\?#]+)/);
      return match ? match[1] : null;
    } catch (error) {
      console.error('Failed to extract token from URL:', error);
      return null;
    }
  }

  // Create widget container
  function createWidgetContainer(options) {
    const container = document.createElement('div');
    container.id = 'chat-widget-container';
    container.style.cssText = `
      position: fixed;
      ${options.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
      ${options.position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    // Add custom CSS if provided
    if (options.customCss) {
      const style = document.createElement('style');
      style.textContent = options.customCss;
      document.head.appendChild(style);
    }

    return container;
  }

  // Create iframe
  function createIframe(options) {
    const iframe = document.createElement('iframe');
    iframe.src = `${CONFIG.widgetUrl}/demo?embedded=true&token=${options.token}&userId=${options.userId}`;
    iframe.style.cssText = `
      width: ${options.width};
      height: ${options.height};
      border: none;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      background: white;
      display: none;
    `;
    iframe.allow = 'clipboard-write';
    return iframe;
  }

  // Create toggle button
  function createToggleButton(options) {
    const button = document.createElement('button');
    button.id = 'chat-widget-toggle';
    button.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
      </svg>
    `;
    button.style.cssText = `
      width: 60px;
      height: 60px;
      border-radius: 50%;
      border: none;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transition: all 0.3s ease;
      position: relative;
    `;

    // Hover effects
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'scale(1.1)';
      button.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.25)';
    });

    button.addEventListener('mouseleave', () => {
      button.style.transform = 'scale(1)';
      button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    });

    return button;
  }

  // Create notification badge
  function createNotificationBadge() {
    const badge = document.createElement('div');
    badge.id = 'chat-widget-notification';
    badge.innerHTML = '!';
    badge.style.cssText = `
      position: absolute;
      top: -5px;
      right: -5px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #ef4444;
      color: white;
      font-size: 12px;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: pulse 2s infinite;
    `;

    // Add pulse animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
      }
    `;
    document.head.appendChild(style);

    return badge;
  }

  // Toggle widget visibility
  function toggleWidget() {
    const iframe = document.getElementById('chat-widget-iframe');
    const button = document.getElementById('chat-widget-toggle');
    
    if (iframe && button) {
      const isVisible = iframe.style.display !== 'none';
      
      if (isVisible) {
        iframe.style.display = 'none';
        button.innerHTML = `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
          </svg>
        `;
        button.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      } else {
        iframe.style.display = 'block';
        button.innerHTML = `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 18L18 6M6 6l12 12"/>
          </svg>
        `;
        button.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
        
        // Hide notification when opened
        const notification = document.getElementById('chat-widget-notification');
        if (notification) {
          notification.style.display = 'none';
        }
      }
    }
  }

  // Initialize widget
  function initWidget(options) {
    if (widgetLoaded) {
      console.warn('Chat widget already loaded');
      return;
    }

    // Merge options with defaults
    const config = { ...defaultOptions, ...options };
    
    // Set user ID if not provided
    if (!config.userId) {
      config.userId = generateUserId();
    }

    // Extract token from URL if not provided
    if (!config.token) {
      config.token = extractTokenFromUrl() || 'xpl';
    }

    console.log('🔍 [ChatWidget] Initializing with config:', config);

    // Create container
    widgetContainer = createWidgetContainer(config);
    
    // Create iframe
    iframe = createIframe(config);
    iframe.id = 'chat-widget-iframe';
    
    // Create toggle button
    const toggleButton = createToggleButton(config);
    toggleButton.addEventListener('click', toggleWidget);
    
    // Create notification badge
    const notificationBadge = createNotificationBadge();
    toggleButton.appendChild(notificationBadge);
    
    // Hide notification initially
    notificationBadge.style.display = 'none';
    
    // Assemble widget
    widgetContainer.appendChild(iframe);
    widgetContainer.appendChild(toggleButton);
    
    // Add to page
    document.body.appendChild(widgetContainer);
    
    // Auto-open if configured
    if (config.autoOpen) {
      setTimeout(() => {
        toggleWidget();
      }, 1000);
    }

    // Show notification after delay
    if (config.showNotification) {
      setTimeout(() => {
        notificationBadge.style.display = 'flex';
      }, 3000);
    }

    widgetLoaded = true;
    console.log('✅ [ChatWidget] Widget loaded successfully');
  }

  // Public API
  window.ChatWidget = {
    init: initWidget,
    toggle: toggleWidget,
    show: function() {
      const iframe = document.getElementById('chat-widget-iframe');
      if (iframe) iframe.style.display = 'block';
    },
    hide: function() {
      const iframe = document.getElementById('chat-widget-iframe');
      if (iframe) iframe.style.display = 'none';
    },
    destroy: function() {
      const container = document.getElementById('chat-widget-container');
      if (container) {
        container.remove();
        widgetLoaded = false;
      }
    },
    version: CONFIG.version
  };

  // Auto-initialize if data attributes are present
  document.addEventListener('DOMContentLoaded', function() {
    const widgetElement = document.getElementById('chat-widget');
    if (widgetElement) {
      const options = {
        token: widgetElement.getAttribute('data-token'),
        userId: widgetElement.getAttribute('data-user-id'),
        position: widgetElement.getAttribute('data-position') || 'bottom-right',
        theme: widgetElement.getAttribute('data-theme') || 'light',
        width: widgetElement.getAttribute('data-width') || '400px',
        height: widgetElement.getAttribute('data-height') || '600px',
        autoOpen: widgetElement.getAttribute('data-auto-open') === 'true',
        showNotification: widgetElement.getAttribute('data-show-notification') !== 'false'
      };

      // Remove null values
      Object.keys(options).forEach(key => {
        if (options[key] === null) {
          delete options[key];
        }
      });

      initWidget(options);
    }
  });

  console.log(`🚀 [ChatWidget] Script loaded v${CONFIG.version}`);
})();
