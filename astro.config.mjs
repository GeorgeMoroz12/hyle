// @ts-check
import { defineConfig } from 'astro/config';

import markdoc from '@astrojs/markdoc';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Добавляем твой официальный домен
  site: 'https://hyle-w6he.vercel.app',
  
  output: 'server',
  
  adapter: vercel({
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