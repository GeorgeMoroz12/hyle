// @ts-check
import { defineConfig } from 'astro/config';

import markdoc from '@astrojs/markdoc';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Включаем гибридный режим (Статика + Сервер для админки)
  output: 'hybrid',
  
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

  build: {
    format: 'directory',
  }
});