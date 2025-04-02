import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import wasm from 'vite-plugin-wasm';
import { ingestCSV } from './src/utils/vite';


export default defineConfig({
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
