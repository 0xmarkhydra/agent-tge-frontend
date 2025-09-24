import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Serve static files directly
    middlewareMode: false,
    // Allow direct access to public files
    fs: {
      allow: ['..']
    }
  },
  // Configure build to serve static files
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        // Add static file entries
        'token/btc': './public/token/btc.html',
        'token/eth': './public/token/eth.html', 
        'token/xpl': './public/token/xpl.html',
        'demo': './public/demo.html'
      }
    }
  }
})
