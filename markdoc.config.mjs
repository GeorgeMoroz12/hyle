import { defineMarkdocConfig, component } from '@astrojs/markdoc/config';

export default defineMarkdocConfig({
  tags: {
    // Регистрируем тег 'productCard' (важно: название должно совпадать с Keystatic)
    productCard: {
      render: 'ProductCard', // Имя компонента .astro, который будет рисовать карточку
      attributes: {
        item: { type: String }, // Принимаем slug товара
      },
    },
  },
});