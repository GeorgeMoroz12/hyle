import { makeHandler } from '@keystatic/astro/api';
import keystaticConfig from '../../../../keystatic.config';
import type { APIRoute } from 'astro';

export const prerender = false;

export const ALL: APIRoute = async (context) => {
  try {
    // 1. Диагностика переменных окружения (Runtime Check)
    // Используем process.env, так как на Vercel в рантайме это надежнее
    const env = {
      clientId: process.env.KEYSTATIC_GITHUB_CLIENT_ID || import.meta.env.KEYSTATIC_GITHUB_CLIENT_ID,
      clientSecret: process.env.KEYSTATIC_GITHUB_CLIENT_SECRET || import.meta.env.KEYSTATIC_GITHUB_CLIENT_SECRET,
      secret: process.env.KEYSTATIC_SECRET || import.meta.env.KEYSTATIC_SECRET,
    };

    // 2. Явный вывод ошибки, если чего-то нет
    if (!env.secret) {
      throw new Error("Missing Variable: KEYSTATIC_SECRET");
    }
    if (!env.clientId) {
      throw new Error("Missing Variable: KEYSTATIC_GITHUB_CLIENT_ID");
    }
    if (!env.clientSecret) {
      throw new Error("Missing Variable: KEYSTATIC_GITHUB_CLIENT_SECRET");
    }

    // 3. Запуск обработчика Keystatic
    const handler = makeHandler({
      config: keystaticConfig,
    });

    return await handler(context);

  } catch (error: any) {
    // 4. ПЕРЕХВАТ ОШИБКИ: Выводим её на экран вместо стандартной 500
    console.error("Keystatic API Error:", error);
    
    return new Response(
      JSON.stringify({
        message: "Critical Error in Keystatic API",
        error: error.message || String(error),
        stack: error.stack,
        hint: "Check Vercel Environment Variables and GitHub App Settings"
      }, null, 2),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};