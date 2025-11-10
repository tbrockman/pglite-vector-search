import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import wasm from 'vite-plugin-wasm';
import { ingestCSV } from './src/utils/vite';


export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/pglite-vector-search/' : '/',
  plugins: [
    react(),
    wasm(),
    ingestCSV(),
  ],
  optimizeDeps: {
    exclude: ['@electric-sql/pglite']
  },
  assetsInclude: ['**/*.wasm'],
});
