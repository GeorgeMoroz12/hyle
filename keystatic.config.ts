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

  collections: {
    // --- СПРАВОЧНИКИ (Создаешь тут, выбираешь в товарах) ---
    
    categories: collection({
      label: '🗂 Справочник: Категории',
      slugField: 'title',
      path: 'src/content/categories/*',
      schema: {
        title: fields.slug({ name: { label: 'Название категории' } }),
      },
    }),

    tags: collection({
      label: '🏷️ Справочник: Теги',
      slugField: 'title',
      path: 'src/content/tags/*',
      schema: {
        title: fields.slug({ name: { label: 'Название тега (Подарок, Хит...)' } }),
      },
    }),

    // --- ТОВАРЫ ---
    products: collection({
      label: '🏺 Товары',
      slugField: 'title',
      path: 'src/content/products/*',
      format: { contentField: 'description' },
      // Настраиваем красивые колонки в списке
      columns: ['title', 'status', 'price', 'category'],
      
      schema: {
        // 1. Картинки
        images: fields.array(
          fields.image({
            label: 'Фото',
            directory: 'public/images/products',
            publicPath: '/images/products/',
            validation: { isRequired: true }
          }),
          {
            label: 'Фотографии',
            itemLabel: (props) => `Фото #${props.index + 1}`,
          }
        ),

        // 2. Основное
        title: fields.slug({ name: { label: 'Название' } }),
        price: fields.number({ label: 'Цена (₽)', validation: { min: 0 } }),
        
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

        // 3. Выбор из справочников (Связи)
        category: fields.relationship({
          label: 'Категория',
          collection: 'categories', // Ссылка на справочник категорий
          // Убрали обязательность, чтобы можно было открыть старые товары и починить их
          description: 'Выберите категорию из справочника.',
        }),

        tags: fields.array(
          fields.relationship({ 
            label: 'Тег', 
            collection: 'tags' // Ссылка на справочник тегов
          }),
          {
            label: 'Теги',
            description: 'Выберите теги из справочника.',
            itemLabel: (props) => props.value || 'Выберите тег',
          }
        ),

        relatedProducts: fields.array(
          fields.relationship({ label: 'Товар', collection: 'products' }),
          { label: 'С этим товаром покупают', itemLabel: (props) => props.value || 'Товар' }
        ),

        // 4. Характеристики
        specs: fields.object({
          volume: fields.text({ label: 'Объем (мл)' }),
          size: fields.text({ label: 'Размер (см)' }),
          material: fields.text({ label: 'Материалы', defaultValue: 'Шамот, глазурь' }),
        }, { label: 'Характеристики' }),

        careInstructions: fields.text({ label: 'Уход', multiline: true }),
        masterNote: fields.text({ label: 'Заметка мастера', multiline: true }),

        // 5. Описание
        description: fields.document({
          label: 'Описание',
          formatting: true,
          dividers: true,
          links: true,
        }),

        // --- LEGACY (Вернули для совместимости) ---
        care: fields.text({ label: '⚠️ Old care (Удалить после переноса)', multiline: true }),
        inStock: fields.checkbox({ label: '⚠️ Old inStock (Удалить)' }),
        isNew: fields.checkbox({ label: '⚠️ Old isNew (Удалить)' }),
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