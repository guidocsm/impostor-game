import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    host: true,
    port: 5173,
    allowedHosts: [
      'interuniversity-supereffluent-gwyn.ngrok-free.dev', // el host de ngrok
      'localhost',
      '127.0.0.1'
    ]
  }
})