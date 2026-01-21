import { defineCollection, z, reference } from 'astro:content';

// 1. Справочники
// Определяем их первыми, так как Products на них ссылаются
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

// 2. Товары (Products) — SOFT MODE
const products = defineCollection({
  type: 'content', 
  schema: z.object({
    // Только заголовок обязан быть строкой. Остальное — опционально.
    title: z.string(),

    // ЦЕНА: Превращаем любой мусор в число 0
    price: z.any()
      .transform((val) => {
        const n = Number(val);
        return isNaN(n) ? 0 : n;
      })
      .optional(), 

    // КАТЕГОРИЯ: Ссылка ИЛИ Строка ИЛИ Null
    category: z.union([
        reference('categories'),
        z.string(),
        z.null()
    ]).optional(),

    // ТЕГИ: Ссылки ИЛИ Строки ИЛИ Null
    tags: z.union([
        z.array(reference('tags')),
        z.array(z.string()),
        z.null()
    ]).optional(),

    // СВЯЗАННЫЕ ТОВАРЫ
    relatedProducts: z.union([
        z.array(reference('products')),
        z.array(z.string()),
        z.null()
    ]).optional(),

    // СТАТУС: Пробуем Enum, если нет — просто строка
    status: z.union([
      z.enum(['В наличии', 'Под заказ', 'Продано', 'Архив']),
      z.string()
    ]).catch('В наличии').optional(),

    // КАРТИНКИ: Разрешаем всё (массив строк, одна строка, null)
    images: z.any().optional(),
    image: z.any().optional(), // Для старых файлов

    // СПЕЦИФИКАЦИИ: Разрешаем любой объект или null
    specs: z.any().optional(),

    // ТЕКСТОВЫЕ ПОЛЯ
    description: z.any().optional(),
    careInstructions: z.any().optional(),
    masterNote: z.any().optional(),

    // LEGACY (Старые поля)
    inStock: z.any().optional(),
    isNew: z.any().optional(),
    care: z.any().optional(),

  }).passthrough(), // <--- ГЛАВНЫЙ ФИКС: Игнорируем любые неизвестные поля
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