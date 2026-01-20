import { config, fields, collection, singleton } from '@keystatic/core';

export default config({
  storage: import.meta.env.PROD
    ? {
        kind: 'github',
        // ВНИМАНИЕ: Здесь должно быть имя твоего репозитория на GitHub.
        // Судя по логам, это 'hyle', а не 'hyle-ceramics'.
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
    categories: collection({
      label: '🗂 Справочник: Категории',
      slugField: 'title',
      path: 'src/content/categories/*',
      schema: {
        title: fields.slug({ name: { label: 'Название категории' } }),
      },
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
          ],
          defaultValue: 'В наличии',
        }),
        category: fields.relationship({ 
          label: 'Категория', 
          collection: 'categories',
          validation: { isRequired: true }
        }),
        description: fields.document({ label: 'Описание', formatting: true }),
        specs: fields.object({
          volume: fields.text({ label: 'Объем (мл)' }),
          size: fields.text({ label: 'Размер (см)' }),
          material: fields.text({ label: 'Материал', defaultValue: 'Глина, глазурь' }),
        }, { label: 'Характеристики' }),
        tags: fields.array(fields.text({ label: 'Тег' }), {
          label: 'Теги',
          itemLabel: (props) => props.value,
        }),
        masterNote: fields.text({ label: 'Заметка мастера', multiline: true }),
        // Legacy поля для совместимости
        care: fields.text({ label: '⚠️ Old care', multiline: true }),
        inStock: fields.checkbox({ label: '⚠️ Old inStock' }),
        isNew: fields.checkbox({ label: '⚠️ Old isNew' }),
      },
    }),
  },
});