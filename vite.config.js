import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      // Proxy for UMS Auth
      '/api/v1/ums': {
        target: 'http://18.184.52.10:5003',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/v1\/ums/, '/api/v1/ums'),
      },

      // Proxy for Users API
      '/api/users': {
        target: 'http://18.184.52.10:5003',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/users/, '/api/users'),
      }
    }
  }
});
