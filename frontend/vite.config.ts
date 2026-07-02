import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      'lucide-react': 'lucide-react/dist/cjs/lucide-react.js'
    }
  },
  base: command === 'build' ? '/Alextronics/' : '/',
  server: {
    port: 4173,
    hmr: {
      protocol: 'ws',
      host: 'localhost'
    }
  }
}));
