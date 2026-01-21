import { defineCollection, z, reference } from 'astro:content';

// 1. Справочники (Теги и Категории)
// Они должны быть определены, чтобы reference() работало
const tags = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
  }).passthrough(), // Разрешаем любой мусор
});

const categories = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
  }).passthrough(),
});

// 2. Товары (Products) - МАКСИМАЛЬНО МЯГКАЯ СХЕМА
const products = defineCollection({
  type: 'content', 
  schema: z.object({
    // Единственное обязательное поле - Title. Всё остальное может отсутствовать.
    title: z.string(),

    // ЦЕНА: Принимаем число, строку, null. Превращаем в 0 при ошибке.
    price: z.any()
      .transform((val) => {
        const num = Number(val);
        return isNaN(num) ? 0 : num;
      })
      .optional(), 

    // КАТЕГОРИЯ: Самое сложное место.
    // Может быть ссылкой (reference), строкой (legacy) или null.
    category: z.union([
        reference('categories'),
        z.string(),
        z.null(),
        z.undefined()
    ]).optional(),

    // ТЕГИ: Массив ссылок, массив строк или null.
    tags: z.union([
        z.array(reference('tags')),
        z.array(z.string()),
        z.null(),
        z.undefined()
    ]).optional(),

    // СВЯЗАННЫЕ ТОВАРЫ
    relatedProducts: z.union([
        z.array(reference('products')),
        z.array(z.string()),
        z.null(),
        z.undefined()
    ]).optional(),

    // КАРТИНКИ: Разрешаем массив строк или any (на случай ошибок)
    images: z.array(z.string()).default([]).optional(),

    // СТАТУС
    status: z.enum(['В наличии', 'Под заказ', 'Продано', 'Архив'])
      .catch('В наличии') // Если значение кривое, ставим 'В наличии'
      .default('В наличии'),

    // СПЕЦИФИКАЦИИ (Вложенный объект)
    specs: z.object({
      volume: z.string().optional(),
      size: z.string().optional(),
      material: z.string().optional(),
    }).catch({}).default({}), // Если specs сломаны, возвращаем пустой объект

    // ТЕКСТОВЫЕ ПОЛЯ
    description: z.any().optional(),
    careInstructions: z.string().optional(),
    masterNote: z.string().optional(),

    // LEGACY ПОЛЯ (Для совместимости)
    inStock: z.any().optional(),
    isNew: z.any().optional(),
    care: z.any().optional(),

  }).passthrough(), // <--- КРИТИЧНО: Игнорирует любые неизвестные поля в файле, не выдавая ошибку
});

// 3. Блог
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    pubDate: z.date().optional(),
    coverImage: z.string().optional(),
    relatedProducts: z.any().optional(),
  }).passthrough(),
});

// 4. B2B
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
  b2b,
};