import { defineCollection, z, reference } from 'astro:content';

// 1. Справочники (Теги и Категории)
const tags = defineCollection({
  type: 'content',
  schema: z.object({ 
    title: z.string(), // Обязательное поле для Keystatic
  }).passthrough(),
});

const categories = defineCollection({
  type: 'content',
  schema: z.object({ 
    title: z.string(), // Обязательное поле для Keystatic
  }).passthrough(),
});

// 2. Товары (Products) — Максимально толерантная схема для легаси данных
const products = defineCollection({
  type: 'content', 
  schema: z.object({
    title: z.string(),
    
    // Цена: принимаем что угодно, превращаем в число
    price: z.any()
      .transform((val) => {
        const num = Number(val);
        return isNaN(num) ? 0 : num;
      })
      .optional(), 
    
    // Категория: Ссылка (Object) или Строка (Legacy) или Null
    category: z.union([
        reference('categories'),
        z.string(),
        z.null(),
        z.undefined()
    ]).optional(),

    // Теги: Массив ссылок, массив строк или Null
    tags: z.union([
        z.array(z.union([reference('tags'), z.string(), z.null()])),
        z.null(),
        z.undefined()
    ]).optional(),

    // Связанные товары
    relatedProducts: z.any().optional(),

    // Картинки
    images: z.array(z.string()).default([]),
    image: z.any().optional(), // Legacy support

    // Характеристики и описание
    specs: z.any().optional(),
    status: z.any().optional(),
    description: z.any().optional(),
    careInstructions: z.any().optional(),
    masterNote: z.any().optional(),
    
    // Старые поля (Legacy)
    inStock: z.any().optional(),
    isNew: z.any().optional(),
    care: z.any().optional(),
  }).passthrough(), // Пропускаем любые неизвестные поля
});

// 3. Блог
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    // Дата: строка или объект Date
    pubDate: z.union([z.string(), z.date()])
      .transform((str) => new Date(str))
      .optional(), 
    coverImage: z.string().optional(),
    relatedProducts: z.any().optional(),
    tags: z.any().optional(),
  }).passthrough(),
});

// 4. О Мастере (Singleton Content)
const about = defineCollection({
  type: 'content', 
  schema: z.object({
    title: z.string().default('О Мастере'),
    heroImage: z.string().optional(),
  }).passthrough(),
});

// 5. Landing (Singleton Data)
const landing = defineCollection({
  type: 'data',
  schema: z.object({
    heroTitleLine1: z.string().optional(),
    heroTitleAccent: z.string().optional(),
    heroTitleLine2: z.string().optional(),
    heroDescription: z.string().optional(),
    heroImage: z.string().optional(),
    
    workshopTitle: z.string().optional(),
    workshopText: z.string().optional(),
    workshopImage: z.string().optional(),
  }).passthrough(),
});

// 6. B2B (Singleton Data)
const b2b = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    contactButtonText: z.string().optional(),
  }).passthrough(),
});

// Экспорт всех коллекций
export const collections = {
  products,
  tags,
  categories,
  blog,
  about, 
  landing,
  b2b,
};