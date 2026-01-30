import { config, fields, collection, singleton } from '@keystatic/core';

// --- БЛОКИ ---
const productCardBlock = {
  label: '🛍️ Карточка товара',
  schema: {
    item: fields.relationship({
      label: 'Выберите товар',
      collection: 'products',
      validation: { isRequired: true },
    }),
  },
  preview: (props: any) => props.fields.item.value 
    ? `📦 Товар: ${props.fields.item.value}` 
    : '⚠️ Выберите товар...',
};

export default config({
  storage: import.meta.env.PROD
    ? { kind: 'github', repo: 'GeorgeMoroz12/hyle' }
    : { kind: 'local' },

  singletons: {
    // 1. LANDING (Вернули классический вид)
    landing: singleton({
      label: 'Главная страница',
      path: 'src/content/landing/home',
      schema: {
        // HERO СЕКЦИЯ (Одиночная)
        heroTitleLine1: fields.text({ label: 'Hero: Заголовок 1', defaultValue: 'Глина' }),
        heroTitleAccent: fields.text({ label: 'Hero: Акцент', defaultValue: 'хранит' }),
        heroTitleLine2: fields.text({ label: 'Hero: Заголовок 2', defaultValue: 'тепло.' }),
        
        heroDescription: fields.text({ label: 'Hero: Описание', multiline: true }),
        
        heroImage: fields.image({
            label: 'Hero: Фото',
            directory: 'public/images/landing',
            publicPath: '/images/landing/',
            validation: { isRequired: true }
        }),

        // WORKSHOP СЕКЦИЯ
        workshopTitle: fields.text({ label: 'Workshop: Заголовок' }),
        workshopText: fields.text({ label: 'Workshop: Текст', multiline: true }),
        workshopImage: fields.image({
            label: 'Workshop: Фото',
            directory: 'public/images/landing',
            publicPath: '/images/landing/'
        }),
      },
    }),

    // 2. ABOUT
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

    // 3. B2B
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
        // ПРИОРИТЕТ
        sortOrder: fields.number({
          label: '🔢 Приоритет сортировки',
          defaultValue: 0,
        }),

        // ОСНОВНОЕ
        images: fields.array(
          fields.image({ label: 'Фото', directory: 'public/images/products', publicPath: '/images/products/' }),
          { label: 'Фотографии', itemLabel: (props) => `Фото #${props.index + 1}` }
        ),
        title: fields.slug({ name: { label: 'Название' } }),
        
        // ЦЕНА И МАРКЕТИНГ
        price: fields.number({ label: 'Цена (₽)' }),
        
        isNew: fields.checkbox({ 
            label: '🔥 Новинка', 
            description: 'Показать в блоке "Новое из печи".' 
        }),
        isSale: fields.checkbox({ 
            label: '🏷️ Акция', 
            description: 'Товар по акции.' 
        }),
        oldPrice: fields.number({ 
            label: 'Старая цена (₽)', 
            description: 'Будет зачеркнута.' 
        }),

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
        
        // SEO
        seo: fields.object({
          title: fields.text({ label: 'SEO Title' }),
          description: fields.text({ label: 'SEO Description', multiline: true }),
          ogImage: fields.image({ label: 'OG Image', directory: 'public/images/products/seo', publicPath: '/images/products/seo/' }),
        }, { label: '🔍 SEO' }),

        specs: fields.object({
          volume: fields.text({ label: 'Объем' }),
          size: fields.text({ label: 'Размер' }),
          material: fields.text({ label: 'Материал' }),
        }, { label: 'Характеристики' }),
        
        careInstructions: fields.text({ label: 'Уход', multiline: true }),
        masterNote: fields.text({ label: 'Заметка мастера', multiline: true }),
        description: fields.document({ label: 'Описание', formatting: true }),
        
        // Legacy
        inStock: fields.checkbox({ label: '⚠️ Old: inStock' }),
        isNewLegacy: fields.checkbox({ label: '⚠️ Old: isNew (Legacy)' }),
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
        title: fields.slug({ name: { label: 'Заголовок' } }),
        pubDate: fields.date({ label: 'Дата', defaultValue: { kind: 'today' } }),
        coverImage: fields.image({
          label: 'Обложка',
          directory: 'public/images/blog',
          publicPath: '/images/blog/',
        }),
        seo: fields.object({
          title: fields.text({ label: 'SEO Title' }),
          description: fields.text({ label: 'SEO Description', multiline: true }),
          ogImage: fields.image({ label: 'OG Image', directory: 'public/images/blog/seo', publicPath: '/images/blog/seo/' }),
        }, { label: '🔍 SEO' }),
        relatedProducts: fields.array(
          fields.relationship({ label: 'Товар', collection: 'products' }),
          { label: 'Товары' }
        ),
        content: fields.document({
          label: 'Текст',
          formatting: true,
          images: { directory: 'public/images/blog/content', publicPath: '/images/blog/content/' },
          componentBlocks: { productCard: productCardBlock },
        }),
      },
    }),
  },
});