// @ts-check
import { defineConfig } from 'astro/config';

// 1. Импорты интеграций
import markdoc from '@astrojs/markdoc';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import vercel from '@astrojs/vercel'; // <--- Новый импорт

// 2. Импорт Tailwind 4 (Vite plugin)
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Подключаем адаптер Vercel
  adapter: vercel(),

  integrations: [
    react(), 
    keystatic(),
    markdoc(),
  ],

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      dedupe: ['react', 'react-dom'],
    },
  },

  output: 'static',

  build: {
    format: 'directory',
  }
});