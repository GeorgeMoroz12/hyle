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

// 2. Товары (Products) - МАКСИМАЛЬНО МЯГКАЯ СХЕМА
const products = defineCollection({
  type: 'content', 
  schema: z.object({
    // Title - единственное, что обязано быть (иначе файл не имеет смысла)
    title: z.string(),

    // ЦЕНА: Берем что угодно, пытаемся сделать числом, если нет - 0
    price: z.any()
      .transform((val) => {
        const num = Number(val);
        return isNaN(num) ? 0 : num;
      })
      .optional(), 

    // КАТЕГОРИЯ: Самое важное место
    // Union позволяет и старую строку, и новую ссылку, и null
    category: z.union([
        reference('categories'), // Новая связь
        z.string(),              // Старая строка (Legacy)
        z.null(),                // Пустота
        z.undefined()
    ]).optional(),

    // ТЕГИ: Union массивов ссылок и строк
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

    // СТАТУС: Если там что-то левое или нет поля, ставим 'В наличии'
    status: z.union([
        z.enum(['В наличии', 'Под заказ', 'Продано', 'Архив']),
        z.string()
    ]).catch('В наличии').default('В наличии'),

    // ТЕКСТЫ И СПЕЦИФИКАЦИИ (Все опционально и any)
    description: z.any().optional(),
    careInstructions: z.any().optional(),
    masterNote: z.any().optional(),

    // Specs: ловим ошибки структуры
    specs: z.object({
      volume: z.string().optional(),
      size: z.string().optional(),
      material: z.string().optional(),
    }).catch({}).optional(),

    // LEGACY ПОЛЯ (Мусор) - принимаем как any, чтобы не падало
    inStock: z.any().optional(),
    isNew: z.any().optional(),
    care: z.any().optional(),
    image: z.any().optional(), // На случай, если где-то image вместо images

  }).passthrough(), // <--- ВАЖНО: Игнорирует любые поля, не описанные выше
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