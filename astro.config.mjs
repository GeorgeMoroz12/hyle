// @ts-check
import { defineConfig } from 'astro/config';

import markdoc from '@astrojs/markdoc';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // МЕНЯЕМ ЗДЕСЬ:
  // 'server' (SSR) — самый надежный режим для админок на Vercel.
  // Сайт всё равно будет летать, так как Vercel кэширует страницы.
  output: 'server',
  
  adapter: vercel({
    // Включаем оптимизацию изображений Vercel
    imageService: true,
  }),

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

  build: {
    format: 'directory',
  }
});