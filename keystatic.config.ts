import { config, fields, collection } from '@keystatic/core';

export default config({
  // Оставляем логику GitHub/Local без изменений
  storage: import.meta.env.PROD
    ? {
        kind: 'github',
        repo: 'YOUR_GITHUB_USERNAME/hyle-ceramics', // Не забудь поменять перед деплоем!
      }
    : {
        kind: 'local',
      },
      
  collections: {
    products: collection({
      label: 'Каталог (Products)',
      slugField: 'title',
      path: 'src/content/products/*',
      format: { contentField: 'description' }, // Основной текст Markdown — это описание
      schema: {
        title: fields.slug({ name: { label: 'Название изделия' } }),
        price: fields.number({ label: 'Цена (₽)', validation: { min: 0 } }),
        
        // Категория (Select)
        category: fields.select({
          label: 'Категория',
          options: [
            { label: 'Чашки', value: 'Чашки' },
            { label: 'Тарелки', value: 'Тарелки' },
            { label: 'Вазы', value: 'Вазы' },
            { label: 'Подвески', value: 'Подвески' },
            { label: 'Другое', value: 'Другое' },
          ],
          defaultValue: 'Чашки',
        }),

        // Статус (Select вместо Checkbox)
        status: fields.select({
          label: 'Статус',
          options: [
            { label: 'В наличии', value: 'В наличии' },
            { label: 'Под заказ', value: 'Под заказ' },
            { label: 'Продано', value: 'Продано' },
          ],
          defaultValue: 'В наличии',
        }),

        // Теги (Массив строк)
        tags: fields.array(fields.text({ label: 'Тег' }), {
          label: 'Теги (Подарок, Новый год...)',
          itemLabel: (props) => props.value,
        }),

        // Группировка спецификаций
        specs: fields.object({
          volume: fields.text({ label: 'Объем (мл)' }),
          size: fields.text({ label: 'Размер (см)' }),
          material: fields.text({ label: 'Материалы', defaultValue: 'Керамика, глазурь' }),
        }),

        care: fields.text({ label: 'Инструкция по уходу', multiline: true }),

        // Основное описание (Markdown)
        description: fields.document({
          label: 'Описание и история',
          formatting: true,
          dividers: true,
          links: true,
          images: true,
        }),
      },
    }),

    blog: collection({
      label: 'Блог',
      slugField: 'title',
      path: 'src/content/blog/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Заголовок' } }),
        pubDate: fields.date({ label: 'Дата публикации' }),
        description: fields.text({ label: 'Краткий анонс' }),
        
        // Связанные товары (Relationship)
        relatedProducts: fields.array(
          fields.relationship({
            label: 'Упомянутый товар',
            collection: 'products',
          }),
          { label: 'Товары в этой статье', itemLabel: (props) => props.value || 'Товар' }
        ),

        content: fields.document({
          label: 'Текст статьи',
          formatting: true,
          images: true,
        }),
      },
    }),
  },
});