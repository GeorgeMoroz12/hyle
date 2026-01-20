import { defineCollection, z } from 'astro:content';

// 1. Товары
const products = defineCollection({
  type: 'content', 
  schema: z.object({
    title: z.string(),
    price: z.number().min(0).default(0), 
    status: z.enum(['В наличии', 'Под заказ', 'Продано', 'Архив']).default('В наличии'),
    
    // Связи (Relationship сохраняет просто строку-slug)
    category: z.string().default('Другое'), 
    tags: z.array(z.string()).default([]),
    relatedProducts: z.array(z.string()).default([]),

    images: z.array(z.string()).default([]),
    masterNote: z.string().optional(),

    specs: z.object({
      volume: z.string().optional(),
      size: z.string().optional(),
      material: z.string().default('Шамот, глазурь'),
    }).default({}),
    
    careInstructions: z.string().optional(),
  }),
});

// 2. Новая коллекция ТЕГОВ (для справочника)
const tags = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
  }),
});

// 3. Новая коллекция КАТЕГОРИЙ (для справочника)
const categories = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
  }),
});

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    coverImage: z.string().optional(),
    relatedProducts: z.array(z.string()).optional(),
  }),
});

const b2b = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    contactButtonText: z.string(),
  }),
});

export const collections = {
  products,
  tags,         // <--- Добавили
  categories,   // <--- Добавили
  blog,
  b2b,
};