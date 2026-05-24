import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import checker from 'vite-plugin-checker'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    tailwindcss(),
    react(),
    // checker({
    //   typescript: true,
    //   eslint: {
    //     useFlatConfig: true,
    //     lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
    //   },
    // }),
  ],
})
