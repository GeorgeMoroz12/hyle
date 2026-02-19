// @ts-check
import { defineConfig } from 'astro/config';
import markdoc from '@astrojs/markdoc';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://hyleceramics.ru',
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  server: {
    host: '0.0.0.0',
    port: 4321,
  },
  integrations: [react(), keystatic(), markdoc()],
  vite: {
    plugins: [tailwindcss()],
    resolve: { dedupe: ['react', 'react-dom'] },
  },
});