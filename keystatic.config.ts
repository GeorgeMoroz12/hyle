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
    // 1. НОВАЯ КОЛЛЕКЦИЯ ДЛЯ КАТЕГОРИЙ
    // Это и есть твоя "кнопка" для добавления новых категорий без кода.
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
        // --- ВИЗУАЛ ---
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

        // --- ОСНОВНОЕ ---
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

        // ИЗМЕНЕНО: Теперь здесь связь с коллекцией "categories"
        category: fields.relationship({
          label: 'Категория',
          description: 'Выберите категорию из справочника. Если нужной нет — создайте её в разделе "🗂 Справочник: Категории".',
          collection: 'categories',
          validation: { isRequired: true },
        }),

        // --- СВЯЗИ ---
        relatedProducts: fields.array(
          fields.relationship({ label: 'Товар', collection: 'products' }),
          { label: 'С этим товаром покупают', itemLabel: (props) => props.value || 'Товар' }
        ),

        tags: fields.array(fields.text({ label: 'Тег' }), {
          label: 'Теги',
          itemLabel: (props) => props.value,
        }),

        // --- ДЕТАЛИ ---
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

        // --- LEGACY (УСТАРЕВШЕЕ) ---
        // Поля, оставленные для совместимости со старыми файлами
        care: fields.text({
          label: '⚠️ Старое поле: care (Перенесите текст в Уход и удалите)',
          multiline: true,
        }),
        inStock: fields.checkbox({ 
          label: '⚠️ Старое поле: inStock (Не использовать)',
          description: 'Это поле осталось от старой версии. Просто игнорируйте его.'
        }),
        isNew: fields.checkbox({ 
          label: '⚠️ Старое поле: isNew (Не использовать)',
          description: 'Это поле осталось от старой версии.'
        }),
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