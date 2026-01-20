import { makeHandler } from '@keystatic/astro/api';
import keystaticConfig from '../../../../keystatic.config';

// КРИТИЧНО ВАЖНАЯ СТРОКА:
// Она говорит Vercel: "Не пытайся собрать эту страницу заранее. 
// Запускай её как Serverless Function каждый раз, когда кто-то стучится."
export const prerender = false;

export const all = makeHandler({
  config: keystaticConfig,
});