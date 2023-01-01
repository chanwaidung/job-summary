import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 2048,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5678'
      }
    }
  },
})
