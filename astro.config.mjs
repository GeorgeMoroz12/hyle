// @ts-check
import { defineConfig } from 'astro/config';

import markdoc from '@astrojs/markdoc';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
});


// https://astro.build/config
export default defineConfig({
  // Твой реальный домен
  site: 'https://hyleceramics.ru',

  output: 'server',

  adapter: node({
    mode: 'standalone',
  }),

  integrations: [
    react(),
    keystatic(), // Авто-интеграция обрабатывает UI (/keystatic), но API мы перехватим вручную
    markdoc(),
  ],

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      dedupe: ['react', 'react-dom'],
    },
  },
});