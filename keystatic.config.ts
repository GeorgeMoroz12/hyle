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

  singletons: {
    // ... (Landing, About, B2B оставляем без изменений)
    landing: singleton({
      label: '🏠 Главная страница',
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
      label: '👤 О Мастере',
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
      label: '💼 Ресторанам (B2B)',
      path: 'src/content/b2b/main',
      schema: {
        title: fields.text({ label: 'Заголовок' }),
        content: fields.document({ label: 'Текст', formatting: true }),
        contactButtonText: fields.text({ label: 'Текст кнопки' }),
      },
    }),
  },

  collections: {
    // 1. СПРАВОЧНИК: КАТЕГОРИИ
    categories: collection({
      label: '🗂 Справочник: Категории',
      slugField: 'name',
      path: 'src/content/categories/*',
      schema: {
        name: fields.slug({ name: { label: 'Название категории' } }),
      },
    }),

    // 2. СПРАВОЧНИК: ТЕГИ
    tags: collection({
      label: '🏷️ Справочник: Теги',
      slugField: 'name',
      path: 'src/content/tags/*',
      schema: {
        name: fields.slug({ name: { label: 'Название тега' } }),
      },
    }),

    // 3. ТОВАРЫ (Связи)
    products: collection({
      label: '🏺 Товары',
      slugField: 'title',
      path: 'src/content/products/*',
      format: { contentField: 'description' },
      columns: ['title', 'status', 'price', 'category'],
      schema: {
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

        // RELATIONSHIP: Категория
        category: fields.relationship({
          label: 'Категория',
          collection: 'categories',
          validation: { isRequired: false }, // false, чтобы можно было сохранить старые товары без выбора
          description: 'Выберите категорию из справочника.',
        }),

        // RELATIONSHIP: Теги (Множественный выбор)
        tags: fields.array(
          fields.relationship({ 
            label: 'Тег', 
            collection: 'tags' 
          }),
          {
            label: 'Теги',
            itemLabel: (props) => props.value || 'Выберите тег',
            description: 'Выберите теги из справочника.',
          }
        ),

        relatedProducts: fields.array(
          fields.relationship({ label: 'Товар', collection: 'products' }),
          { label: 'С этим покупают', itemLabel: (props) => props.value || 'Товар' }
        ),

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

    // 4. БЛОГ (Связи)
    blog: collection({
      label: '📰 Блог',
      slugField: 'title',
      path: 'src/content/blog/*',
      format: { contentField: 'content' },
      columns: ['title', 'pubDate'],
      schema: {
        title: fields.slug({ name: { label: 'Заголовок' } }),
        pubDate: fields.date({ label: 'Дата', defaultValue: { kind: 'today' } }),
        coverImage: fields.image({
          label: 'Обложка',
          directory: 'public/images/blog',
          publicPath: '/images/blog/',
        }),
        
        // Добавили теги и в блог (полезно для фильтрации статей)
        tags: fields.array(
          fields.relationship({ label: 'Тег', collection: 'tags' }),
          { label: 'Теги статьи', itemLabel: (props) => props.value }
        ),

        relatedProducts: fields.array(
          fields.relationship({ label: 'Товар', collection: 'products' }),
          { label: 'Упомянутые товары', itemLabel: (props) => props.value || 'Товар' }
        ),
        
        content: fields.document({
          label: 'Текст',
          formatting: true,
          images: { directory: 'public/images/blog/content', publicPath: '/images/blog/content/' },
        }),
      },
    }),
  },
});