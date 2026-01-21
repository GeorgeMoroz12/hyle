import { defineCollection, z, reference } from 'astro:content';

// 1. Справочники
const tags = defineCollection({
  type: 'content',
  schema: z.object({ title: z.string() }).passthrough(),
});

const categories = defineCollection({
  type: 'content',
  schema: z.object({ title: z.string() }).passthrough(),
});

// 2. Товары (Soft Mode - чтобы не ломалось на старых)
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

// 3. Блог (НОВОЕ)
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    pubDate: z.union([z.string(), z.date()]).transform((str) => new Date(str)), 
    coverImage: z.string().optional(),
    relatedProducts: z.any().optional(),
  }).passthrough(),
});

// 4. О Мастере (НОВОЕ)
const about = defineCollection({
  type: 'content', 
  schema: z.object({
    title: z.string().default('О Мастере'),
    // Путь к фото (напр. "/images/about/me.jpg")
    heroImage: z.string().optional(),
  }).passthrough(),
});

// 5. Одиночные страницы (Landing, B2B)
const landing = defineCollection({
  type: 'data',
  schema: z.object({
    heroTitleLine1: z.string().optional(),
    // Явно добавляем поля картинок, чтобы фронтенд знал о них
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