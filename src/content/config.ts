import { defineCollection, z } from 'astro:content';

// 1. Схема для товаров (Products) согласно Master-File v1.1
const products = defineCollection({
  type: 'content', 
  schema: z.object({
    // Название (Hyle — [Название изделия])
    title: z.string(),
    // Цена в рублях
    price: z.number().positive(),
    // Категория (фиксированный список)
    category: z.enum(['Чашки', 'Тарелки', 'Подвески', 'Вазы', 'Другое']),
    // Теги (свободный список строк)
    tags: z.array(z.string()).default([]),
    // Статус вместо boolean (В наличии / Под заказ / Продано)
    status: z.enum(['В наличии', 'Под заказ', 'Продано']).default('В наличии'),
    // Спецификации (объект)
    specs: z.object({
      volume: z.string().optional().describe('Объем (мл)'),
      size: z.string().optional().describe('Размер (см)'),
      material: z.string().default('Керамика, глазурь'),
    }),
    // Инструкция по уходу
    care: z.string().optional(),
    // Галерею фото мы пока не валидируем строго, так как это делает Keystatic
  }),
});

// 2. Схема для блога (Blog)
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    description: z.string(),
    author: z.string().default('Hyle Team'),
    // Ссылки на товары (Related Products) — массив слагов (id товаров)
    relatedProducts: z.array(z.string()).optional(),
  }),
});

export const collections = {
  products,
  blog,
};