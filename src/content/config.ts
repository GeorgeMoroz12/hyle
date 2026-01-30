import { defineCollection, z, reference } from 'astro:content';

// 1. Справочники
const tags = defineCollection({
  type: 'data', 
  schema: z.object({ title: z.string() }).passthrough(),
});

const categories = defineCollection({
  type: 'data', 
  schema: z.object({ title: z.string() }).passthrough(),
});

// 2. Настройки
const settings = defineCollection({
  type: 'data',
  schema: z.object({
    siteTitle: z.string().optional(),
    telegramUser: z.string().optional(),
    // ...
  }).passthrough(),
});

// 3. Landing
const landing = defineCollection({
  type: 'data',
  schema: z.object({
    heroSlides: z.array(z.any()).optional(),
    faq: z.array(z.any()).optional(),
    // ...
  }).passthrough(),
});

// 4. Товары
const products = defineCollection({
  type: 'content', 
  : z.object({
    title: z.string(),
    sortOrder: z.number().optional().default(0),
    price: z.any().transform(v => isNaN(Number(v)) ? 0 : Number(v)).optional(),
    
    // МАРКЕТИНГ
    isNew: z.boolean().optional().default(false),  // Новинка
    isSale: z.boolean().optional().default(false), // Акция
    oldPrice: z.number().optional(),               // Старая цена
    
    category: z.union([reference('categories'), z.string(), z.null(), z.undefined()]).optional(),
    tags: z.union([z.array(z.union([reference('tags'), z.string(), z.null()])), z.null(), z.undefined()]).optional(),
    images: z.array(z.string()).default([]),
    relatedProducts: z.any().optional(),
    specs: z.any().optional(),
    status: z.any().optional(),
    description: z.any().optional(),
    careInstructions: z.any().optional(),
    masterNote: z.any().optional(),
    seo: z.any().optional(),
    
    // Legacy
    inStock: z.any().optional(),
    // isNew (старый) конфликтует по имени, но так как мы используем passthrough, 
    // z.boolean() выше обработает и старые, и новые значения, если они были булевыми.
    care: z.any().optional(),
  }).passthrough(),
});

// ... About, Blog, B2B без изменений
const about = defineCollection({
  type: 'content', 
  schema: z.object({ title: z.string().default('О Мастере'), heroImage: z.string().optional() }).passthrough(),
});

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    pubDate: z.any().optional(),
    coverImage: z.string().optional(),
    relatedProducts: z.any().optional(),
    tags: z.any().optional(),
    seo: z.any().optional(),
  }).passthrough(),
});

const b2b = defineCollection({
  type: 'data',
  schema: z.object({ title: z.string() }).passthrough(),
});

export const collections = {
  products, tags, categories, blog, about, landing, b2b, settings
};