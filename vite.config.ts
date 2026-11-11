import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: true
  },
  resolve: {
    alias: {
      '@app': resolve(import.meta.dirname, 'src/app'),
      '@pages': resolve(import.meta.dirname, 'src/pages'),
      '@widgets': resolve(import.meta.dirname, 'src/widgets'),
      '@features': resolve(import.meta.dirname, 'src/features'),
      '@entities': resolve(import.meta.dirname, 'src/entities'),
      '@shared': resolve(import.meta.dirname, 'src/shared')
    }
  }
})
