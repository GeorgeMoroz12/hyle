import { defineCollection, z, reference } from 'astro:content';

// 1. Справочники (ТЕПЕРЬ ИЩЕМ TITLE)
const tags = defineCollection({
  type: 'content',
  schema: z.object({ 
    title: z.string(), // БЫЛО: name, СТАЛО: title
  }).passthrough(),
});

const categories = defineCollection({
  type: 'content',
  schema: z.object({ 
    title: z.string(), // БЫЛО: name, СТАЛО: title
  }).passthrough(),
});

// 2. Товары
const products = defineCollection({
  type: 'content', 
  schema: z.object({
    title: z.string(),
    price: z.any().optional(), 
    
    // Категория: Ссылка (Object) или Строка (String) или Null
    category: z.union([
        reference('categories'),
        z.string(),
        z.null(),
        z.undefined()
    ]).optional(),

    // Теги: Массив ссылок, строк или Null
    tags: z.union([
        z.array(z.union([reference('tags'), z.string(), z.null()])),
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
    
    // Legacy
    inStock: z.any().optional(),
    isNew: z.any().optional(),
    care: z.any().optional(),
  }).passthrough(),
});

// 3. Блог
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    pubDate: z.union([z.string(), z.date()]).transform((str) => new Date(str)), 
    coverImage: z.string().optional(),
    relatedProducts: z.any().optional(),
    tags: z.any().optional(), // В блоге тоже теги
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

// 5. Landing & B2B
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