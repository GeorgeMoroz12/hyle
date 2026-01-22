import { defineCollection, z } from 'astro:content'; 
// Убрали reference из импорта, так как временно отключаем его

// 1. Справочники
const tags = defineCollection({
  type: 'content',
  schema: z.object({ title: z.string().optional() }).passthrough(),
});

const categories = defineCollection({
  type: 'content',
  schema: z.object({ title: z.string().optional() }).passthrough(),
});

// 2. Товары (Products) — RELAXED VALIDATION
const products = defineCollection({
  type: 'content', 
  schema: z.object({
    title: z.string(),
    
    // --- HOTFIX START ---
    // Отключаем reference(), чтобы не падало на старых строках
    // Используем z.any(), чтобы принимать и String, и Array, и Object
    
    category: z.any().optional(),       // Было: reference('categories')
    tags: z.any().optional(),           // Было: z.array(reference('tags'))
    relatedProducts: z.any().optional(),// Было: z.array(reference('products'))
    
    // --- HOTFIX END ---

    price: z.any().optional(),
    images: z.any().optional(), // Массив путей или строк
    
    status: z.any().optional(),
    specs: z.any().optional(),
    
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
    pubDate: z.any().optional(),
    coverImage: z.string().optional(),
    
    // --- HOTFIX START ---
    tags: z.any().optional(),           // Отключили валидацию связей
    relatedProducts: z.any().optional(),// Отключили валидацию связей
    // --- HOTFIX END ---

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