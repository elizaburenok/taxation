import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const designSystemRoot = path.resolve(__dirname, '../design-system')

export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      allow: [path.resolve(__dirname, '..'), designSystemRoot],
    },
  },
  resolve: {
    alias: {
      '@ds': path.join(designSystemRoot, 'src'),
    },
  },
})
