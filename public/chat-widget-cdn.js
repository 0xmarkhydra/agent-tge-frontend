(function() {
  'use strict';

  // CDN Configuration
  const CDN_CONFIG = {
    apiUrl: ' https://cdn-agent.up.railway.app/api',
    widgetUrl: 'https://agent.pretgemarket.xyz', // Updated to current port
    version: '1.0.0',
    cdnVersion: '1.0.0'
  };

  // Auto-detect host from script src
  function detectHostFromScript() {
    try {
      const scripts = document.getElementsByTagName('script');
      for (let i = 0; i < scripts.length; i++) {
        const script = scripts[i];
        if (script.src && script.src.includes('chat-widget-cdn.js')) {
          const url = new URL(script.src);
          return {
            protocol: url.protocol,
            host: url.host,
            baseUrl: `${url.protocol}//${url.host}`
          };
        }
      }
    } catch (error) {
      console.warn('Failed to detect host from script:', error);
    }
    return null;
  }

  // Get widget client URL from data attributes or script src
  function getWidgetClientUrl(options) {
    // Check if widget client URL is specified in data attributes
    const widgetElement = document.getElementById('chat-widget');
    if (widgetElement) {
      const dataClientUrl = widgetElement.getAttribute('data-client-url');
      if (dataClientUrl) {
        return dataClientUrl;
      }
    }
    
    // Check if specified in options
    if (options.clientUrl) {
      return options.clientUrl;
    }
    
    // Auto-detect from script src
    const detectedHost = detectHostFromScript();
    if (detectedHost) {
      return detectedHost.baseUrl;
    }
    
    // Fallback to config
    return CDN_CONFIG.widgetUrl;
  }

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
    customCss: null,
    apiUrl: CDN_CONFIG.apiUrl
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
      const pathSegments = window.location.pathname.split('/');
      
      // Try /token/{name} pattern first
      const tokenIndex = pathSegments.indexOf('token');
      if (tokenIndex > -1 && pathSegments.length > tokenIndex + 1) {
        let token = pathSegments[tokenIndex + 1];
        // Remove .html extension if present
        if (token.endsWith('.html')) {
          token = token.slice(0, -5);
        }
        return token;
      }
      
      // Try query parameters as fallback
      const patterns = [
        /[?&]token=([^&]+)/,
        /[?&]symbol=([^&]+)/,
        /[?&]coin=([^&]+)/
      ];
      
      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
      }
      
      return null;
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

  // Create close button for widget
  function createCloseButton() {
    const closeButton = document.createElement('button');
    closeButton.id = 'chat-widget-close';
    closeButton.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    `;
    closeButton.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: none;
      background: rgba(0, 0, 0, 0.5);
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10001;
      transition: all 0.3s ease;
      opacity: 0.8;
    `;

    // Hover effects
    closeButton.addEventListener('mouseenter', () => {
      closeButton.style.background = 'rgba(239, 68, 68, 0.8)';
      closeButton.style.opacity = '1';
      closeButton.style.transform = 'scale(1.1)';
    });

    closeButton.addEventListener('mouseleave', () => {
      closeButton.style.background = 'rgba(0, 0, 0, 0.5)';
      closeButton.style.opacity = '0.8';
      closeButton.style.transform = 'scale(1)';
    });

    // Close widget when clicked
    closeButton.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleWidget();
    });

    return closeButton;
  }

  // Create iframe
  function createIframe(options) {
    const iframe = document.createElement('iframe');
    
    // Get widget client URL
    const widgetUrl = getWidgetClientUrl(options);
    
    // Get API URL
    const apiUrl = options.apiUrl || CDN_CONFIG.apiUrl;
    
    iframe.src = `${widgetUrl}/chat-minimal.html?token=${options.token}&userId=${options.userId}&apiUrl=${encodeURIComponent(apiUrl)}`;
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
    iframe.title = 'Chat Widget';
    return iframe;
  }

  // Create toggle button
  function createToggleButton(options) {
    const button = document.createElement('button');
    button.id = 'chat-widget-toggle';
    button.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    `;
    button.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
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
      z-index: 10000;
    `;

    // Handle position
    if (options.position === 'bottom-left') {
      button.style.right = 'auto';
      button.style.left = '20px';
    }

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
      display: none;
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
    const closeButton = document.getElementById('chat-widget-close');
    const toggleButton = document.getElementById('chat-widget-toggle');
    
    if (iframe) {
      const isVisible = iframe.style.display !== 'none';
      
      if (isVisible) {
        // Hide widget
        iframe.style.display = 'none';
        if (closeButton) {
          closeButton.style.display = 'none';
        }
        // Show toggle button when widget is closed
        if (toggleButton) {
          toggleButton.style.display = 'flex';
        }
      } else {
        // Show widget
        iframe.style.display = 'block';
        if (closeButton) {
          closeButton.style.display = 'flex';
        }
        // Hide toggle button when widget is opened
        if (toggleButton) {
          toggleButton.style.display = 'none';
        }
        
        // Hide notification when opened (if it exists)
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
    
    // Create notification badge only if showNotification is true
    if (config.showNotification) {
      const notificationBadge = createNotificationBadge();
      toggleButton.appendChild(notificationBadge);
      notificationBadge.style.display = 'none';
    }
    
    // Create close button for widget
    const closeButton = createCloseButton();
    closeButton.style.display = 'none'; // Hide initially
    
    // Assemble widget
    widgetContainer.appendChild(iframe);
    widgetContainer.appendChild(closeButton);
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
      const closeButton = document.getElementById('chat-widget-close');
      const toggleButton = document.getElementById('chat-widget-toggle');
      
      if (iframe) {
        iframe.style.display = 'block';
        if (closeButton) {
          closeButton.style.display = 'flex';
        }
        if (toggleButton) {
          toggleButton.style.display = 'none';
        }
      }
    },
    hide: function() {
      const iframe = document.getElementById('chat-widget-iframe');
      const closeButton = document.getElementById('chat-widget-close');
      const toggleButton = document.getElementById('chat-widget-toggle');
      
      if (iframe) {
        iframe.style.display = 'none';
        if (closeButton) {
          closeButton.style.display = 'none';
        }
        if (toggleButton) {
          toggleButton.style.display = 'flex';
        }
      }
    },
    destroy: function() {
      const container = document.getElementById('chat-widget-container');
      if (container) {
        container.remove();
        widgetLoaded = false;
      }
    },
    version: CDN_CONFIG.version,
    cdnVersion: CDN_CONFIG.cdnVersion
  };

  // Auto-initialize - always try to detect token from URL
  document.addEventListener('DOMContentLoaded', function() {
    const widgetElement = document.getElementById('chat-widget');
    let options = {};

    // Detect host from script
    const detectedHost = detectHostFromScript();
    const defaultApiUrl = detectedHost ? `${detectedHost.baseUrl.replace(/:\d+/, ':3000')}/api` : CDN_CONFIG.apiUrl;

    if (widgetElement) {
      // Use data attributes if present
      options = {
        token: widgetElement.getAttribute('data-token'),
        userId: widgetElement.getAttribute('data-user-id'),
        position: widgetElement.getAttribute('data-position') || 'bottom-right',
        theme: widgetElement.getAttribute('data-theme') || 'light',
        width: widgetElement.getAttribute('data-width') || '400px',
        height: widgetElement.getAttribute('data-height') || '600px',
        autoOpen: widgetElement.getAttribute('data-auto-open') === 'true',
        showNotification: widgetElement.getAttribute('data-show-notification') !== 'false',
        apiUrl: widgetElement.getAttribute('data-api-url') || defaultApiUrl,
        clientUrl: widgetElement.getAttribute('data-client-url')
      };
    } else {
      // No widget element found, use defaults with auto token detection
      options = {
        position: 'bottom-right',
        theme: 'light',
        width: '400px',
        height: '600px',
        autoOpen: false,
        showNotification: true,
        apiUrl: defaultApiUrl
      };
    }

    // Auto-detect token from URL if not specified
    if (!options.token) {
      const detectedToken = extractTokenFromUrl();
      if (detectedToken) {
        options.token = detectedToken;
        console.log(`🔍 [ChatWidget] Auto-detected token from URL: ${detectedToken}`);
      }
    }

    // Log detected host info
    if (detectedHost) {
      console.log(`🌐 [ChatWidget] Auto-detected host: ${detectedHost.baseUrl}`);
    }

    // Remove null values
    Object.keys(options).forEach(key => {
      if (options[key] === null) {
        delete options[key];
      }
    });

    // Initialize widget if we have a token
    if (options.token) {
      initWidget(options);
    } else {
      console.warn('⚠️ [ChatWidget] No token detected from URL or data attributes. Widget not initialized.');
    }
  });

  console.log(`🚀 [ChatWidget] CDN Script loaded v${CDN_CONFIG.cdnVersion}`);
})();
