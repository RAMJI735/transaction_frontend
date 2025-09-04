import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https server enable karna
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  }
})
