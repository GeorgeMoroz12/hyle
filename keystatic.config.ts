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

// --- HELPER: SEO Fields ---
// Чтобы не дублировать код, вынесем настройки SEO в функцию
const seoFields = {
  seo: fields.object({
    title: fields.text({ 
      label: 'SEO Заголовок (Title)', 
      description: 'Если пусто — берется название страницы. (Синий текст в Google)',
      validation: { length: { max: 60 } }
    }),
    description: fields.text({ 
      label: 'SEO Описание (Meta Description)', 
      multiline: true, 
      description: 'Краткое описание для поисковиков. (Серый текст)',
      validation: { length: { max: 160 } }
    }),
    // Картинку настраиваем отдельно в каждом блоке, так как разные папки
  }, { label: '🔍 SEO Настройки (Meta & Social)' }),
};

export default config({
  storage: import.meta.env.PROD
    ? { kind: 'github', repo: 'GeorgeMoroz12/hyle' }
    : { kind: 'local' },

  singletons: {
    // 1. LANDING
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
            publicPath: '/images/landing/',
            validation: { isRequired: true }
        }),

        workshopTitle: fields.text({ label: 'Workshop: Заголовок' }),
        workshopText: fields.text({ label: 'Workshop: Текст', multiline: true }),
        workshopImage: fields.image({
            label: 'Workshop: Фото',
            directory: 'public/images/landing',
            publicPath: '/images/landing/'
        }),

        // SEO для Главной
        seo: fields.object({
          title: fields.text({ label: 'SEO Title' }),
          description: fields.text({ label: 'SEO Description', multiline: true }),
          ogImage: fields.image({ 
            label: 'OG Image (Соцсети)', 
            directory: 'public/images/landing/seo', 
            publicPath: '/images/landing/seo/' 
          }),
        }, { label: '🔍 SEO Настройки' }),

        // Legacy (чтобы не ломать старый файл)
        heroSlides: fields.array(
          fields.object({
            image: fields.image({ label: 'Фото', directory: 'public/images/landing', publicPath: '/images/landing/' }),
            titleLine1: fields.text({ label: 'Заголовок' }),
            description: fields.text({ label: 'Описание' }),
          }),
          { label: '⚠️ Old: Hero Slides (Удалить)', itemLabel: (props) => 'Слайд' }
        ),
        faq: fields.array(
          fields.object({ question: fields.text({ label: 'Вопрос' }), answer: fields.text({ label: 'Ответ' }) }),
          { label: '⚠️ Old: FAQ (Удалить)', itemLabel: (props) => 'Вопрос' }
        ),
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
        
        // SEO для О Мастере
        seo: fields.object({
          title: fields.text({ label: 'SEO Title' }),
          description: fields.text({ label: 'SEO Description', multiline: true }),
          ogImage: fields.image({ 
            label: 'OG Image', 
            directory: 'public/images/about/seo', 
            publicPath: '/images/about/seo/' 
          }),
        }, { label: '🔍 SEO Настройки' }),

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
        
        // SEO для B2B
        seo: fields.object({
          title: fields.text({ label: 'SEO Title' }),
          description: fields.text({ label: 'SEO Description', multiline: true }),
          ogImage: fields.image({ 
            label: 'OG Image', 
            directory: 'public/images/b2b/seo', 
            publicPath: '/images/b2b/seo/' 
          }),
        }, { label: '🔍 SEO Настройки' }),

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
        sortOrder: fields.number({ label: '🔢 Приоритет сортировки', defaultValue: 0 }),
        images: fields.array(
          fields.image({ label: 'Фото', directory: 'public/images/products', publicPath: '/images/products/' }),
          { label: 'Фотографии', itemLabel: (props) => `Фото #${props.index + 1}` }
        ),
        title: fields.slug({ name: { label: 'Название' } }),
        price: fields.number({ label: 'Цена (₽)' }),
        isNew: fields.checkbox({ label: '🔥 Новинка' }),
        isSale: fields.checkbox({ label: '🏷️ Акция' }),
        oldPrice: fields.number({ label: 'Старая цена (₽)' }),
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
        
        // SEO для Товаров
        seo: fields.object({
          title: fields.text({ label: 'SEO Title' }),
          description: fields.text({ label: 'SEO Description', multiline: true }),
          ogImage: fields.image({ label: 'OG Image', directory: 'public/images/products/seo', publicPath: '/images/products/seo/' }),
        }, { label: '🔍 SEO Настройки' }),

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
        
        // SEO для Блога
        seo: fields.object({
          title: fields.text({ label: 'SEO Title' }),
          description: fields.text({ label: 'SEO Description', multiline: true }),
          ogImage: fields.image({ label: 'OG Image', directory: 'public/images/blog/seo', publicPath: '/images/blog/seo/' }),
        }, { label: '🔍 SEO Настройки' }),

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