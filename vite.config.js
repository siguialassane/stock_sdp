import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [tailwindcss(), react()],
  build: {
    rolldownOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('/react/') || id.includes('/react-dom/')) return 'vendor-react'
          if (id.includes('/@tanstack/')) return 'vendor-tanstack'
          if (id.includes('/@supabase/')) return 'vendor-supabase'
          if (id.includes('/@radix-ui/') || id.includes('/lucide-react/') || id.includes('/sonner/')) {
            return 'vendor-ui'
          }
          return 'vendor'
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 8088,
  },
})
