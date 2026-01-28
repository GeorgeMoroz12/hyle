import { defineCollection, z, reference } from 'astro:content';

// 1. Справочники (ТЕГИ И КАТЕГОРИИ)
// ФИКС: Меняем type с 'content' на 'data', так как физически это YAML/JSON файлы.
const tags = defineCollection({
  type: 'data', // <--- БЫЛО: 'content', СТАЛО: 'data'
  schema: z.object({ 
    title: z.string(), 
  }).passthrough(),
});

const categories = defineCollection({
  type: 'data', // <--- БЫЛО: 'content', СТАЛО: 'data'
  schema: z.object({ 
    title: z.string(), 
  }).passthrough(),
});

// 2. Товары (Products) — Остаются 'content', так как у них есть тело статьи (.mdoc)
const products = defineCollection({
  type: 'content', 
  schema: z.object({
    title: z.string(),
    price: z.any().optional(),
    
    // Ссылки работают одинаково и для 'content', и для 'data' коллекций
    category: z.union([
        reference('categories'),
        z.string(),
        z.null(),
        z.undefined()
    ]).optional(),

    tags: z.union([
        z.array(z.union([reference('tags'), z.string(), z.null()])),
        z.null(),
        z.undefined()
    ]).optional(),

    // Остальные поля...
    images: z.array(z.string()).default([]),
    image: z.any().optional(),
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

// 3. Блог — 'content' (это статьи)
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    pubDate: z.union([z.string(), z.date()])
      .transform((str) => new Date(str))
      .optional(), 
    coverImage: z.string().optional(),
    relatedProducts: z.any().optional(),
    tags: z.any().optional(),
  }).passthrough(),
});

// 4. О Мастере — 'content' (это статья)
const about = defineCollection({
  type: 'content', 
  schema: z.object({
    title: z.string().default('О Мастере'),
    heroImage: z.string().optional(),
  }).passthrough(),
});

// 5. Landing — 'data' (JSON)
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

// 6. B2B — 'data' (JSON)
const b2b = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    contactButtonText: z.string().optional(),
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