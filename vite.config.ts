import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const designSystemRoot = path.resolve(__dirname, 'design-system')

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@ds': path.join(designSystemRoot, 'src'),
    },
  },
})
