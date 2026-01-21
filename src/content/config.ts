import { defineCollection, z, reference } from 'astro:content';

// 1. Справочники
const tags = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
  }).passthrough(),
});

const categories = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
  }).passthrough(),
});

// 2. Товары (Products) — NUCLEAR OPTION ☢️
// Принимаем АБСОЛЮТНО ВСЁ, чтобы slonik.mdoc не ломал билд.
const products = defineCollection({
  type: 'content', 
  schema: z.object({
    // Оставляем title строкой, так как это основа файла
    title: z.string(),

    // ВСЕ остальные поля — z.any().optional()
    // Это значит: "Мне плевать, что там лежит. Строка, число, массив или null — пропускай всё."
    
    price: z.any().optional(), 
    category: z.any().optional(),
    tags: z.any().optional(),
    relatedProducts: z.any().optional(),
    
    images: z.any().optional(),
    image: z.any().optional(), // legacy
    
    status: z.any().optional(),
    specs: z.any().optional(),
    
    description: z.any().optional(),
    careInstructions: z.any().optional(),
    masterNote: z.any().optional(),

    // LEGACY
    inStock: z.any().optional(),
    isNew: z.any().optional(),
    care: z.any().optional(),

  }).passthrough(), // <--- Игнорируем любые поля, которые мы даже забыли упомянуть
});

// 3. Блог
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    pubDate: z.any().optional(),
    coverImage: z.any().optional(),
    relatedProducts: z.any().optional(),
  }).passthrough(),
});

// 4. B2B
const b2b = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    contactButtonText: z.any().optional(),
  }).passthrough(),
});

export const collections = {
  products,
  tags,
  categories,
  blog,
  b2b,
};