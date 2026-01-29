import { config, fields, collection, singleton } from '@keystatic/core';

// --- ОПРЕДЕЛЕНИЕ КАСТОМНЫХ БЛОКОВ ---

// ФИКС: Определяем блок как простой объект, без функции component()
// Это предотвращает ошибку импорта при сборке
const productCardBlock = {
  label: '🛍️ Карточка товара',
  schema: {
    item: fields.relationship({
      label: 'Выберите товар',
      collection: 'products',
      validation: { isRequired: true },
    }),
  },
  preview: (props: any) => {
    return props.fields.item.value 
      ? `📦 Вставлен товар: ${props.fields.item.value}` 
      : '⚠️ Выберите товар...';
  },
};

export default config({
  storage: import.meta.env.PROD
    ? {
        kind: 'github',
        repo: 'GeorgeMoroz12/hyle',
      }
    : {
        kind: 'local',
      },

  singletons: {
    landing: singleton({
      label: 'Главная страница',
      path: 'src/content/landing/home',
      schema: {
        heroTitleLine1: fields.text({ label: 'Hero: Заголовок 1', defaultValue: 'Глина' }),
        heroTitleAccent: fields.text({ label: 'Hero: Акцент', defaultValue: 'хранит' }),
        heroTitleLine2: fields.text({ label: 'Hero: Заголовок 2', defaultValue: 'тепло.' }),
        heroDescription: fields.text({ label: 'Hero: Описание', multiline: true }),
        heroImage: fields.image({
            label: 'Hero: Фото',
            directory: 'public/images/landing',
            publicPath: '/images/landing/'
        }),
        workshopTitle: fields.text({ label: 'Workshop: Заголовок' }),
        workshopText: fields.text({ label: 'Workshop: Текст', multiline: true }),
        workshopImage: fields.image({
            label: 'Workshop: Фото',
            directory: 'public/images/landing',
            publicPath: '/images/landing/'
        }),
      },
    }),

    about: singleton({
      label: 'О Мастере',
      path: 'src/content/about/main',
      format: { contentField: 'content' },
      schema: {
        title: fields.text({ label: 'Заголовок', defaultValue: 'О Мастере' }),
        heroImage: fields.image({
          label: 'Фото мастера',
          directory: 'public/images/about',
          publicPath: '/images/about/',
          validation: { isRequired: true }
        }),
        content: fields.document({
          label: 'Текст',
          formatting: true,
          dividers: true,
          links: true,
          images: { directory: 'public/images/about/content', publicPath: '/images/about/content/' },
        }),
      },
    }),

    b2b: singleton({
      label: 'Страница B2B',
      path: 'src/content/b2b/main',
      schema: {
        title: fields.text({ label: 'Заголовок' }),
        content: fields.document({ label: 'Текст', formatting: true }),
        contactButtonText: fields.text({ label: 'Текст кнопки' }),
      },
    }),
  },

  collections: {
    categories: collection({
      label: 'Справочник: Категории',
      slugField: 'title',
      path: 'src/content/categories/*',
      schema: { title: fields.slug({ name: { label: 'Название' } }) },
    }),

    tags: collection({
      label: 'Справочник: Теги',
      slugField: 'title',
      path: 'src/content/tags/*',
      schema: { title: fields.slug({ name: { label: 'Название' } }) },
    }),

    products: collection({
      label: 'Товары',
      slugField: 'title',
      path: 'src/content/products/*',
      format: { contentField: 'description' },
      columns: ['title', 'status', 'price', 'category'],
      schema: {
        // --- ГРУППА SEO ---
        seo: fields.object({
          title: fields.text({ 
            label: 'SEO Заголовок (Title)', 
            description: 'Синим цветом в выдаче Google. Если пусто — берем название товара. (Макс 60)',
            validation: { length: { max: 60 } }
          }),
          description: fields.text({ 
            label: 'SEO Описание (Meta Description)', 
            multiline: true, 
            description: 'Серый текст под заголовком в Google. (Макс 160)',
            validation: { length: { max: 160 } }
          }),
          ogImage: fields.image({ 
            label: 'Картинка для соцсетей (OG:Image)', 
            description: 'Картинка для шаринга (Telegram, VK). Если пусто — берем первое фото товара.',
            directory: 'public/images/products/seo', 
            publicPath: '/images/products/seo/' 
          }),
        }, { label: '🔍 SEO Настройки' }),
        // -----------------

        images: fields.array(
          fields.image({ label: 'Фото', directory: 'public/images/products', publicPath: '/images/products/' }),
          { label: 'Фотографии', itemLabel: (props) => `Фото #${props.index + 1}` }
        ),
        title: fields.slug({ name: { label: 'Название' } }),
        price: fields.number({ label: 'Цена (₽)' }),
        status: fields.select({
          label: 'Статус',
          options: [
            { label: '🟢 В наличии', value: 'В наличии' },
            { label: '🟡 Под заказ', value: 'Под заказ' },
            { label: '🔴 Продано', value: 'Продано' },
            { label: '🗄️ Архив', value: 'Архив' },
          ],
          defaultValue: 'В наличии',
        }),
        category: fields.relationship({ label: 'Категория', collection: 'categories', validation: { isRequired: false } }),
        tags: fields.array(
          fields.relationship({ label: 'Тег', collection: 'tags' }),
          { label: 'Теги', itemLabel: (props) => props.value }
        ),
        relatedProducts: fields.array(
          fields.relationship({ label: 'Товар', collection: 'products' }), 
          { label: 'С этим покупают' }
        ),
        specs: fields.object({
          volume: fields.text({ label: 'Объем (мл)' }),
          size: fields.text({ label: 'Размер (см)' }),
          material: fields.text({ label: 'Материал' }),
        }, { label: 'Характеристики' }),
        careInstructions: fields.text({ label: 'Уход', multiline: true }),
        masterNote: fields.text({ label: 'Заметка мастера', multiline: true }),
        description: fields.document({ label: 'Описание', formatting: true }),
        
        // Legacy
        inStock: fields.checkbox({ label: '⚠️ Old: inStock' }),
        isNew: fields.checkbox({ label: '⚠️ Old: isNew' }),
        care: fields.text({ label: '⚠️ Old: care', multiline: true }),
      },
    }),

    blog: collection({
      label: 'Блог',
      slugField: 'title',
      path: 'src/content/blog/*',
      format: { contentField: 'content' },
      columns: ['title', 'pubDate'],
      schema: {
        // --- ГРУППА SEO ДЛЯ БЛОГА ---
        seo: fields.object({
          title: fields.text({ 
            label: 'SEO Заголовок (Title)', 
            description: 'Если пусто — берем название статьи.',
            validation: { length: { max: 60 } }
          }),
          description: fields.text({ 
            label: 'SEO Описание (Meta Description)', 
            multiline: true, 
            validation: { length: { max: 160 } }
          }),
          ogImage: fields.image({ 
            label: 'Картинка для соцсетей (OG:Image)', 
            directory: 'public/images/blog/seo', 
            publicPath: '/images/blog/seo/' 
          }),
        }, { label: '🔍 SEO Настройки' }),
        // ----------------------------

        title: fields.slug({ name: { label: 'Заголовок' } }),
        pubDate: fields.date({ label: 'Дата', defaultValue: { kind: 'today' } }),
        coverImage: fields.image({
          label: 'Обложка',
          directory: 'public/images/blog',
          publicPath: '/images/blog/',
        }),
        relatedProducts: fields.array(
          fields.relationship({ label: 'Товар', collection: 'products' }),
          { label: 'Товары' }
        ),
        content: fields.document({
          label: 'Текст',
          formatting: true,
          images: { directory: 'public/images/blog/content', publicPath: '/images/blog/content/' },
          
          // Подключаем блок как объект
          componentBlocks: {
            productCard: productCardBlock, 
          },
        }),
      },
    }),
  },
});