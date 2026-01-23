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
    // 1. Landing
    landing: singleton({
      label: 'Главная страница', // Убрали 🏠
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

    // 2. About
    about: singleton({
      label: 'О Мастере', // Убрали 👤
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

    // 3. B2B
    b2b: singleton({
      label: 'Страница B2B', // Убрали 💼
      path: 'src/content/b2b/main',
      schema: {
        title: fields.text({ label: 'Заголовок' }),
        content: fields.document({ label: 'Текст', formatting: true }),
        contactButtonText: fields.text({ label: 'Текст кнопки' }),
      },
    }),
  },

  collections: {
    // СПРАВОЧНИКИ
    categories: collection({
      label: 'Категории', // Убрали 🗂
      slugField: 'title',
      path: 'src/content/categories/*',
      schema: { title: fields.slug({ name: { label: 'Название' } }) },
    }),

    tags: collection({
      label: 'Теги', // Убрали 🏷️
      slugField: 'title',
      path: 'src/content/tags/*',
      schema: { title: fields.slug({ name: { label: 'Название' } }) },
    }),

    // ТОВАРЫ
    products: collection({
      label: 'Товары', // Убрали 🏺
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
        
        category: fields.relationship({ 
          label: 'Категория', 
          collection: 'categories',
          validation: { isRequired: false }
        }),
        
        tags: fields.array(
          fields.relationship({ label: 'Тег', collection: 'tags' }),
          { label: 'Теги' }
        ),
        
        relatedProducts: fields.array(
          fields.relationship({ label: 'Товар', collection: 'products' }), 
          { label: 'С этим покупают' }
        ),

        specs: fields.object({
          volume: fields.text({ label: 'Объем' }),
          size: fields.text({ label: 'Размер' }),
          material: fields.text({ label: 'Материал' }),
        }, { label: 'Характеристики' }),
        
        careInstructions: fields.text({ label: 'Уход', multiline: true }),
        masterNote: fields.text({ label: 'Заметка мастера', multiline: true }),
        
        description: fields.document({ label: 'Описание', formatting: true }),

        // LEGACY (Старые поля, пока не удалили из файлов)
        inStock: fields.checkbox({ label: '⚠️ Old: inStock' }),
        isNew: fields.checkbox({ label: '⚠️ Old: isNew' }),
        care: fields.text({ label: '⚠️ Old: care', multiline: true }),
      },
    }),

    // БЛОГ
    blog: collection({
      label: 'Блог', // Убрали 📰
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
        relatedProducts: fields.array(
          fields.relationship({ label: 'Товар', collection: 'products' }),
          { label: 'Товары' }
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