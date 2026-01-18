// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

import keystatic from '@keystatic/astro';

// https://astro.build/config
export default defineConfig({
  // Для Tailwind 4.0 мы используем нативный Vite-плагин
  vite: {
    plugins: [tailwindcss()],
  },

  // Явное указание на статический рендеринг (SSG)
  output: 'static',

  // Настройки билда
  build: {
    format: 'directory',
  },

  integrations: [react(), keystatic()]
});