import { defineCollection, z, reference } from 'astro:content';

const tags = defineCollection({
  type: 'content',
  schema: z.object({ title: z.string() }).passthrough(),
});

const categories = defineCollection({
  type: 'content',
  schema: z.object({ title: z.string() }).passthrough(),
});

const products = defineCollection({
  type: 'content', 
  schema: z.object({
    title: z.string(),
    price: z.any().optional(), 
    category: z.any().optional(),
    tags: z.any().optional(),
    images: z.any().optional(),
    relatedProducts: z.any().optional(),
    specs: z.any().optional(),
    status: z.any().optional(),
  }).passthrough(),
});

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    pubDate: z.union([z.string(), z.date()]).transform((str) => new Date(str)), 
    coverImage: z.string().optional(),
    relatedProducts: z.any().optional(),
  }).passthrough(),
});

// ПРОВЕРКА: About (Singleton)
const about = defineCollection({
  type: 'content', 
  schema: z.object({
    title: z.string().default('О Мастере'),
    heroImage: z.string().optional(), // Ожидаем строку вида "/images/about/..."
  }).passthrough(),
});

// ПРОВЕРКА: Landing (Singleton)
const landing = defineCollection({
  type: 'data',
  schema: z.object({
    heroTitleLine1: z.string().optional(),
    heroImage: z.string().optional(), // Ожидаем строку
    workshopTitle: z.string().optional(),
    workshopText: z.string().optional(),
    workshopImage: z.string().optional(), // Ожидаем строку
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