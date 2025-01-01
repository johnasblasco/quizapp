import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../backend/static/',  // Place Vite build files in Django's static folder
    emptyOutDir: true,             // Empty the static folder before building
  },
});
