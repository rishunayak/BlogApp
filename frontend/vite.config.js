import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    port:3000,
    proxy:{"/api":{target:"https://blogapp-6vnt.onrender.com",secure:false}}
  },
  plugins: [react()],
})
