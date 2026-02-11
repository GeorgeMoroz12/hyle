// @ts-check
import { defineConfig } from 'astro/config';

import markdoc from '@astrojs/markdoc';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Твой реальный домен
  site: 'https://hyleceramics.ru',
  
  // ВАЖНО: Возвращаем статический режим.
  // Это починит страницы товаров, так как они будут собраны заранее.
  output: 'static',
  
  // Адаптер Vercel нужен, чтобы работала API-функция админки (которую мы создадим ниже)
  adapter: vercel({
    imageService: true,
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