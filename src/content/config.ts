import { defineCollection, z, reference } from 'astro:content';

// 1. Справочники (Теги и Категории)
// Определяем их первыми, чтобы reference() работало корректно
const tags = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
  }).passthrough(), // Разрешаем любые дополнительные поля
});

const categories = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
  }).passthrough(),
});

// 2. Товары (Products) - МАКСИМАЛЬНО ТОЛЕРАНТНАЯ СХЕМА
const products = defineCollection({
  type: 'content', 
  schema: z.object({
    // Title - единственное, что обязано быть
    title: z.string(),

    // ЦЕНА: Берем что угодно, пытаемся сделать числом, если нет - 0
    price: z.any()
      .transform((val) => {
        const num = Number(val);
        return isNaN(num) ? 0 : num;
      })
      .optional(), 

    // КАТЕГОРИЯ: Union позволяет и старую строку, и новую ссылку
    category: z.union([
        reference('categories'), // Новая связь
        z.string(),              // Старая строка
        z.null(),                // Пустота
        z.undefined()
    ]).optional(),

    // ТЕГИ: Union массивов
    tags: z.union([
        z.array(reference('tags')), // Новые связи
        z.array(z.string()),        // Старые строки
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

    // КАРТИНКИ: Пытаемся взять массив, если там мусор - возвращаем пустой массив
    images: z.array(z.string()).catch([]).optional(),

    // СТАТУС: Если там что-то левое, ставим 'В наличии'
    status: z.enum(['В наличии', 'Под заказ', 'Продано', 'Архив'])
      .catch('В наличии')
      .default('В наличии'),

    // ТЕКСТЫ И СПЕЦИФИКАЦИИ (Все опционально)
    description: z.any().optional(),
    careInstructions: z.any().optional(),
    masterNote: z.any().optional(),

    specs: z.object({
      volume: z.string().optional(),
      size: z.string().optional(),
      material: z.string().optional(),
    }).catch({}).optional(),

    // LEGACY ПОЛЯ (Мусор) - принимаем как any
    inStock: z.any().optional(),
    isNew: z.any().optional(),
    care: z.any().optional(),
    image: z.any().optional(), // На случай старых image вместо images

  }).passthrough(), // <--- ВАЖНО: Игнорирует любые поля, не описанные в схеме
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