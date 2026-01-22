import { defineCollection, z, reference } from 'astro:content';

// ВАЖНО: Мы НЕ импортируем image из astro:content для схемы, 
// потому что храним файлы в public, а не в src/assets.

// 1. Справочники
const tags = defineCollection({
  type: 'content',
  schema: z.object({ title: z.string() }).passthrough(),
});

const categories = defineCollection({
  type: 'content',
  schema: z.object({ title: z.string() }).passthrough(),
});

// 2. Товары
const products = defineCollection({
  type: 'content', 
  schema: z.object({
    title: z.string(),
    // Картинки - это просто массив строк (путей)
    images: z.array(z.string()).default([]), 
    
    // Остальные поля
    price: z.any().optional(), 
    category: z.any().optional(),
    tags: z.any().optional(),
    relatedProducts: z.any().optional(),
    specs: z.any().optional(),
    status: z.any().optional(),
  }).passthrough(),
});

// 3. Блог
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    pubDate: z.union([z.string(), z.date()]).transform((str) => new Date(str)), 
    // ИСПРАВЛЕНО: z.string(), а не image()
    coverImage: z.string().optional(), 
    relatedProducts: z.any().optional(),
  }).passthrough(),
});

// 4. О Мастере (About)
const about = defineCollection({
  type: 'content', 
  schema: z.object({
    title: z.string().default('О Мастере'),
    // ИСПРАВЛЕНО: z.string(), так как файл лежит в public
    heroImage: z.string().optional(), 
  }).passthrough(),
});

// 5. Landing
const landing = defineCollection({
  type: 'data',
  schema: z.object({
    heroTitleLine1: z.string().optional(),
    // ИСПРАВЛЕНО: z.string(), а не image()
    heroImage: z.string().optional(), 
    workshopTitle: z.string().optional(),
    workshopText: z.string().optional(),
    // ИСПРАВЛЕНО: z.string(), а не image()
    workshopImage: z.string().optional(),
  }).passthrough(),
});

const b2b = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
  }).passthrough(),
});

export const collections = {
  products,
  tags,
  categories,
  blog,
  about, 
  landing,
  b2b,
};