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
    // 1. Landing (Главная)
    landing: singleton({
      label: '🏠 Главная страница',
      path: 'src/content/landing/home',
      schema: {
        // Hero Секция
        heroTitleLine1: fields.text({ label: 'Hero: Заголовок (Строка 1)', defaultValue: 'Глина' }),
        heroTitleAccent: fields.text({ label: 'Hero: Акцент (Курсив)', defaultValue: 'хранит' }),
        heroTitleLine2: fields.text({ label: 'Hero: Заголовок (Строка 2)', defaultValue: 'тепло.' }),
        
        heroDescription: fields.text({ 
          label: 'Hero: Описание', 
          multiline: true,
          defaultValue: 'Керамика с характером. Неидеальная форма, живая фактура.'
        }),
        
        heroImage: fields.image({
            label: 'Hero: Главное фото',
            directory: 'public/images/landing', // Отдельная папка для порядка
            publicPath: '/images/landing/'
        }),

        // Workshop Секция
        workshopTitle: fields.text({ label: 'Workshop: Заголовок', defaultValue: 'Красота в несовершенстве.' }),
        workshopText: fields.text({ 
          label: 'Workshop: Текст', 
          multiline: true,
          defaultValue: 'В блоге мы делимся процессом: как бесформенный кусок глины обретает характер.' 
        }),
        workshopImage: fields.image({
            label: 'Workshop: Фото процесса',
            directory: 'public/images/landing',
            publicPath: '/images/landing/'
        }),
      },
    }),

    // 2. B2B (Существующая)
    b2b: singleton({
      label: '💼 Страница для Ресторанов',
      path: 'src/content/b2b/main',
      schema: {
        title: fields.text({ label: 'Заголовок', defaultValue: 'Сотрудничество' }),
        content: fields.document({ label: 'Текст условий', formatting: true }),
        contactButtonText: fields.text({ label: 'Текст кнопки', defaultValue: 'Написать нам' }),
      },
    }),
  },

  // --- КОЛЛЕКЦИИ (БЕЗ ИЗМЕНЕНИЙ) ---
  collections: {
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
          fields.image({
            label: 'Фото',
            directory: 'public/images/products',
            publicPath: '/images/products/',
            validation: { isRequired: true }
          }),
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
          validation: { isRequired: true }
        }),
        tags: fields.array(
          fields.relationship({ label: 'Тег', collection: 'tags' }),
          { label: 'Теги', itemLabel: (props) => props.value || 'Выберите тег' }
        ),
        relatedProducts: fields.array(
          fields.relationship({ label: 'Товар', collection: 'products' }),
          { label: 'С этим товаром покупают', itemLabel: (props) => props.value || 'Товар' }
        ),
        specs: fields.object({
          volume: fields.text({ label: 'Объем (мл)' }),
          size: fields.text({ label: 'Размер (см)' }),
          material: fields.text({ label: 'Материал', defaultValue: 'Глина, глазурь' }),
        }, { label: 'Характеристики' }),
        careInstructions: fields.text({ label: 'Уход', multiline: true }),
        masterNote: fields.text({ label: 'Заметка мастера', multiline: true }),
        description: fields.document({
          label: 'Описание',
          formatting: true,
          dividers: true,
          links: true,
        }),
      },
    }),

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