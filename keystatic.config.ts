import { config, fields, collection, singleton } from '@keystatic/core';

export default config({
  storage: import.meta.env.PROD
    ? {
        kind: 'github',
        repo: 'GeorgeMoroz12/hyle',
      }
    : {
        kind: 'local',
      },

  // --- ОДИНОЧНЫЕ СТРАНИЦЫ (SINGLETONS) ---
  singletons: {
    // 1. Главная страница
    landing: singleton({
      label: '🏠 Главная страница',
      path: 'src/content/landing/home',
      schema: {
        heroTitleLine1: fields.text({ label: 'Hero: Заголовок (Строка 1)', defaultValue: 'Глина' }),
        heroTitleAccent: fields.text({ label: 'Hero: Акцент (Курсив)', defaultValue: 'хранит' }),
        heroTitleLine2: fields.text({ label: 'Hero: Заголовок (Строка 2)', defaultValue: 'тепло.' }),
        heroDescription: fields.text({ label: 'Hero: Описание', multiline: true }),
        heroImage: fields.image({
            label: 'Hero: Главное фото',
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

    // 2. О Мастере (НОВОЕ)
    about: singleton({
      label: '👤 О Мастере',
      path: 'src/content/about/main',
      format: { contentField: 'content' },
      schema: {
        title: fields.text({ label: 'Заголовок страницы', defaultValue: 'О Мастере' }),
        heroImage: fields.image({
          label: 'Фото мастера или студии',
          directory: 'public/images/about',
          publicPath: '/images/about/',
          validation: { isRequired: true }
        }),
        content: fields.document({
          label: 'Текст / Манифест',
          formatting: true,
          dividers: true,
          links: true,
          images: {
            directory: 'public/images/about/content',
            publicPath: '/images/about/content/',
          },
        }),
      },
    }),

    // 3. B2B (Рестораны)
    b2b: singleton({
      label: '💼 Страница для Ресторанов',
      path: 'src/content/b2b/main',
      schema: {
        title: fields.text({ label: 'Заголовок' }),
        content: fields.document({ label: 'Текст условий', formatting: true }),
        contactButtonText: fields.text({ label: 'Текст кнопки' }),
      },
    }),
  },

  // --- КОЛЛЕКЦИИ (СПИСКИ) ---
  collections: {
    // 1. БЛОГ (НОВОЕ)
    blog: collection({
      label: '📰 Блог (Статьи)',
      slugField: 'title',
      path: 'src/content/blog/*',
      format: { contentField: 'content' },
      columns: ['title', 'pubDate'],
      schema: {
        title: fields.slug({ name: { label: 'Заголовок статьи' } }),
        pubDate: fields.date({ 
          label: 'Дата публикации', 
          defaultValue: { kind: 'today' }
        }),
        coverImage: fields.image({
          label: 'Обложка статьи',
          directory: 'public/images/blog',
          publicPath: '/images/blog/',
          validation: { isRequired: true }
        }),
        relatedProducts: fields.array(
          fields.relationship({ label: 'Товар', collection: 'products' }),
          { label: 'Упомянутые товары', itemLabel: (props) => props.value || 'Товар' }
        ),
        content: fields.document({
          label: 'Текст статьи',
          formatting: true,
          dividers: true,
          links: true,
          images: { 
            directory: 'public/images/blog/content', 
            publicPath: '/images/blog/content/' 
          },
        }),
      },
    }),

    // ... Остальные справочники и товары
    categories: collection({
      label: '🗂 Справочник: Категории',
      slugField: 'title',
      path: 'src/content/categories/*',
      schema: { title: fields.slug({ name: { label: 'Название' } }) },
    }),

    tags: collection({
      label: '🏷️ Справочник: Теги',
      slugField: 'title',
      path: 'src/content/tags/*',
      schema: { title: fields.slug({ name: { label: 'Название' } }) },
    }),

    products: collection({
      label: '🏺 Товары',
      slugField: 'title',
      path: 'src/content/products/*',
      format: { contentField: 'description' },
      columns: ['title', 'status', 'price', 'category'],
      schema: {
        images: fields.array(
          fields.image({ label: 'Фото', directory: 'public/images/products', publicPath: '/images/products/' }),
          { label: 'Фотографии' }
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
        category: fields.relationship({ label: 'Категория', collection: 'categories' }),
        tags: fields.array(fields.relationship({ label: 'Тег', collection: 'tags' }), { label: 'Теги', itemLabel: (props) => props.value }),
        relatedProducts: fields.array(fields.relationship({ label: 'Товар', collection: 'products' }), { label: 'С этим покупают' }),
        specs: fields.object({
          volume: fields.text({ label: 'Объем' }),
          size: fields.text({ label: 'Размер' }),
          material: fields.text({ label: 'Материал' }),
        }, { label: 'Характеристики' }),
        careInstructions: fields.text({ label: 'Уход', multiline: true }),
        masterNote: fields.text({ label: 'Заметка мастера', multiline: true }),
        description: fields.document({ label: 'Описание', formatting: true }),
      },
    }),
  },
});