import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    proxy: {
      '/api': 'https://block-chain-backend.onrender.com' // replace with your server address
    },
  },
  plugins: [react()],
})
