import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteCompression({
      verbose: true,
      disable: false,
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
  ],

  build: {
    target: 'esnext',
    sourcemap: false,
    minify: 'esbuild',
    outDir: '../wwwroot',   // ✅ build output goes here
    emptyOutDir: true,   // ✅ cleans wwwroot before each build
  }
})
