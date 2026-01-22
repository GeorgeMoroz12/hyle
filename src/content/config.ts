import { defineCollection, z, reference } from 'astro:content';

// 1. Справочники
const tags = defineCollection({
  type: 'content',
  schema: z.object({ 
    name: z.string(), // Теперь поле называется name
  }).passthrough(),
});

const categories = defineCollection({
  type: 'content',
  schema: z.object({ 
    name: z.string(), // Теперь поле называется name
  }).passthrough(),
});

// 2. Товары
const products = defineCollection({
  type: 'content', 
  schema: z.object({
    title: z.string(),
    price: z.any().optional(), 
    
    // ГИБРИДНАЯ СХЕМА: Принимаем и новую ссылку, и старую строку
    category: z.union([
        reference('categories'),
        z.string(),
        z.null(),
        z.undefined()
    ]).optional(),

    // ГИБРИДНАЯ СХЕМА: Массив ссылок или массив строк
    tags: z.union([
        z.array(reference('tags')),
        z.array(z.string()),
        z.null(),
        z.undefined()
    ]).optional(),

    images: z.array(z.string()).default([]),
    relatedProducts: z.any().optional(),
    specs: z.any().optional(),
    status: z.any().optional(),
    description: z.any().optional(),
    careInstructions: z.any().optional(),
    masterNote: z.any().optional(),
  }).passthrough(),
});

// 3. Блог
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    pubDate: z.union([z.string(), z.date()]).transform((str) => new Date(str)), 
    coverImage: z.string().optional(),
    
    tags: z.union([
        z.array(reference('tags')),
        z.array(z.string()),
        z.null()
    ]).optional(),

    relatedProducts: z.any().optional(),
  }).passthrough(),
});

// 4. О Мастере
const about = defineCollection({
  type: 'content', 
  schema: z.object({
    title: z.string().default('О Мастере'),
    heroImage: z.string().optional(),
  }).passthrough(),
});

// 5. Singletons
const landing = defineCollection({
  type: 'data',
  schema: z.object({
    heroTitleLine1: z.string().optional(),
    heroImage: z.string().optional(),
    workshopTitle: z.string().optional(),
    workshopText: z.string().optional(),
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