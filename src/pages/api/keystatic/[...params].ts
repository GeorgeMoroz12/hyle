import { makeHandler } from '@keystatic/astro/api';
import keystaticConfig from '../../../../keystatic.config';
import type { APIRoute } from 'astro';

export const prerender = false;

// Создаем обработчик с проверкой переменных окружения
const handler = makeHandler({
  config: keystaticConfig,
});

export const ALL: APIRoute = async (context) => {
  // 1. Проверяем наличие критических секретов
  const secret = import.meta.env.KEYSTATIC_SECRET || process.env.KEYSTATIC_SECRET;
  const clientId = import.meta.env.KEYSTATIC_GITHUB_CLIENT_ID || process.env.KEYSTATIC_GITHUB_CLIENT_ID;
  const clientSecret = import.meta.env.KEYSTATIC_GITHUB_CLIENT_SECRET || process.env.KEYSTATIC_GITHUB_CLIENT_SECRET;

  // 2. Если чего-то нет, выводим понятную ошибку прямо в браузер
  if (!secret) {
    return new Response(
      "CRITICAL ERROR: 'KEYSTATIC_SECRET' is missing in Vercel Environment Variables. Please add it in Settings.", 
      { status: 500 }
    );
  }

  if (!clientId || !clientSecret) {
    return new Response(
      "CRITICAL ERROR: GitHub Client ID or Secret is missing in Vercel Environment Variables.", 
      { status: 500 }
    );
  }

  // 3. Если всё ок, запускаем стандартный обработчик Keystatic
  return handler(context);
};