import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),  // ← agrega esta línea
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // En desarrollo el front (5173) reenvía las llamadas /api al backend (5269).
    // El navegador solo habla con 5173 → no hay CORS.
    proxy: {
      '/api': {
        target: 'http://localhost:5269',
        changeOrigin: true,
      },
    },
  },
})