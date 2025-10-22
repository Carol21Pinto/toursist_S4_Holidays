import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: 'react',
      jsxRuntime: 'automatic'
    })
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    minify: 'terser',  // ⚡ Minify JS with terser
    cssMinify: true,    // ⚡ Minify CSS
    target: 'es2015',   // ⚡ Modern browsers
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          icons: ['react-icons'],  // ⚡ Separate icons bundle
          ui: ['@mui/material', '@mui/icons-material']  // ⚡ Separate MUI bundle
        },
        // ⚡ Better file naming for caching
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    },
    // ⚡ Optimize dependencies
    commonjsOptions: {
      transformMixedEsModules: true
    }
  },
  server: {
    port: 5173,
    host: true
  },
  // ⚡ Optimize dependencies ahead of time
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
})
