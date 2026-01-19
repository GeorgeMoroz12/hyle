// @ts-check
import { defineConfig } from 'astro/config';

// 1. Импорты интеграций
import markdoc from '@astrojs/markdoc';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';

// 2. Импорт Tailwind 4 (Vite plugin)
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // ВАЖНО: react() должен быть ПЕРЕД keystatic()
  integrations: [
    react(), 
    keystatic(),
    markdoc(),
  ],

  vite: {
    plugins: [tailwindcss()],
    
    // 🔥 ФИКС ОШИБКИ useContext:
    // Принудительно объединяем версии React, чтобы админка не ломалась
    resolve: {
      dedupe: ['react', 'react-dom'],
    },
  },

  output: 'static',

  build: {
    format: 'directory',
  }
});