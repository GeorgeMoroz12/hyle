import { defineCollection, z } from 'astro:content';

// 1. Товары (Products)
const products = defineCollection({
  type: 'content', 
  schema: z.object({
    title: z.string(),
    
    // 🔥 ФИКС ОШИБКИ "NaN"
    // Принимаем число ИЛИ строку. Превращаем всё в число. Если не вышло — ставим 0.
    price: z.union([z.number(), z.string(), z.null(), z.undefined()])
      .transform((val) => {
        const num = Number(val);
        return isNaN(num) ? 0 : num;
      })
      .default(0),

    status: z.enum(['В наличии', 'Под заказ', 'Продано', 'Архив']).default('В наличии'),
    
    // Категория: принимаем любую строку, чтобы не падать на старых/ручных данных
    category: z.string().default('Другое'), 
    
    images: z.array(z.string()).default([]),
    relatedProducts: z.array(z.string()).default([]),

    masterNote: z.string().optional(),

    specs: z.object({
      volume: z.string().optional(),
      size: z.string().optional(),
      material: z.string().default('Шамот, глазурь'),
    }).default({}),
    
    tags: z.array(z.string()).default([]),
    careInstructions: z.string().optional(),
  }),
});

// 2. Блог (Blog)
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    coverImage: z.string().optional(),
    relatedProducts: z.array(z.string()).optional(),
  }),
});

// 3. B2B
const b2b = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    contactButtonText: z.string(),
  }),
});

export const collections = {
  products,
  blog,
  b2b,
};