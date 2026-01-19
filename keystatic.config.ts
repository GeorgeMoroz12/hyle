import { config, fields, collection, singleton } from '@keystatic/core';

// Проверяем наличие всех ключей для GitHub режима
const hasGitHubKeys = 
  !!process.env.KEYSTATIC_GITHUB_CLIENT_ID && 
  !!process.env.KEYSTATIC_GITHUB_CLIENT_SECRET && 
  !!process.env.KEYSTATIC_SECRET;

const isProd = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;

export default config({
  // Включаем GitHub только если мы на продакшене И у нас есть все ключи
  storage: (isProd && hasGitHubKeys)
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
      schema: {
        images: fields.array(
          fields.image({
            label: 'Фото',
            directory: 'public/images/products',
            publicPath: '/images/products/',
            validation: { isRequired: true }
          }),
          { label: 'Фотографии' }
        ),
        title: fields.slug({ name: { label: 'Название' } }),
        price: fields.number({ label: 'Цена (₽)', validation: { min: 0 } }),
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
      },
    }),
  },
});