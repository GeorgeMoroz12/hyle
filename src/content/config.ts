import { defineCollection, z, reference } from 'astro:content';

// --- СУЩЕСТВУЮЩИЕ СПРАВОЧНИКИ ---
const tags = defineCollection({
  type: 'content',
  schema: z.object({ title: z.string() }).passthrough(),
});

const categories = defineCollection({
  type: 'content',
  schema: z.object({ title: z.string() }).passthrough(),
});

// --- СУЩЕСТВУЮЩИЕ ТОВАРЫ ---
const products = defineCollection({
  type: 'content', 
  schema: z.object({
    title: z.string(),
    // ... остальные поля оставляем как были в режиме "Soft Mode"
    price: z.any().optional(), 
    category: z.any().optional(),
    tags: z.any().optional(),
    images: z.any().optional(),
    status: z.any().optional(),
  }).passthrough(),
});

// --- НОВАЯ КОЛЛЕКЦИЯ: LANDING (ГЛАВНАЯ) ---
const landing = defineCollection({
  type: 'data', // Это JSON файл
  schema: ({ image }) => z.object({
    // Hero Section
    heroTitleLine1: z.string().optional().default("Глина"),
    heroTitleAccent: z.string().optional().default("хранит"),
    heroTitleLine2: z.string().optional().default("тепло."),
    heroDescription: z.string().optional(),
    
    // Внимание: для работы image() файл должен лежать в src/assets или public
    // Мы пока используем строку, так как Keystatic сохраняет в public
    heroImage: z.string().optional(), 

    // Workshop Section
    workshopTitle: z.string().optional(),
    workshopText: z.string().optional(),
    workshopImage: z.string().optional(),
  }).passthrough(),
});

// --- ОСТАЛЬНОЕ ---
const blog = defineCollection({
  type: 'content',
  schema: z.object({ title: z.string() }).passthrough(),
});

const b2b = defineCollection({
  type: 'data',
  schema: z.object({ title: z.string() }).passthrough(),
});

export const collections = {
  products,
  tags,
  categories,
  blog,
  b2b,
  landing, // <--- Добавили новую коллекцию
};