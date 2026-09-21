import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

/**
 * VITE CONFIGURATION - DIGITAL HEROES PLATFORM
 * 
 * Includes Path Aliasing for cleaner imports and a 
 * Development Proxy to bypass CORS during local testing.
 */
export default defineConfig({
  plugins: [react()],
  
  resolve: {
    alias: {
      // Allows using '@' to refer to the 'src' directory
      // Example: import GlobalHeader from '@/components/GlobalHeader'
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    // Default Vite port
    port: 5173,
    
    // DEVELOPMENT PROXY:
    // Any call to /api will be redirected to your Express server (Port 5000).
    // This prevents CORS errors during your 2-day development sprint.
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  build: {
    // Optimization for production deployment
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
  },
});