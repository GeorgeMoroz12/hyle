// @ts-check
import { defineConfig } from 'astro/config';

import markdoc from '@astrojs/markdoc';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import vercel from '@astrojs/vercel';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';

// Определяем адаптер на основе переменной окружения
const adapter = process.env.ASTRO_ADAPTER === 'node'
  ? node({
    mode: 'standalone',
  })
  : vercel({
    imageService: true,
  });

// https://astro.build/config
export default defineConfig({
  // Твой реальный домен
  site: 'https://hyleceramics.ru',

  // Динамически выбираем output: 'server' для Node.js (нужен для API), 
  // 'static' для Vercel (как было ранее, но с возможностью переопределения)
  output: process.env.ASTRO_ADAPTER === 'node' ? 'server' : 'static',

  adapter,

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