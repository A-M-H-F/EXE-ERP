import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    global: 'globalThis',
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Your Node.js backend URL
        changeOrigin: true,
        // secure: false,
        // rewrite: (path) => path.replace(/^\/api/, '') // Remove the '/api' prefix
        rewrite: path => path.replace('/api', ''),
      }
    }
  },
  resolve: {
    alias: {
      process: 'process/browser',
      util: 'util',
      "@public": path.resolve(__dirname, "./public"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      '@app': path.resolve(__dirname, './src/app'),
      '@layout': path.resolve(__dirname, './src/layout'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@socket': path.resolve(__dirname, './src/@socket'),
      '@features': path.resolve(__dirname, './src/features'),
      '@api': path.resolve(__dirname, './src/api'),
    },
  },
  plugins: [react()],
})
