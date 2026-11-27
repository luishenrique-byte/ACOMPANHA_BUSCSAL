import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Porta 3000 = origem liberada por padrão no CORS do back end (CORS_ALLOWED_ORIGINS)
export default defineConfig({ plugins: [react()], server: { port: 3000, strictPort: true } })
