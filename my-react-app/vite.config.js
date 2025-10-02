   import { defineConfig } from 'vite';
   import react from '@vitejs/plugin-react';
  import tailwindcss from '@tailwindcss/vite'

  // Note: No @tailwindcss/vite; use the main package

   export default defineConfig({
     plugins: [react(), tailwindcss()],
     optimizeDeps: {
       exclude: ['lucide-react'],
     },
   });
   