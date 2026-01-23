import { defineCollection, z, reference } from 'astro:content';

// 1. Справочники
const tags = defineCollection({
  type: 'content',
  schema: z.object({ 
    name: z.string(), // Русское название
  }).passthrough(),
});

const categories = defineCollection({
  type: 'content',
  schema: z.object({ 
    name: z.string(), // Русское название
  }).passthrough(),
});

// 2. Товары
const products = defineCollection({
  type: 'content', 
  schema: z.object({
    title: z.string(),
    price: z.any().optional(), 
    
    // КАТЕГОРИЯ: Ссылка на справочник
    category: z.union([
        reference('categories'), // Новая правильная связь
        z.string(),              // Старая строка (Legacy)
        z.null(),
        z.undefined()
    ]).optional(),

    // ТЕГИ: Массив ссылок, строк ИЛИ null внутри массива
    tags: z.union([
        z.array(z.union([reference('tags'), z.string(), z.null()])), // Разрешаем смешанный контент и null
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
    
    // Legacy поля
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