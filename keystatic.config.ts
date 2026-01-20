import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: import.meta.env.PROD
    ? {
        kind: 'github',
        repo: 'GeorgeMoroz12/hyle',
      }
    : {
        kind: 'local',
      },
  // Упрощенная схема для теста
  collections: {
    products: collection({
      label: '🏺 Товары',
      slugField: 'title',
      path: 'src/content/products/*',
      schema: {
        title: fields.slug({ name: { label: 'Название' } }),
        price: fields.number({ label: 'Цена' }),
      },
    }),
  },
});