import { makeHandler } from '@keystatic/astro/api';
import keystaticConfig from '../../../../keystatic.config';

// КРИТИЧНО ВАЖНАЯ СТРОКА:
// Она говорит Vercel: "Не пытайся собрать эту страницу заранее. 
// Запускай её как Serverless Function каждый раз, когда кто-то стучится."
export const prerender = false;

// ИСПРАВЛЕНИЕ: Astro требует писать названия методов ЗАГЛАВНЫМИ БУКВАМИ (ALL, GET, POST).
// Раньше было 'all', и Astro не видел этот обработчик, выдавая 404.
export const ALL = makeHandler({
  config: keystaticConfig,
});