import { config, fields, collection, singleton } from '@keystatic/core';

export default config({
  storage: import.meta.env.PROD
    ? {
        kind: 'github',
        // ВАЖНО: Твой реальный репозиторий
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
    // 1. Справочник категорий
    categories: collection({
      label: '🗂 Справочник: Категории',
      slugField: 'title',
      path: 'src/content/categories/*',
      schema: {
        title: fields.slug({ name: { label: 'Название категории' } }),
      },
    }),

    // 2. Товары
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
          {
            label: 'Фотографии изделия',
            itemLabel: (props) => `Фото #${props.index + 1}`,
          }
        ),

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

        category: fields.relationship({
          label: 'Категория',
          description: 'Выберите категорию из справочника.',
          collection: 'categories',
          validation: { isRequired: true },
        }),

        relatedProducts: fields.array(
          fields.relationship({ label: 'Товар', collection: 'products' }),
          { label: 'С этим товаром покупают', itemLabel: (props) => props.value || 'Товар' }
        ),

        tags: fields.array(fields.text({ label: 'Тег' }), {
          label: 'Теги',
          itemLabel: (props) => props.value,
        }),

        specs: fields.object({
          volume: fields.text({ label: 'Объем (мл)' }),
          size: fields.text({ label: 'Размер (см)' }),
          material: fields.text({ label: 'Материалы', defaultValue: 'Шамот, глазурь' }),
        }, { label: 'Характеристики' }),

        careInstructions: fields.text({ label: 'Уход', multiline: true }),

        description: fields.document({
          label: 'Описание',
          formatting: true,
          dividers: true,
          links: true,
        }),

        masterNote: fields.text({
          label: 'Заметка мастера',
          multiline: true,
        }),

        // Legacy поля
        care: fields.text({ label: '⚠️ Old care', multiline: true }),
        inStock: fields.checkbox({ label: '⚠️ Old inStock' }),
        isNew: fields.checkbox({ label: '⚠️ Old isNew' }),
      },
    }),

    blog: collection({
      label: '📰 Статьи',
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